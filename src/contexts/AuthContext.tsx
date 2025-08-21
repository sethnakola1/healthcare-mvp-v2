// src/contexts/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ApiService, {  LoginResponse } from '../services/api.service';
import { User } from '../types';

interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;

  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (user: User) => void;

  // Utilities
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser');

        if (storedToken && storedUser) {
          // Check if token is expired before validating
          if (ApiService.isTokenExpired(storedToken)) {
            clearAuthData();
            return;
          }

          // Validate token with backend
          const isValid = await ApiService.validateToken(storedToken);

          if (isValid) {
            setToken(storedToken);

            try {
              // Get fresh user data from backend
              const freshUserData = await ApiService.getCurrentUser(storedToken);
              setUser(freshUserData);

              // Update stored user data
              localStorage.setItem('authUser', JSON.stringify(freshUserData));
            } catch (error) {
              // If getting fresh user data fails, use stored data
              console.warn('Failed to fetch fresh user data, using stored data:', error);
              setUser(JSON.parse(storedUser));
            }
          } else {
            clearAuthData();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('refreshToken');
  };

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);

      // Perform login
      const loginResponse: LoginResponse = await ApiService.login({ email, password });
      
      // Get detailed user info
      const userDetails = await ApiService.getCurrentUser(loginResponse.accessToken);

      // Update state
      setToken(loginResponse.accessToken);
      setUser(userDetails);

      // Persist to localStorage
      localStorage.setItem('authToken', loginResponse.accessToken);
      localStorage.setItem('authUser', JSON.stringify(userDetails));

      if (loginResponse.refreshToken) {
        localStorage.setItem('refreshToken', loginResponse.refreshToken);
      }

      console.log('Login successful:', {
        userId: userDetails.userId,
        email: userDetails.email,
        role: userDetails.role
      });

    } catch (error) {
      console.error('Login failed:', error);
      clearAuthData();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await ApiService.logout(token);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      clearAuthData();
      setLoading(false);
    }
  };

  const refreshAuth = async (): Promise<void> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');

      if (!storedRefreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshResponse = await ApiService.refreshToken({
        refreshToken: storedRefreshToken
      });

      // Update tokens
      setToken(refreshResponse.accessToken);
      localStorage.setItem('authToken', refreshResponse.accessToken);

      if (refreshResponse.refreshToken) {
        localStorage.setItem('refreshToken', refreshResponse.refreshToken);
      }

      // Get fresh user data
      const userDetails = await ApiService.getCurrentUser(refreshResponse.accessToken);
      setUser(userDetails);
      localStorage.setItem('authUser', JSON.stringify(userDetails));

    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      throw error;
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('authUser', JSON.stringify(updatedUser));
  };

  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    // State
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,

    // Actions
    login,
    logout,
    refreshAuth,
    updateUser,

    // Utilities
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
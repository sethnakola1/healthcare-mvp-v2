import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, LoginResponse, RegisterRequest } from '../services/auth.service';

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  roleDisplayName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (token) {
          // Validate token and get user info
          const userInfo = await authService.getCurrentUser();
          setUser({
            userId: userInfo.userId,
            email: userInfo.email,
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            role: userInfo.role,
            roleDisplayName: userInfo.roleDisplayName
          });
        }
      } catch (err) {
        console.error('Auth initialization failed:', err);
        // Clear invalid token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: LoginResponse = await authService.login({ email, password });

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user state
      setUser({
        userId: response.userId,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        role: response.role,
        roleDisplayName: response.role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
      });
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);

      // Auto-login after successful registration
      await login(userData.email, userData.password);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Clear user state
    setUser(null);
    setError(null);

    // Call logout API (optional)
    authService.logout().catch(console.error);
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
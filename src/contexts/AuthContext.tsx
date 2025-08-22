// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  role: string;
  roleDisplayName: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType {
  authState: AuthState;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

interface AuthContextType {
  authState: AuthState;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUser: (user: User) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token, refreshToken: refreshToken || '' }
          });
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          logout();
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authService.login({ email, password });

      if (response.success && response.data) {
        const { accessToken, refreshToken: newRefreshToken, ...userData } = response.data;

        const user: User = {
          userId: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          username: userData.email,
          role: userData.role,
          roleDisplayName: userData.role.replace('_', ' '),
          isActive: true,
          emailVerified: true,
        };

        // Store in localStorage
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: accessToken, refreshToken: newRefreshToken }
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const refreshTokenFn = async (): Promise<void> => {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
      logout();
      return;
    }

    try {
      const response = await authService.refreshToken({ refreshToken: storedRefreshToken });

      if (response.success && response.data) {
        const { accessToken, refreshToken: newRefreshToken, ...userData } = response.data;

        const user: User = {
          userId: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          username: userData.email,
          role: userData.role,
          roleDisplayName: userData.role.replace('_', ' '),
          isActive: true,
          emailVerified: true,
        };

        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: accessToken, refreshToken: newRefreshToken }
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const updateUser = (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const contextValue: AuthContextType = {
    authState,
    user: authState.user,
    login,
    logout,
    refreshToken: refreshTokenFn,
    updateUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
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
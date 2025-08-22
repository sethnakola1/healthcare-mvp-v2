import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';

// Types
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
  commissionPercentage?: number;
  targetHospitalsMonthly?: number;
  totalHospitalsBrought?: number;
  totalCommissionEarned?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  user: User | null;
}

// Action Types
type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REFRESH_START' }
  | { type: 'REFRESH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REFRESH_FAILURE' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial State
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
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
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      };

    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        token: null,
        refreshToken: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        token: null,
        refreshToken: null,
      };

    case 'REFRESH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'REFRESH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        token: action.payload.token,
      };

    case 'REFRESH_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
        refreshToken: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// API Base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// AuthProvider Component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  // API Helper Function
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'An error occurred');
    }

    return data;
  };

  // Login Function
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data) {
        const { accessToken, refreshToken, ...userData } = response.data;

        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Create user object
        const user: User = {
          userId: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          username: userData.email,
          role: userData.role,
          roleDisplayName: userData.role,
          isActive: true,
          emailVerified: true,
        };

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user, token: accessToken, refreshToken },
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed. Please try again.',
      });
      throw error;
    }
  };

  // Logout Function
  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: 'LOGOUT' });
  };

  // Refresh Auth Function
  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      dispatch({ type: 'REFRESH_FAILURE' });
      return;
    }

    dispatch({ type: 'REFRESH_START' });

    try {
      const response = await apiCall('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });

      if (response.success && response.data) {
        const { accessToken, ...userData } = response.data;

        // Update stored token
        localStorage.setItem('accessToken', accessToken);

        // Create user object
        const user: User = {
          userId: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: `${userData.firstName} ${userData.lastName}`,
          username: userData.email,
          role: userData.role,
          roleDisplayName: userData.role,
          isActive: true,
          emailVerified: true,
        };

        dispatch({
          type: 'REFRESH_SUCCESS',
          payload: { user, token: accessToken },
        });
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      dispatch({ type: 'REFRESH_FAILURE' });
    }
  };

  // Clear Error Function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Get Current User Function
  const getCurrentUser = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      return;
    }

    try {
      const response = await apiCall('/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success && response.data) {
        const userData = response.data;
        const user: User = {
          userId: userData.userId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          fullName: userData.fullName || `${userData.firstName} ${userData.lastName}`,
          username: userData.username,
          role: userData.role,
          roleDisplayName: userData.roleDisplayName,
          isActive: userData.isActive,
          emailVerified: userData.emailVerified,
          phoneNumber: userData.phoneNumber,
          territory: userData.territory,
          partnerCode: userData.partnerCode,
          lastLogin: userData.lastLogin,
          createdAt: userData.createdAt,
          commissionPercentage: userData.commissionPercentage,
          targetHospitalsMonthly: userData.targetHospitalsMonthly,
          totalHospitalsBrought: userData.totalHospitalsBrought,
          totalCommissionEarned: userData.totalCommissionEarned,
        };

        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user,
            token,
            refreshToken: localStorage.getItem('refreshToken') || ''
          },
        });
      }
    } catch (error) {
      console.error('Get current user error:', error);
      // If getting current user fails, try to refresh the token
      await refreshAuth();
    }
  };

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        dispatch({ type: 'SET_LOADING', payload: true });
        await getCurrentUser();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeAuth();
  }, []);

  const contextValue: AuthContextType = {
    authState,
    login,
    logout,
    refreshAuth,
    clearError,
    user: authState.user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
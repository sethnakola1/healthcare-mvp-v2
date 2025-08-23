import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import Cookies from 'js-cookie';

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
  hospitalId?: string;
  hospitalName?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_USER'; payload: User };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        loading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        loading: false,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        loading: false,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        ...initialState,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from stored tokens
  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('access_token');
      const refreshToken = Cookies.get('refresh_token');

      if (token) {
        try {
          // Validate token and get user info
          const userResponse = await authService.getCurrentUser(token);
          if (userResponse.success) {
            dispatch({
              type: 'AUTH_SUCCESS',
              payload: {
                user: userResponse.data,
                token,
                refreshToken: refreshToken || '',
              },
            });
          } else {
            // Token is invalid, clear cookies
            Cookies.remove('access_token');
            Cookies.remove('refresh_token');
          }
        } catch (error) {
          console.error('Failed to initialize auth:', error);
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
        }
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authService.login(email, password);

      if (response.success) {
        const { accessToken, refreshToken: newRefreshToken, ...userData } = response.data;

        // Store tokens in cookies
        Cookies.set('access_token', accessToken, { expires: 1 }); // 1 day
        Cookies.set('refresh_token', newRefreshToken, { expires: 7 }); // 7 days

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
          type: 'AUTH_SUCCESS',
          payload: {
            user,
            token: accessToken,
            refreshToken: newRefreshToken,
          },
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authService.register(userData);

      if (response.success) {
        // After successful registration, automatically log the user in
        await login(userData.email, userData.password);
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: errorMessage });
      throw error;
    }
  };

  const logout = (): void => {
    // Remove tokens from cookies
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');

    // Clear auth state
    dispatch({ type: 'AUTH_LOGOUT' });

    // Optional: Call backend logout endpoint
    authService.logout().catch(console.error);
  };

  const refreshAuth = async (): Promise<void> => {
    const refreshToken = Cookies.get('refresh_token');

    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const response = await authService.refreshToken(refreshToken);

      if (response.success) {
        const { accessToken, refreshToken: newRefreshToken, ...userData } = response.data;

        // Update tokens in cookies
        Cookies.set('access_token', accessToken, { expires: 1 });
        if (newRefreshToken) {
          Cookies.set('refresh_token', newRefreshToken, { expires: 7 });
        }

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
          type: 'AUTH_SUCCESS',
          payload: {
            user,
            token: accessToken,
            refreshToken: newRefreshToken || refreshToken,
          },
        });
      } else {
        logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshAuth,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
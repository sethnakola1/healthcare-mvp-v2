import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import AuthService from '../services/api.service';
import { UserProfile, AuthState } from '../types/auth.types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkSession: () => Promise<void>;
}

// interface AuthContextType {
//   user: any | null;  // Add this line
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   checkSession: () => Promise<void>;
// }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: UserProfile; sessionExpiry: number } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        sessionExpiry: action.payload.sessionExpiry,
        error: null,
      };

    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        sessionExpiry: null,
        error: null,
      };

    case 'CLEAR_ERROR':
      return { ...state, error: null };

    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionExpiry: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const checkSession = useCallback(async (): Promise<void> => {
    if (!AuthService.isAuthenticated()) {
      return;
    }

    try {
      dispatch({ type: 'AUTH_START' });
      const user = await AuthService.getCurrentUser();
      const sessionExpiry = Date.now() + (60 * 60 * 1000); // 1 hour

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, sessionExpiry }
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Session validation failed'
      });
      AuthService.clearClientData();
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'AUTH_START' });

      const loginResponse = await AuthService.login({ email, password });
      const user = await AuthService.getCurrentUser();
      const sessionExpiry = Date.now() + (loginResponse.expiresIn * 1000);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, sessionExpiry }
      });
    } catch (error: any) {
      dispatch({
        type: 'AUTH_ERROR',
        payload: error.message || 'Login failed'
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      AuthService.clearClientData();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const value: AuthContextType = {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    checkSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
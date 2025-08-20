// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import { AuthService } from '../services/auth.service';
import {
  AuthState,
  AuthContextType,
  UserProfile,
  BusinessRole,
  RegistrationRequest
} from '../types/auth.types';


// Action types for reducer
type AuthAction =
  | { type: 'AUTH_START' }
    | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'AUTH_SUCCESS'; payload: { user: UserProfile; sessionExpiry: number } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'UPDATE_USER'; payload: UserProfile };

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true, // Start with loading to check existing session
  loading: true, // Alias for isLoading
  error: null,
  sessionExpiry: null,
  token: null,
  refreshToken: null,
  accessToken: null, // Initialize accessToken
  isInitialized: false, // Initialize isInitialized
  loginAttempts: 0,
  lastLoginAttempt: new Date(), };

// Auth reducer with security considerations
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'AUTH_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        sessionExpiry: action.payload.sessionExpiry,
        isLoading: false,
        error: null,
      };

    case 'AUTH_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        sessionExpiry: null,
        isLoading: false,
        error: action.payload,
      };

    case 'AUTH_LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        sessionExpiry: null,
        isLoading: false,
        error: null,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};

// Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Security configuration
const SECURITY_CONFIG = {
  SESSION_CHECK_INTERVAL: 5 * 60 * 1000, // Check session every 5 minutes
  SESSION_WARNING_TIME: 5 * 60 * 1000,   // Warn 5 minutes before expiry
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000,      // 15 minutes lockout
};

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Security: Track login attempts to prevent brute force
  const [loginAttempts, setLoginAttempts] = React.useState(0);
  const [lockoutUntil, setLockoutUntil] = React.useState<number | null>(null);

  // Check if account is locked out
  const isLockedOut = useCallback(() => {
    if (!lockoutUntil) return false;
    if (Date.now() > lockoutUntil) {
      setLockoutUntil(null);
      setLoginAttempts(0);
      return false;
    }
    return true;
  }, [lockoutUntil]);

  // Session management
  const checkSession = useCallback(async () => {
    try {
      const user = await AuthService.getCurrentUser();

      // Calculate session expiry (assuming 1 hour from now if not provided)
      const sessionExpiry = Date.now() + (60 * 60 * 1000);

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, sessionExpiry }
      });
    } catch (error) {
      dispatch({
        type: 'AUTH_FAILURE',
        payload: 'Session expired. Please login again.'
      });
      await handleLogout();
    }
  }, []);

  // Login function with security measures
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    if (isLockedOut()) {
      const remainingTime = Math.ceil((lockoutUntil! - Date.now()) / 1000 / 60);
      throw new Error(`Account locked. Try again in ${remainingTime} minutes.`);
    }

    dispatch({ type: 'AUTH_START' });

    try {
      // Input validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }

      // const loginResponse = await AuthService.login(email, password);

      // Get user profile
      const user = await AuthService.getCurrentUser();

      // Calculate session expiry
      const sessionExpiry = Date.now() + (3600 * 1000); // Default to 1 hour if expiresIn is not provided

      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, sessionExpiry }
      });

      // Reset login attempts on successful login
      setLoginAttempts(0);
      setLockoutUntil(null);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';

      // Increment login attempts
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      // Implement lockout after max attempts
      if (newAttempts >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS) {
        setLockoutUntil(Date.now() + SECURITY_CONFIG.LOCKOUT_DURATION);
      }

      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      throw error;
    }
  }, [isLockedOut, lockoutUntil, loginAttempts]);

  // Logout function with cleanup
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear all client-side data
      AuthService.clearClientData();
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  }, []);

  // Register function
  const register = useCallback(async (data: RegistrationRequest): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      // Input validation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      await AuthService.register(data);

      // Auto-login after registration is not recommended for security
      // Instead, redirect to login page
      dispatch({ type: 'AUTH_LOGOUT' });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      dispatch({
        type: 'AUTH_FAILURE',
        payload: errorMessage
      });
      throw error;
    }
  }, []);

  // Refresh authentication
  const refreshAuth = useCallback(async (): Promise<void> => {
    try {
      await AuthService.refreshToken();
      await checkSession();
    } catch (error) {
      await handleLogout();
    }
  }, [checkSession, handleLogout]);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  // Role checking utilities
  const hasRole = useCallback((role: BusinessRole): boolean => {
    return state.user?.role === role;
  }, [state.user]);

  const hasAnyRole = useCallback((roles: BusinessRole[]): boolean => {
    return state.user ? roles.includes(state.user.role as BusinessRole) : false;
  }, [state.user]);

  // Session monitoring and auto-refresh
  useEffect(() => {
    let sessionCheckInterval: NodeJS.Timeout;
    let sessionWarningTimeout: NodeJS.Timeout;

    if (state.isAuthenticated && state.sessionExpiry) {
      // Set up session monitoring
      sessionCheckInterval = setInterval(() => {
        const now = Date.now();
        const timeUntilExpiry = state.sessionExpiry! - now;

        // Warn before expiry
        if (timeUntilExpiry <= SECURITY_CONFIG.SESSION_WARNING_TIME && timeUntilExpiry > 0) {
          console.warn('Session expiring soon');
          // You could show a modal here asking user to extend session
        }

        // Auto-logout on expiry
        if (timeUntilExpiry <= 0) {
          handleLogout();
        }
      }, SECURITY_CONFIG.SESSION_CHECK_INTERVAL);

      // Try to refresh token when close to expiry
      const refreshTime = state.sessionExpiry - SECURITY_CONFIG.SESSION_WARNING_TIME;
      const timeUntilRefresh = refreshTime - Date.now();

      if (timeUntilRefresh > 0) {
        sessionWarningTimeout = setTimeout(() => {
          refreshAuth();
        }, timeUntilRefresh);
      }
    }

    return () => {
      if (sessionCheckInterval) clearInterval(sessionCheckInterval);
      if (sessionWarningTimeout) clearTimeout(sessionWarningTimeout);
    };
  }, [state.isAuthenticated, state.sessionExpiry, handleLogout, refreshAuth]);

  // Initialize authentication state on app load
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Security: Detect tab visibility changes to refresh session
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && state.isAuthenticated) {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [state.isAuthenticated, checkSession]);

  const contextValue: AuthContextType = {
    authState: state,
    login,
    logout: handleLogout,
    register,
    refreshAuth,
    clearError,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
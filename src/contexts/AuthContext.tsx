import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  loginUser,
  getCurrentUser,
  logoutUser,
  clearError,
  initializeAuth,
  selectAuth
} from '../store/slices/authSlice';
import { User } from '../services/auth.service';

// Context type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector(selectAuth);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    dispatch(initializeAuth());

    // If we have a token but no user, try to get current user
    const token = localStorage.getItem('accessToken');
    if (token && !user) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, user]);

  // Context value
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    error,

    login: async (email: string, password: string) => {
      const result = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(result)) {
        // Login successful, get user details
        await dispatch(getCurrentUser());
      } else {
        throw new Error(result.payload || 'Login failed');
      }
    },

    logout: async () => {
      await dispatch(logoutUser());
    },

    clearError: () => {
      dispatch(clearError());
    },

    refreshUser: async () => {
      await dispatch(getCurrentUser());
    },
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

// Export User type for other components
export type { User };
// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  clearError,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError
} from '../store/slices/authSlice';
import { LoginRequest } from '../types/auth.types';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const error = useAppSelector(selectError);

  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on server, we should clear local state
    }
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    try {
      await dispatch(getCurrentUser()).unwrap();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const hasRole = useCallback((role: string) => {
    return user?.role === role;
  }, [user]);

  const hasAnyRole = useCallback((roles: string[]) => {
    return user?.role ? roles.includes(user.role) : false;
  }, [user]);

  return {
    // State
    authState,
    user,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login,
    logout,
    refreshUser,
    clearAuthError,
    hasRole,
    hasAnyRole,
  };
};
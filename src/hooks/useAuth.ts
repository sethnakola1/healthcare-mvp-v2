// src/hooks/useAuth.ts
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import {
  selectAuth,
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
  selectIsInitialized,
  initializeAuthAsync
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);
  const userRole = useAppSelector(selectUserRole);
  const isInitialized = useAppSelector(selectIsInitialized);

  // Initialize auth on first load
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeAuthAsync());
    }
  }, [dispatch, isInitialized]);

  return {
    ...auth,
    isAuthenticated,
    user,
    userRole,
    isInitialized,
  };
};
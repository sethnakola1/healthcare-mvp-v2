// src/components/ProtectedRoute.tsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { BusinessRole } from '../../types';
import { getCurrentUser, updateActivity, validateSession } from '../../store/slices/authSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { LoadingSpinner } from '../common';
// import { useAppDispatch, useAppSelector } from '../store/hooks';
// import { BusinessRole } from '../types/auth.types'; // Assume type
// import { getCurrentUser, validateSession, updateActivity } from '../store/slices/authSlice';
// import { LoadingSpinner } from './common/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: BusinessRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  redirectTo = '/login',
}) => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Update user activity
    dispatch(updateActivity());

    // Validate session on route change
    if (isAuthenticated) {
      dispatch(validateSession());
    } else {
      // Try to get current user if not authenticated (in case of page refresh)
      dispatch(getCurrentUser());
    }

    const handleActivity = () => dispatch(updateActivity());
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) => document.addEventListener(event, handleActivity, true));

    return () => {
      events.forEach((event) => document.removeEventListener(event, handleActivity, true));
    };
  }, [dispatch, isAuthenticated, location.pathname]);

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && !requiredRoles.includes(user.role as BusinessRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
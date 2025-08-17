// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Setup listeners for refetchOnFocus/refetchOnReconnect behaviors
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

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

// src/hooks/usePermissions.ts
import { useAppSelector } from '../store/hooks';
import {
  selectCanCreateBusinessUser,
  selectCanCreateHospital,
  selectCanCreateHospitalUser,
  selectCanManagePatients,
  selectUserRole
} from '../store/slices/authSlice';

export const usePermissions = () => {
  const userRole = useAppSelector(selectUserRole);
  const canCreateBusinessUser = useAppSelector(selectCanCreateBusinessUser);
  const canCreateHospital = useAppSelector(selectCanCreateHospital);
  const canCreateHospitalUser = useAppSelector(selectCanCreateHospitalUser);
  const canManagePatients = useAppSelector(selectCanManagePatients);

  // Additional permission checks
  const canViewAllHospitals = () => userRole === 'SUPER_ADMIN';
  const canViewHospitalDashboard = () => ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'].includes(userRole || '');
  const canManageAppointments = () => ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(userRole || '');
  const canViewReports = () => ['SUPER_ADMIN', 'HOSPITAL_ADMIN'].includes(userRole || '');
  const canManageBilling = () => ['HOSPITAL_ADMIN', 'BILLING_STAFF'].includes(userRole || '');
  const canPrescribeMedication = () => userRole === 'DOCTOR';
  const canViewMedicalRecords = () => ['DOCTOR', 'NURSE'].includes(userRole || '');

  return {
    userRole,
    canCreateBusinessUser,
    canCreateHospital,
    canCreateHospitalUser,
    canManagePatients,
    canViewAllHospitals,
    canViewHospitalDashboard,
    canManageAppointments,
    canViewReports,
    canManageBilling,
    canPrescribeMedication,
    canViewMedicalRecords,
  };
};

// src/components/common/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  fallbackPath = '/login'
}) => {
  const { isAuthenticated, user, isInitialized, isLoading } = useAuth();
  const location = useLocation();

  // Show loading while initializing auth
  if (!isInitialized || isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && user) {
    const userRole = user.role;
    const hasRequiredRole = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

// src/components/common/LoadingSpinner.tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizeClasses[size]}`}>
      </div>
    </div>
  );
};

export default LoadingSpinner;

// src/components/common/Unauthorized.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center">
          <Shield className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          You don't have permission to access this resource.
        </p>
        <div className="mt-6">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
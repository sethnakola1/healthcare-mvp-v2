// src/components/dashboard/DashboardRouter.tsx
import React, { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated, selectIsLoading } from '../../store/slices/authSlice';
import { UserRole } from '../../types/auth.types';

// Lazy load dashboard components for better performance
const SuperAdminDashboard = lazy(() => import('./SuperAdminDashboard'));
const HospitalAdminDashboard = lazy(() => import('./HospitalAdminDashboard'));
const DoctorDashboard = lazy(() => import('./DoctorDashboard'));

// Loading component
const DashboardLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-sm text-gray-600">Loading dashboard...</p>
    </div>
  </div>
);

// Error fallback component
const DashboardError: React.FC<{ role: string }> = ({ role }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="mt-2 text-sm font-medium text-gray-900">Dashboard Not Available</h3>
      <p className="mt-1 text-sm text-gray-500">
        Dashboard for role "{role}" is not implemented yet.
      </p>
    </div>
  </div>
);

const DashboardRouter: React.FC = () => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  // Show loading state
  if (isLoading) {
    return <DashboardLoading />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role as UserRole;

  // Render appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (userRole) {
      case 'SUPER_ADMIN':
        return <SuperAdminDashboard />;

      case 'HOSPITAL_ADMIN':
        return <HospitalAdminDashboard />;

      case 'DOCTOR':
        return <DoctorDashboard />;

      default:
        return <DashboardError role={userRole} />;
    }
  };

  return (
    <Suspense fallback={<DashboardLoading />}>
      {renderDashboard()}
    </Suspense>
  );
};

export default DashboardRouter;
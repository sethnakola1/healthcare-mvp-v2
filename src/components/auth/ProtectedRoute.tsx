import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login',
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access if required roles are specified
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role =>
      user.role === role || user.role === 'SUPER_ADMIN' // Super admin has access to everything
    );

    if (!hasRequiredRole) {
      return (
        <div className="access-denied">
          <div className="access-denied-container">
            <h2>Access Denied</h2>
            <p>You don't have permission to access this page.</p>
            <p>Required roles: {requiredRoles.join(', ')}</p>
            <p>Your role: {user.roleDisplayName}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="back-button"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
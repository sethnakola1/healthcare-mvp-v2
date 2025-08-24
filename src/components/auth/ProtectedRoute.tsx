import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
interface ProtectedRouteProps {
children: React.ReactNode;
requiredRoles?: string[];
fallbackPath?: string;
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
children,
requiredRoles = [],
fallbackPath = '/login'
}) => {
const { isAuthenticated, user, loading } = useAuth();
const location = useLocation();
const navigate = useNavigate();
useEffect(() => {
// If not authenticated and not loading, redirect to login
if (!loading && !isAuthenticated) {
navigate(fallbackPath, {
state: { from: location },
replace: true
});
}
}, [isAuthenticated, loading, navigate, fallbackPath, location]);
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
// If not authenticated, show nothing (navigation will happen via useEffect)
if (!isAuthenticated) {
return null;
}
// Check role-based access
if (requiredRoles.length > 0 && user) {
const userRole = user.role;
const hasRequiredRole = requiredRoles.includes(userRole) || userRole === 'SUPER_ADMIN';
if (!hasRequiredRole) {
  return (
    <div className="access-denied">
      <h2>Access Denied</h2>
      <p>You don't have permission to access this page.</p>
      <p>Required roles: {requiredRoles.join(', ')}</p>
      <p>Your role: {userRole}</p>
    </div>
  );
}
}
// If all checks pass, render the protected content
return <>{children}</>;
};
export default ProtectedRoute;
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { getCurrentUser } from './store/slices/authSlice';
import { BusinessRole } from './types/auth.types';

// Components
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import ErrorBoundary from './components/common/ErrorBoundary';
import Layout from './components/common/Layout';
// import DebugPanel from './components/debug/DebugPanel';

// Initialize debug utilities
import './utils/debug';
// import DebugPanel from './components/debug/DebugPanel';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    // Try to get current user on app load, but only once
    if (!initialLoadComplete) {
      dispatch(getCurrentUser()).finally(() => {
        setInitialLoadComplete(true);
      });
    }
  }, [dispatch, initialLoadComplete]);

  const getDashboardRoute = (role: BusinessRole): string => {
    switch (role) {
      case BusinessRole.SUPER_ADMIN:
        return '/dashboard/super-admin';
      case BusinessRole.TECH_ADVISOR:
        return '/dashboard/tech-advisor';
      case BusinessRole.HOSPITAL_ADMIN:
        return '/dashboard/hospital-admin';
      case BusinessRole.DOCTOR:
        return '/dashboard/doctor';
      case BusinessRole.NURSE:
        return '/dashboard/nurse';
      case BusinessRole.PATIENT:
        return '/dashboard/patient';
      default:
        return '/dashboard';
    }
  };

  // Show loading only during initial load
  if (isLoading && !initialLoadComplete) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated && user ? (
              <Navigate to={getDashboardRoute(user.role as BusinessRole)} replace />
            ) : (
              <LoginForm />
            )
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard/super-admin"
          element={
            <ProtectedRoute requiredRoles={[BusinessRole.SUPER_ADMIN]}>
              <Layout>
                <SuperAdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Unauthorized Route */}
        <Route 
          path="/unauthorized" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Unauthorized</h1>
                <p className="text-gray-600 mt-2">You don't have permission to access this page.</p>
              </div>
            </div>
          } 
        />

        {/* Default Route - only redirect if initial load is complete */}
        <Route 
          path="/" 
          element={
            initialLoadComplete ? (
              isAuthenticated && user ? (
                <Navigate to={getDashboardRoute(user.role as BusinessRole)} replace />
              ) : (
                <Navigate to="/login" replace />
              )
            ) : (
              <LoadingSpinner />
            )
          } 
        />

        {/* Catch all route */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Page Not Found</h1>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          } 
        />
      </Routes>

      {/* Debug Panel - only shows in development */}
      {/* <DebugPanel /> */}
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ErrorBoundary>
        <div className="App">
          <AppContent />
        </div>
      </ErrorBoundary>
    </Provider>
  );
}

export default App;

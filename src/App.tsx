import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { useAuth } from './hooks/useAuth';

// Components

import Dashboard from './components/dashboard/Dashboard';
import Unauthorized from './components/common/Unauthorized';
import LoadingSpinner from './components/common/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';

// import React from 'react';
// import { Provider } from 'react-redux';
// import { store } from './store';
// import BusinessUserRegistrationForm from './components/business/forms/BusinessUserRegistrationForm';
import './App.css';
import LoginPage from './components/auth/LoginPage';

// Security: Add CSP meta tag
const addCSPMeta = () => {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: blob:;
    connect-src 'self' ${process.env.REACT_APP_API_URL || 'http://localhost:8080'};
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim();
  document.head.appendChild(meta);
};

// Security: Add CSRF meta tag
const addCSRFMeta = () => {
  if (!document.querySelector('meta[name="csrf-token"]')) {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    meta.content = generateCSRFToken();
    document.head.appendChild(meta);
  }
};

// Generate CSRF token
const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// App content component (inside Redux provider)
const AppContent: React.FC = () => {
  const { isInitialized, isAuthenticated } = useAuth();

  // Security setup
  useEffect(() => {
    // Add security headers
    addCSPMeta();
    addCSRFMeta();

    // Disable right-click context menu in production
    if (process.env.NODE_ENV === 'production') {
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      document.addEventListener('contextmenu', handleContextMenu);
      return () => document.removeEventListener('contextmenu', handleContextMenu);
    }
  }, []);

  // Show loading spinner while initializing
  if (!isInitialized) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginPage />
              )
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requiredRole="SUPER_ADMIN">
                <SuperAdminRoutes />
              </ProtectedRoute>
            }
          />

          {/* Hospital Management Routes */}
          <Route
            path="/hospitals/*"
            element={
              <ProtectedRoute requiredRole={['SUPER_ADMIN', 'TECH_ADVISOR']}>
                <HospitalRoutes />
              </ProtectedRoute>
            }
          />

          {/* Hospital Admin Routes */}
          <Route
            path="/hospital/*"
            element={
              <ProtectedRoute requiredRole="HOSPITAL_ADMIN">
                <HospitalAdminRoutes />
              </ProtectedRoute>
            }
          />

          {/* Patient Management Routes */}
          <Route
            path="/patients/*"
            element={
              <ProtectedRoute requiredRole={['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                <PatientRoutes />
              </ProtectedRoute>
            }
          />

          {/* Appointment Routes */}
          <Route
            path="/appointments/*"
            element={
              <ProtectedRoute requiredRole={['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
                <AppointmentRoutes />
              </ProtectedRoute>
            }
          />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Error Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/404" element={<NotFound />} />

          {/* Default Routes */}
          <Route
            path="/"
            element={
              <Navigate
                to={isAuthenticated ? "/dashboard" : "/login"}
                replace
              />
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
};

// Route Components (Placeholders - implement as needed)
const SuperAdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/users/create" element={<div>Create Business User Form</div>} />
      <Route path="/users" element={<div>Business Users List</div>} />
      <Route path="/analytics" element={<div>System Analytics</div>} />
    </Routes>
  );
};

const HospitalRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/create" element={<div>Hospital Registration Form</div>} />
      <Route path="/" element={<div>Hospitals List</div>} />
      <Route path="/:id" element={<div>Hospital Details</div>} />
    </Routes>
  );
};

const HospitalAdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/users/create" element={<div>Hospital User Registration Form</div>} />
      <Route path="/users" element={<div>Hospital Users List</div>} />
      <Route path="/settings" element={<div>Hospital Settings</div>} />
    </Routes>
  );
};

const PatientRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/create" element={<div>Patient Registration Form</div>} />
      <Route path="/" element={<div>Patients List</div>} />
      <Route path="/:id" element={<div>Patient Details</div>} />
      <Route path="/:id/medical-records" element={<div>Medical Records</div>} />
    </Routes>
  );
};

const AppointmentRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/create" element={<div>Create Appointment Form</div>} />
      <Route path="/" element={<div>Appointments List</div>} />
      <Route path="/:id" element={<div>Appointment Details</div>} />
    </Routes>
  );
};

const UserProfile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">User Profile</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1 text-sm text-gray-900">{user?.roleDisplayName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user?.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => window.history.back()}
          className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};

export default App;
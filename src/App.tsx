// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import LandingPage from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import Dashboard from './pages/Dashboard';
import { BusinessRole } from './types/auth.types';
import './App.css';
import LandingPage from './components/common/LandingPage';
import LoginPage from './components/auth/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Dashboard from './components/dashboard/Dashboard';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-4">
                We're sorry, but something unexpected happened. Please refresh the page or try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
  </div>
);

// Not Found Component
const NotFound: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">Page Not Found</h2>
      <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
      <a
        href="/"
        className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

// Main App Component
const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* Role-based Protected Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={[BusinessRole.SUPER_ADMIN]}>
                    <AdminRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/advisor/*"
                element={
                  <ProtectedRoute allowedRoles={[BusinessRole.TECH_ADVISOR]}>
                    <AdvisorRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/hospital/*"
                element={
                  <ProtectedRoute allowedRoles={[BusinessRole.HOSPITAL_ADMIN]}>
                    <HospitalRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/doctor/*"
                element={
                  <ProtectedRoute allowedRoles={[BusinessRole.DOCTOR]}>
                    <DoctorRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/nurse/*"
                element={
                  <ProtectedRoute allowedRoles={[BusinessRole.NURSE]}>
                    <NurseRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reception/*"
                element={
                  <ProtectedRoute allowedRoles={[BusinessRole.RECEPTIONIST]}>
                    <ReceptionRoutes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/patient/*"
                element={
                  <ProtectedRoute allowedRoles={[BusinessRole.PATIENT]}>
                    <PatientRoutes />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

// Role-specific route components (placeholders for now)
const AdminRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/*" element={<Navigate to="/admin/dashboard" replace />} />
  </Routes>
);

const AdvisorRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/*" element={<Navigate to="/advisor/dashboard" replace />} />
  </Routes>
);

const HospitalRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/*" element={<Navigate to="/hospital/dashboard" replace />} />
  </Routes>
);

const DoctorRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/*" element={<Navigate to="/doctor/dashboard" replace />} />
  </Routes>
);

const NurseRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/*" element={<Navigate to="/nurse/dashboard" replace />} />
  </Routes>
);

const ReceptionRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/*" element={<Navigate to="/reception/dashboard" replace />} />
  </Routes>
);

const PatientRoutes: React.FC = () => (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/*" element={<Navigate to="/patient/dashboard" replace />} />
  </Routes>
);

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './contexts/AuthContext';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SuperAdminDashboard from './components/dashboard/SuperAdminDashboard';
import DebugPanel from './components/debug/DebugPanel';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginForm />} />

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
                path="/admin"
                element={
                  <ProtectedRoute requiredRoles={['SUPER_ADMIN']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all - redirect to login */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

            {/* Debug Panel (only in development) */}
            <DebugPanel />
          </div>
        </Router>
      </AuthProvider>
    </Provider>
  );
}

// Dashboard component that routes based on user role
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Route to appropriate dashboard based on role
  switch (user.role) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'TECH_ADVISOR':
      return <TechAdvisorDashboard />;
    case 'HOSPITAL_ADMIN':
      return <HospitalAdminDashboard />;
    case 'DOCTOR':
      return <DoctorDashboard />;
    case 'NURSE':
      return <NurseDashboard />;
    case 'RECEPTIONIST':
      return <ReceptionistDashboard />;
    case 'PATIENT':
      return <PatientDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Unknown Role</h2>
            <p className="text-gray-600 mb-4">Your account role is not recognized.</p>
            <p className="text-sm text-gray-500">Role: {user.role}</p>
          </div>
        </div>
      );
  }
};

// Placeholder dashboard components (you can implement these later)
const TechAdvisorDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-2xl font-bold">Tech Advisor Dashboard</h1>
  </div>
);

const HospitalAdminDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-2xl font-bold">Hospital Admin Dashboard</h1>
  </div>
);

const DoctorDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
  </div>
);

const NurseDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-2xl font-bold">Nurse Dashboard</h1>
  </div>
);

const ReceptionistDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-2xl font-bold">Receptionist Dashboard</h1>
  </div>
);

const PatientDashboard: React.FC = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <h1 className="text-2xl font-bold">Patient Dashboard</h1>
  </div>
);

// Import useAuth hook
function useAuth() {
  return React.useContext(require('./contexts/AuthContext').AuthContext);
}

export default App;
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import LoadingSpinner from './components/common/LoadingSpinner';
import './App.css';

// Environment configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Dashboard component that routes based on user role
const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user.firstName}!</h1>
        <p>Role: {user.role}</p>
      </div>
      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>Dashboard</h2>
          <p>This is your {user.role.toLowerCase()} dashboard.</p>
          <div className="user-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User ID:</strong> {user.userId}</p>
            {user.territory && <p><strong>Territory:</strong> {user.territory}</p>}
            {user.username && <p><strong>Username:</strong> {user.username}</p>}
          </div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

// Logout Button Component
const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Sign Out
      <svg className="logout-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z" />
      </svg>
    </button>
  );
};

// Main App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
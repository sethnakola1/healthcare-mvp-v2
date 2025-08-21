// src/App.tsx
import React from 'react';
import './App.css';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { useAuth } from './contexts/AuthContext';
import { getRoleColor } from './config/constants';

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
);

// Error component
const ErrorDisplay: React.FC<{ error: string; onRetry?: () => void }> = ({ error, onRetry }) => (
  <div className="error-container">
    <div className="error-content">
      <h2>Something went wrong</h2>
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  </div>
);

// Main App Content Component
const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, logout, clearError } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show error if there's an authentication error
  if (error && !isAuthenticated) {
    return <ErrorDisplay error={error} onRetry={clearError} />;
  }

  // Show login page if not authenticated
  if (!isAuthenticated || !user) {
    return <LoginPage />;
  }

  // Show dashboard for authenticated users
  return (
    <div className="app-authenticated">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Healthcare MVP</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">{user.fullName || `${user.firstName} ${user.lastName}`}</span>
              <span
                className="user-role"
                style={{ color: getRoleColor(user.role) }}
              >
                {user.roleDisplayName || user.role}
              </span>
            </div>
            <button onClick={logout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Dashboard user={user} />
      </main>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;
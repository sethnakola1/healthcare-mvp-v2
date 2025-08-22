// src/App.tsx
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const AppContent: React.FC = () => {
  const { authState } = useAuth();

  // Show loading spinner while checking authentication
  if (authState.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-card">
          <div className="spinner" />
          <p className="loading-text">
            Loading HealthHorizon...
          </p>
        </div>
      </div>
    );
  }

  // Show Dashboard if authenticated, otherwise show Login
  return authState.isAuthenticated && authState.user ? (
    <Dashboard />
  ) : (
    <Login />
  );
};

const App: React.FC = () => {
  return (
    <div className="App">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </div>
  );
};

export default App;
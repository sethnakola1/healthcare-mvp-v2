// src/App.tsx

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getRoleColor } from './config/constants';
import './App.css';

// =========================== LOGIN COMPONENT ===========================

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    if (!email || !password) return;

    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>HealthHorizon</h1>
          <p>Healthcare Management System</p>
        </div>

        <div className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your email"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your password"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
            />
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading || !email || !password}
            className="login-button"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Super Admin:</strong></p>
          <p>Email: sethnakola@healthhorizon.com</p>
          <p>Password: SuperAdmin123!</p>
        </div>
      </div>
    </div>
  );
};

// =========================== DASHBOARD COMPONENT ===========================

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>HealthHorizon Dashboard</h1>
          <div className="user-info">
            <div className="user-details">
              <span className="user-name">{user.firstName} {user.lastName}</span>
              <span
                className="user-role"
                style={{ backgroundColor: getRoleColor(user.role) }}
              >
                {user.role.replace('_', ' ')}
              </span>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome back, {user.firstName}!</h2>
          <p>You are logged in as <strong>{user.role.replace('_', ' ')}</strong></p>
        </div>

        <div className="user-card">
          <h3>User Information</h3>
          <div className="user-details-grid">
            <div className="detail-item">
              <label>User ID:</label>
              <span>{user.userId}</span>
            </div>
            <div className="detail-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="detail-item">
              <label>Role:</label>
              <span>{user.role}</span>
            </div>
            <div className="detail-item">
              <label>Status:</label>
              <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="detail-item">
              <label>Email Verified:</label>
              <span className={user.emailVerified ? 'status-verified' : 'status-unverified'}>
                {user.emailVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-button">View Profile</button>
            <button className="action-button">Manage Users</button>
            <button className="action-button">View Reports</button>
            <button className="action-button">Settings</button>
          </div>
        </div>
      </main>
    </div>
  );
};

// =========================== MAIN APP COMPONENT ===========================

const AppContent: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

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

  return (
    <div className="app">
      {isAuthenticated ? <Dashboard /> : <LoginForm />}
    </div>
  );
};

// =========================== MAIN COMPONENT WITH PROVIDER ===========================

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
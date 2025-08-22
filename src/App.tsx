// src/App.tsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { getRoleColor } from './utils/auth.util';
import './App.css';

// Login Form Component
interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      await onLogin(email, password);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Healthcare MVP Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="login-button"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Super Admin:</strong> sethnakola@healthhorizon.com / SuperAdmin123!</p>
          <p><strong>Tech Advisor:</strong> advisor@healthhorizon.com / TechAdvisor123!</p>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Healthcare MVP Dashboard</h1>
        <div className="user-info">
          <span
            className="user-role-badge"
            style={{ backgroundColor: getRoleColor(user.role), color: 'white' }}
          >
            {user.roleDisplayName}
          </span>
          <span className="user-name">{user.fullName}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome, {user.firstName}!</h2>
          <p>You are logged in as: <strong>{user.roleDisplayName}</strong></p>
          <p>Email: {user.email}</p>
          {user.territory && <p>Territory: {user.territory}</p>}
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h3>Quick Stats</h3>
            <div className="stat-item">
              <span>User ID:</span>
              <span>{user.userId}</span>
            </div>
            <div className="stat-item">
              <span>Account Status:</span>
              <span className={user.isActive ? 'status-active' : 'status-inactive'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="stat-item">
              <span>Email Verified:</span>
              <span className={user.emailVerified ? 'status-verified' : 'status-unverified'}>
                {user.emailVerified ? 'Verified' : 'Not Verified'}
              </span>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Role Information</h3>
            <div className="role-info">
              <div className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                {user.roleDisplayName}
              </div>
              <div className="role-permissions">
                {user.role === 'SUPER_ADMIN' && (
                  <ul>
                    <li>Full system access</li>
                    <li>User management</li>
                    <li>System configuration</li>
                  </ul>
                )}
                {user.role === 'TECH_ADVISOR' && (
                  <ul>
                    <li>Hospital partnerships</li>
                    <li>Technical advisory</li>
                    <li>Commission tracking</li>
                  </ul>
                )}
                {user.role === 'HOSPITAL_ADMIN' && (
                  <ul>
                    <li>Hospital management</li>
                    <li>Staff oversight</li>
                    <li>Operational control</li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              {user.role === 'SUPER_ADMIN' && (
                <>
                  <button className="action-button">Manage Users</button>
                  <button className="action-button">System Settings</button>
                  <button className="action-button">View Analytics</button>
                </>
              )}
              {user.role === 'TECH_ADVISOR' && (
                <>
                  <button className="action-button">Manage Hospitals</button>
                  <button className="action-button">View Commission</button>
                  <button className="action-button">Partnership Reports</button>
                </>
              )}
              {user.role === 'HOSPITAL_ADMIN' && (
                <>
                  <button className="action-button">Patient Management</button>
                  <button className="action-button">Staff Management</button>
                  <button className="action-button">Appointments</button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Main App Component
const AppContent: React.FC = () => {
  const { authState, user, login } = useAuth();

  // Handle authentication
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by the auth context
    }
  };

  // Show loading state
  if (authState.isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!authState.isAuthenticated || !user) {
    return (
      <LoginForm
        onLogin={handleLogin}
        isLoading={authState.isLoading}
        error={authState.error}
      />
    );
  }

  // Show dashboard if authenticated
  return <Dashboard />;
};

// Root App Component with Provider
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
// src/components/Dashboard.tsx
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { getCurrentUserAsync, logoutAsync } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      dispatch(getCurrentUserAsync());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">
              <div className="logo-icon">🏥</div>
              <span className="brand-name">HealthHorizon</span>
            </div>
          </div>
          <div className="header-right">
            <div className="user-menu">
              <div className="user-info">
                <div className="user-avatar">
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </div>
                <div className="user-details">
                  <span className="user-name">{user?.fullName}</span>
                  <span className="user-role">{user?.role}</span>
                </div>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome back, {user?.firstName}! 👋</h1>
            <p>Here's what's happening with your healthcare system today.</p>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-icon">📅</div>
                <h3>Today's Appointments</h3>
              </div>
              <div className="card-content">
                <div className="stat-number">12</div>
                <div className="stat-label">Scheduled for today</div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-icon">👥</div>
                <h3>Total Patients</h3>
              </div>
              <div className="card-content">
                <div className="stat-number">1,234</div>
                <div className="stat-label">Active patients</div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-icon">🏥</div>
                <h3>Hospital Status</h3>
              </div>
              <div className="card-content">
                <div className="status-indicator active">Active</div>
                <div className="stat-label">All systems operational</div>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="card-header">
                <div className="card-icon">💊</div>
                <h3>Prescriptions</h3>
              </div>
              <div className="card-content">
                <div className="stat-number">45</div>
                <div className="stat-label">Issued this week</div>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            <div className="section">
              <h2>Recent Activity</h2>
              <div className="activity-list">
                <div className="activity-item">
                  <div className="activity-icon">👤</div>
                  <div className="activity-content">
                    <div className="activity-title">New patient registered</div>
                    <div className="activity-time">2 minutes ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">📅</div>
                  <div className="activity-content">
                    <div className="activity-title">Appointment scheduled</div>
                    <div className="activity-time">5 minutes ago</div>
                  </div>
                </div>
                <div className="activity-item">
                  <div className="activity-icon">💊</div>
                  <div className="activity-content">
                    <div className="activity-title">Prescription updated</div>
                    <div className="activity-time">10 minutes ago</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Quick Actions</h2>
              <div className="quick-actions">
                <button className="action-button">
                  <div className="action-icon">👤</div>
                  <span>Add Patient</span>
                </button>
                <button className="action-button">
                  <div className="action-icon">📅</div>
                  <span>Schedule Appointment</span>
                </button>
                <button className="action-button">
                  <div className="action-icon">💊</div>
                  <span>Create Prescription</span>
                </button>
                <button className="action-button">
                  <div className="action-icon">📊</div>
                  <span>View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
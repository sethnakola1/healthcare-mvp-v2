// src/components/Dashboard.tsx
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logoutUser } from '../../store/slices/authSlice';


const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7 7-7Z" fill="currentColor"/>
              </svg>
            </div>
            <h1>HealthHorizon</h1>
          </div>

          <div className="user-section">
            <div className="user-info">
              <span className="user-name">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="user-role">{user?.role}</span>
            </div>
            <button
              onClick={handleLogout}
              className="logout-button"
              aria-label="Logout"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16,17 21,12 16,7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="welcome-section">
          <h2>Welcome back, {user?.firstName}!</h2>
          <p>Here's what's happening in your healthcare dashboard today.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon patients">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>Patients</h3>
              <p className="card-number">1,234</p>
              <p className="card-description">Total registered patients</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon appointments">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>Today's Appointments</h3>
              <p className="card-number">24</p>
              <p className="card-description">Scheduled for today</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon doctors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>Active Doctors</h3>
              <p className="card-number">89</p>
              <p className="card-description">Currently available</p>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon revenue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div className="card-content">
              <h3>Monthly Revenue</h3>
              <p className="card-number">$125,430</p>
              <p className="card-description">This month's earnings</p>
            </div>
          </div>
        </div>

        <div className="recent-activities">
          <h3>Recent Activities</h3>
          <div className="activities-list">
            <div className="activity-item">
              <div className="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  </svg>
                </div>
              </div>
              <div className="activity-content">
                <p className="activity-title">New patient registration</p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div className="activity-content">
                <p className="activity-title">Appointment scheduled</p>
                <p className="activity-time">15 minutes ago</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div className="activity-content">
                <p className="activity-title">Medical report generated</p>
                <p className="activity-time">1 hour ago</p>
              </div>
            </div>
          </div>
      </main>
    </div>
  );
};

export default Dashboard;
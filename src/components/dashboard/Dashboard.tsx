// src/components/Dashboard.tsx
import React from 'react';
import { User } from '../contexts/AuthContext';
import { getRoleColor, getRoleDisplayName } from '../config/constants';
import './Dashboard.css';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const roleColor = getRoleColor(user.role);
  const roleDisplayName = getRoleDisplayName(user.role);

  // Get role-specific dashboard content
  const getDashboardContent = () => {
    switch (user.role) {
      case 'SUPER_ADMIN':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">156</p>
                <span className="stat-change positive">+12% from last month</span>
              </div>
              <div className="stat-card">
                <h3>Active Hospitals</h3>
                <p className="stat-number">24</p>
                <span className="stat-change positive">+8% from last month</span>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                <p className="stat-number">$125,650</p>
                <span className="stat-change positive">+15% from last month</span>
              </div>
              <div className="stat-card">
                <h3>System Health</h3>
                <p className="stat-number">99.9%</p>
                <span className="stat-change neutral">Uptime</span>
              </div>
            </div>
          </div>
        );

      case 'HOSPITAL_ADMIN':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">1,247</p>
                <span className="stat-change positive">+5% from last month</span>
              </div>
              <div className="stat-card">
                <h3>Today's Appointments</h3>
                <p className="stat-number">48</p>
                <span className="stat-change neutral">12 pending</span>
              </div>
              <div className="stat-card">
                <h3>Active Doctors</h3>
                <p className="stat-number">32</p>
                <span className="stat-change positive">+2 new this month</span>
              </div>
              <div className="stat-card">
                <h3>Revenue This Month</h3>
                <p className="stat-number">$89,450</p>
                <span className="stat-change positive">+12% from last month</span>
              </div>
            </div>
          </div>
        );

      case 'DOCTOR':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Today's Appointments</h3>
                <p className="stat-number">12</p>
                <span className="stat-change neutral">3 completed</span>
              </div>
              <div className="stat-card">
                <h3>Total Patients</h3>
                <p className="stat-number">358</p>
                <span className="stat-change positive">+8 new this month</span>
              </div>
              <div className="stat-card">
                <h3>Pending Reports</h3>
                <p className="stat-number">5</p>
                <span className="stat-change warning">Need attention</span>
              </div>
              <div className="stat-card">
                <h3>Next Appointment</h3>
                <p className="stat-number">2:30 PM</p>
                <span className="stat-change neutral">John Doe</span>
              </div>
            </div>
          </div>
        );

      case 'PATIENT':
        return (
          <div className="dashboard-content">
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Upcoming Appointments</h3>
                <p className="stat-number">2</p>
                <span className="stat-change neutral">Next: Tomorrow 10:00 AM</span>
              </div>
              <div className="stat-card">
                <h3>Medical Records</h3>
                <p className="stat-number">15</p>
                <span className="stat-change positive">Updated last week</span>
              </div>
              <div className="stat-card">
                <h3>Prescriptions</h3>
                <p className="stat-number">3</p>
                <span className="stat-change warning">1 expiring soon</span>
              </div>
              <div className="stat-card">
                <h3>Outstanding Bills</h3>
                <p className="stat-number">$245</p>
                <span className="stat-change warning">Due in 5 days</span>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="dashboard-content">
            <div className="welcome-card">
              <h3>Welcome to Healthcare MVP</h3>
              <p>Your role-specific dashboard is being prepared.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome back, {user.firstName}!</h1>
          <p className="user-details">
            <span className="role-badge" style={{ backgroundColor: roleColor }}>
              {roleDisplayName}
            </span>
            {user.territory && <span className="territory">Territory: {user.territory}</span>}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="quick-action-btn primary">
            {user.role === 'PATIENT' ? 'Book Appointment' : 'New Record'}
          </button>
          <button className="quick-action-btn secondary">
            {user.role === 'DOCTOR' ? 'View Schedule' : 'Reports'}
          </button>
        </div>
      </div>

      {getDashboardContent()}

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📋</div>
            <div className="activity-content">
              <p className="activity-title">New patient registered</p>
              <p className="activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">📅</div>
            <div className="activity-content">
              <p className="activity-title">Appointment scheduled</p>
              <p className="activity-time">4 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">💊</div>
            <div className="activity-content">
              <p className="activity-title">Prescription updated</p>
              <p className="activity-time">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
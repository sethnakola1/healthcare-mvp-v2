import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

interface DashboardStats {
  totalUsers?: number;
  totalHospitals?: number;
  totalAppointments?: number;
  totalPatients?: number;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalUsers: 150,
        totalHospitals: 25,
        totalAppointments: 450,
        totalPatients: 1200
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Healthcare MVP Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.firstName} {user?.lastName}</span>
            <span className="user-role">({user?.roleDisplayName})</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{stats.totalUsers}</p>
          </div>
          <div className="stat-card">
            <h3>Total Hospitals</h3>
            <p className="stat-number">{stats.totalHospitals}</p>
          </div>
          <div className="stat-card">
            <h3>Total Appointments</h3>
            <p className="stat-number">{stats.totalAppointments}</p>
          </div>
          <div className="stat-card">
            <h3>Total Patients</h3>
            <p className="stat-number">{stats.totalPatients}</p>
          </div>
        </div>

        <div className="dashboard-content">
          <section className="dashboard-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-time">2 hours ago</span>
                <span className="activity-text">New patient registered</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">4 hours ago</span>
                <span className="activity-text">Appointment scheduled</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">6 hours ago</span>
                <span className="activity-text">Medical record updated</span>
              </div>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              <button className="action-btn">Add Patient</button>
              <button className="action-btn">Schedule Appointment</button>
              <button className="action-btn">View Reports</button>
              <button className="action-btn">Manage Users</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
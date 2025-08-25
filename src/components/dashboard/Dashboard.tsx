import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, logoutUser } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store/store';
import './Dashboard.css';

interface DashboardStats {
  totalPatients?: number;
  todayAppointments?: number;
  pendingTasks?: number;
  revenue?: number;
}

const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(selectUser);
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const timer = setTimeout(() => {
      setStats({
        totalPatients: 1248,
        todayAppointments: 23,
        pendingTasks: 7,
        revenue: 45670
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logoutUser());
    }
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
          <div>
            <h1>Welcome back, {user?.firstName}!</h1>
            <p className="header-subtitle">
              Role: {user?.role} | Last login: {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="header-actions">
            <button className="profile-button">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Total Patients</h3>
              <p className="stat-number">{stats.totalPatients?.toLocaleString()}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Today's Appointments</h3>
              <p className="stat-number">{stats.todayAppointments}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>Pending Tasks</h3>
              <p className="stat-number">{stats.pendingTasks}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Monthly Revenue</h3>
              <p className="stat-number">${stats.revenue?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="section">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button className="action-button">
                <span>➕</span>
                Add Patient
              </button>
              <button className="action-button">
                <span>📅</span>
                Schedule Appointment
              </button>
              <button className="action-button">
                <span>📊</span>
                View Reports
              </button>
              <button className="action-button">
                <span>⚙️</span>
                Settings
              </button>
            </div>
          </section>

          <section className="section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon">👤</div>
                <div className="activity-content">
                  <p><strong>New patient registered:</strong> John Doe</p>
                  <small>2 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">📅</div>
                <div className="activity-content">
                  <p><strong>Appointment scheduled:</strong> Jane Smith - 2:00 PM</p>
                  <small>4 hours ago</small>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon">💊</div>
                <div className="activity-content">
                  <p><strong>Prescription issued:</strong> Patient ID #1234</p>
                  <small>6 hours ago</small>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="user-info">
          <h2>Your Profile</h2>
          <div className="user-details">
            <p><strong>User ID:</strong> {user?.userId}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Status:</strong> {user?.isActive ? 'Active' : 'Inactive'}</p>
            <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
            {user?.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
            {user?.territory && <p><strong>Territory:</strong> {user.territory}</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
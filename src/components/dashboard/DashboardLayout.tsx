// src/components/dashboard/DashboardLayout.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import { logoutUser } from '../../store/slices/authSlice';
import { UserProfile } from '../../types/auth.types';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  user: UserProfile;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Force navigation even if logout fails
      navigate('/login', { replace: true });
    }
  };

  const getNavigationItems = () => {
    const baseItems = [
      { label: 'Dashboard', path: '/dashboard', icon: '🏠' },
      { label: 'Profile', path: '/profile', icon: '👤' },
    ];

    switch (user.role) {
      case 'SUPER_ADMIN':
        return [
          ...baseItems,
          { label: 'Tech Advisors', path: '/tech-advisors', icon: '👥' },
          { label: 'Hospitals', path: '/hospitals', icon: '🏥' },
          { label: 'System Metrics', path: '/metrics', icon: '📊' },
        ];

      case 'TECH_ADVISOR':
        return [
          ...baseItems,
          { label: 'My Hospitals', path: '/my-hospitals', icon: '🏥' },
          { label: 'Performance', path: '/performance', icon: '📈' },
        ];

      case 'HOSPITAL_ADMIN':
        return [
          ...baseItems,
          { label: 'Doctors', path: '/doctors', icon: '👨‍⚕️' },
          { label: 'Patients', path: '/patients', icon: '🏥' },
          { label: 'Appointments', path: '/appointments', icon: '📅' },
          { label: 'Reports', path: '/reports', icon: '📋' },
        ];

      case 'DOCTOR':
        return [
          ...baseItems,
          { label: 'My Appointments', path: '/my-appointments', icon: '📅' },
          { label: 'Patients', path: '/my-patients', icon: '👥' },
          { label: 'Medical Records', path: '/medical-records', icon: '📝' },
          { label: 'Prescriptions', path: '/prescriptions', icon: '💊' },
        ];

      case 'NURSE':
        return [
          ...baseItems,
          { label: 'Patient Care', path: '/patient-care', icon: '❤️' },
          { label: 'Schedules', path: '/schedules', icon: '⏰' },
          { label: 'Medical Records', path: '/medical-records', icon: '📝' },
        ];

      case 'RECEPTIONIST':
        return [
          ...baseItems,
          { label: 'Appointments', path: '/appointments', icon: '📅' },
          { label: 'Patients', path: '/patients', icon: '👥' },
          { label: 'Check-in', path: '/check-in', icon: '✅' },
        ];

      case 'PATIENT':
        return [
          ...baseItems,
          { label: 'My Appointments', path: '/my-appointments', icon: '📅' },
          { label: 'Medical History', path: '/medical-history', icon: '📋' },
          { label: 'Prescriptions', path: '/my-prescriptions', icon: '💊' },
          { label: 'Bills', path: '/my-bills', icon: '💳' },
        ];

      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/logo.png" alt="Healthcare MVP" className="sidebar-logo" />
            <span className="brand-name">Healthcare MVP</span>
          </div>
          <button
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className="nav-item"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="user-details">
              <div className="user-name">
                {user.firstName} {user.lastName}
              </div>
              <div className="user-role">{user.role}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </button>
            <h1 className="page-title">Dashboard</h1>
          </div>

          <div className="header-right">
            <div className="notifications">
              <button className="notification-button">
                🔔
                <span className="notification-badge">3</span>
              </button>
            </div>

            <div className="profile-dropdown">
              <button
                className="profile-button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="profile-avatar">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span className="profile-name">
                  {user.firstName} {user.lastName}
                </span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {profileDropdownOpen && (
                <div className="profile-menu">
                  <div className="profile-menu-header">
                    <div className="profile-info">
                      <div className="profile-name">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="profile-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="profile-menu-items">
                    <button
                      className="profile-menu-item"
                      onClick={() => {
                        navigate('/profile');
                        setProfileDropdownOpen(false);
                      }}
                    >
                      👤 Profile Settings
                    </button>
                    <button
                      className="profile-menu-item"
                      onClick={() => {
                        navigate('/change-password');
                        setProfileDropdownOpen(false);
                      }}
                    >
                      🔒 Change Password
                    </button>
                    <hr className="menu-divider" />
                    <button
                      className="profile-menu-item logout"
                      onClick={handleLogout}
                    >
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
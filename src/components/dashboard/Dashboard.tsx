// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole, getRoleColor, getRoleDisplayName, formatUserName } from '../utils/auth.util';

interface DashboardStats {
  totalPatients?: number;
  totalAppointments?: number;
  totalHospitals?: number;
  todayAppointments?: number;
  revenue?: number;
}

const Dashboard: React.FC = () => {
  const { authState, logout } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate API call based on user role
        setTimeout(() => {
          const mockStats = generateMockStats(authState.user?.role);
          setStats(mockStats);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    if (authState.user) {
      fetchDashboardData();
    }
  }, [authState.user]);

  const generateMockStats = (role?: UserRole): DashboardStats => {
    switch (role) {
      case UserRole.SUPER_ADMIN:
        return {
          totalHospitals: 127,
          totalPatients: 15420,
          totalAppointments: 2340,
          revenue: 1250000
        };
      case UserRole.HOSPITAL_ADMIN:
        return {
          totalPatients: 1240,
          totalAppointments: 180,
          todayAppointments: 24,
          revenue: 89500
        };
      case UserRole.DOCTOR:
        return {
          totalPatients: 340,
          todayAppointments: 8,
          totalAppointments: 45
        };
      case UserRole.NURSE:
        return {
          totalPatients: 180,
          todayAppointments: 12
        };
      default:
        return {};
    }
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string) => (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E5E7EB',
      transition: 'transform 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: '14px', color: '#6B7280', fontWeight: '500' }}>
            {title}
          </p>
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#1F2937'
          }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {icon}
        </div>
      </div>
    </div>
  );

  const renderQuickActions = () => {
    const actions = getQuickActions(authState.user?.role);

    return (
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E5E7EB'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'transparent',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#374151',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#F9FAFB';
                e.currentTarget.style.borderColor = action.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              <span style={{ fontSize: '18px' }}>{action.icon}</span>
              <span style={{ fontWeight: '500' }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const getQuickActions = (role?: UserRole) => {
    const baseActions = [
      { icon: '👤', label: 'View Profile', color: '#6366F1', onClick: () => console.log('View Profile') },
      { icon: '🔧', label: 'Settings', color: '#8B5CF6', onClick: () => console.log('Settings') },
    ];

    switch (role) {
      case UserRole.SUPER_ADMIN:
        return [
          { icon: '🏥', label: 'Manage Hospitals', color: '#EF4444', onClick: () => console.log('Manage Hospitals') },
          { icon: '👥', label: 'Manage Users', color: '#10B981', onClick: () => console.log('Manage Users') },
          { icon: '📊', label: 'System Reports', color: '#F59E0B', onClick: () => console.log('System Reports') },
          ...baseActions
        ];
      case UserRole.HOSPITAL_ADMIN:
        return [
          { icon: '👨‍⚕️', label: 'Manage Doctors', color: '#10B981', onClick: () => console.log('Manage Doctors') },
          { icon: '📅', label: 'View Appointments', color: '#3B82F6', onClick: () => console.log('View Appointments') },
          { icon: '👥', label: 'Manage Staff', color: '#8B5CF6', onClick: () => console.log('Manage Staff') },
          ...baseActions
        ];
      case UserRole.DOCTOR:
        return [
          { icon: '📅', label: 'My Appointments', color: '#3B82F6', onClick: () => console.log('My Appointments') },
          { icon: '👤', label: 'Patient Records', color: '#10B981', onClick: () => console.log('Patient Records') },
          { icon: '💊', label: 'Prescriptions', color: '#F59E0B', onClick: () => console.log('Prescriptions') },
          ...baseActions
        ];
      case UserRole.NURSE:
        return [
          { icon: '📋', label: 'Patient Care', color: '#10B981', onClick: () => console.log('Patient Care') },
          { icon: '📅', label: 'Schedule', color: '#3B82F6', onClick: () => console.log('Schedule') },
          ...baseActions
        ];
      default:
        return baseActions;
    }
  };

  if (!authState.user) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F9FAFB' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }}>
              HealthHorizon
            </h1>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#6B7280' }}>
              Healthcare Management System
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#1F2937' }}>
                {formatUserName(authState.user.firstName, authState.user.lastName)}
              </p>
              <p style={{
                margin: '2px 0 0 0',
                fontSize: '12px',
                color: getRoleColor(authState.user.role),
                fontWeight: '500'
              }}>
                {getRoleDisplayName(authState.user.role)}
              </p>
            </div>

            <button
              onClick={logout}
              style={{
                background: '#DC2626',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#B91C1C'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#DC2626'}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Welcome Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            margin: '0 0 8px 0',
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1F2937'
          }}>
            Welcome back, {authState.user.firstName}! 👋
          </h2>
          <p style={{ margin: 0, fontSize: '16px', color: '#6B7280' }}>
            Here's what's happening in your {getRoleDisplayName(authState.user.role).toLowerCase()} dashboard today.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px',
            fontSize: '16px',
            color: '#6B7280'
          }}>
            Loading dashboard data...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px',
            marginBottom: '32px'
          }}>
            {stats.totalHospitals && renderStatCard('Total Hospitals', stats.totalHospitals, '🏥', '#EF4444')}
            {stats.totalPatients && renderStatCard('Total Patients', stats.totalPatients, '👥', '#10B981')}
            {stats.totalAppointments && renderStatCard('Total Appointments', stats.totalAppointments, '📅', '#3B82F6')}
            {stats.todayAppointments && renderStatCard("Today's Appointments", stats.todayAppointments, '📋', '#F59E0B')}
            {stats.revenue && renderStatCard('Revenue', `$${stats.revenue.toLocaleString()}`, '💰', '#8B5CF6')}
          </div>
        )}

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px'
        }}>
          {renderQuickActions()}

          {/* Recent Activity */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #E5E7EB'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', color: '#1F2937' }}>
              Recent Activity
            </h3>
            <div style={{ color: '#6B7280', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
              No recent activity to display.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
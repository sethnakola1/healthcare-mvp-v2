// src/components/dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { USER_ROLES } from '../../config/constants';

interface DashboardStats {
  totalAppointments?: number;
  todaysAppointments?: number;
  totalPatients?: number;
  totalDoctors?: number;
  totalHospitals?: number;
  pendingBills?: number;
}

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls based on user role
      // const response = await dashboardService.getDashboardStats(user.role);

      // Mock data for now
      const mockStats: DashboardStats = {
        totalAppointments: 150,
        todaysAppointments: 12,
        totalPatients: 450,
        totalDoctors: 25,
        totalHospitals: 1,
        pendingBills: 8,
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRoleSpecificContent = () => {
    if (!user) return null;

    switch (user.role) {
      case USER_ROLES.SUPER_ADMIN:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Hospitals"
              value={stats.totalHospitals || 0}
              icon="🏥"
              color="bg-blue-500"
            />
            <StatCard
              title="Total Doctors"
              value={stats.totalDoctors || 0}
              icon="👨‍⚕️"
              color="bg-green-500"
            />
            <StatCard
              title="Total Patients"
              value={stats.totalPatients || 0}
              icon="👥"
              color="bg-purple-500"
            />
            <StatCard
              title="Total Appointments"
              value={stats.totalAppointments || 0}
              icon="📅"
              color="bg-orange-500"
            />
          </div>
        );

      case USER_ROLES.HOSPITAL_ADMIN:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard
              title="Today's Appointments"
              value={stats.todaysAppointments || 0}
              icon="📅"
              color="bg-blue-500"
            />
            <StatCard
              title="Total Patients"
              value={stats.totalPatients || 0}
              icon="👥"
              color="bg-green-500"
            />
            <StatCard
              title="Pending Bills"
              value={stats.pendingBills || 0}
              icon="💰"
              color="bg-red-500"
            />
          </div>
        );

      case USER_ROLES.DOCTOR:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Today's Appointments"
              value={stats.todaysAppointments || 0}
              icon="📅"
              color="bg-blue-500"
            />
            <StatCard
              title="My Patients"
              value={stats.totalPatients || 0}
              icon="👥"
              color="bg-green-500"
            />
          </div>
        );

      case USER_ROLES.PATIENT:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Upcoming Appointments"
              value={stats.todaysAppointments || 0}
              icon="📅"
              color="bg-blue-500"
            />
            <StatCard
              title="Pending Bills"
              value={stats.pendingBills || 0}
              icon="💰"
              color="bg-red-500"
            />
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Dashboard content not available for this role.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName} {user?.lastName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your healthcare system today.
        </p>
      </div>

      {renderRoleSpecificContent()}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickActionCard
            title="Schedule Appointment"
            icon="📅"
            onClick={() => {/* TODO: Navigate to appointment scheduling */}}
          />
          <QuickActionCard
            title="Add Patient"
            icon="👤"
            onClick={() => {/* TODO: Navigate to patient registration */}}
          />
          <QuickActionCard
            title="View Reports"
            icon="📊"
            onClick={() => {/* TODO: Navigate to reports */}}
          />
          <QuickActionCard
            title="Settings"
            icon="⚙️"
            onClick={() => {/* TODO: Navigate to settings */}}
          />
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      </div>
      <div className={`${color} p-3 rounded-full text-white text-2xl`}>
        {icon}
      </div>
    </div>
  </div>
);

interface QuickActionCardProps {
  title: string;
  icon: string;
  onClick: () => void;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ title, icon, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 text-left"
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <span className="font-medium text-gray-900">{title}</span>
    </div>
  </button>
);

export default Dashboard;
// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BusinessRole } from '../../types/auth.types';

interface DashboardStats {
  totalUsers?: number;
  totalHospitals?: number;
  totalAppointments?: number;
  totalRevenue?: number;
}

const Dashboard: React.FC = () => {
  const { authState, logout, hasRole } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [isLoading, setIsLoading] = useState(true);

  const user = authState.user;

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Here you would make API calls to get dashboard data
        // For now, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        setStats({
          totalUsers: 150,
          totalHospitals: 25,
          totalAppointments: 1200,
          totalRevenue: 50000
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getRoleBasedContent = () => {
    if (hasRole(BusinessRole.SUPER_ADMIN)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Users" value={stats.totalUsers || 0} />
          <StatCard title="Total Hospitals" value={stats.totalHospitals || 0} />
          <StatCard title="Total Appointments" value={stats.totalAppointments || 0} />
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue || 0}`} />
        </div>
      );
    }

    if (hasRole(BusinessRole.TECH_ADVISOR)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="My Hospitals" value={user?.totalHospitalsBrought || 0} />
          <StatCard title="Commission Earned" value={`$${user?.totalCommissionEarned || 0}`} />
          <StatCard title="Monthly Target" value={user?.targetHospitalsMonthly || 0} />
        </div>
      );
    }

    if (hasRole(BusinessRole.HOSPITAL_ADMIN)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Today's Appointments" value={25} />
          <StatCard title="Total Doctors" value={12} />
          <StatCard title="Active Patients" value={450} />
        </div>
      );
    }

    if (hasRole(BusinessRole.DOCTOR)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard title="Today's Appointments" value={8} />
          <StatCard title="Patients Seen" value={156} />
          <StatCard title="Pending Reports" value={3} />
        </div>
      );
    }

    if (hasRole(BusinessRole.PATIENT)) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard title="Upcoming Appointments" value={2} />
          <StatCard title="Prescription Refills" value={1} />
        </div>
      );
    }

    return (
      <div className="text-center">
        <p className="text-gray-500">Welcome to your dashboard!</p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-sm text-gray-500">{user?.roleDisplayName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* User Info Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Account Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{user?.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Role</dt>
                  <dd className="text-sm text-gray-900">{user?.roleDisplayName}</dd>
                </div>
                {user?.phoneNumber && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{user.phoneNumber}</dd>
                  </div>
                )}
                {user?.territory && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Territory</dt>
                    <dd className="text-sm text-gray-900">{user.territory}</dd>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Role-based Content */}
          {getRoleBasedContent()}

          {/* Quick Actions */}
          <div className="mt-6">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {hasRole(BusinessRole.HOSPITAL_ADMIN) && (
                <>
                  <ActionButton title="Add Doctor" href="/doctors/new" />
                  <ActionButton title="Add Patient" href="/patients/new" />
                  <ActionButton title="View Appointments" href="/appointments" />
                  <ActionButton title="Generate Reports" href="/reports" />
                </>
              )}
              {hasRole(BusinessRole.DOCTOR) && (
                <>
                  <ActionButton title="View Appointments" href="/appointments" />
                  <ActionButton title="Medical Records" href="/medical-records" />
                  <ActionButton title="Prescriptions" href="/prescriptions" />
                  <ActionButton title="Patient List" href="/patients" />
                </>
              )}
              {hasRole(BusinessRole.PATIENT) && (
                <>
                  <ActionButton title="Book Appointment" href="/appointments/book" />
                  <ActionButton title="View Records" href="/medical-records" />
                  <ActionButton title="Prescriptions" href="/prescriptions" />
                  <ActionButton title="Bills" href="/bills" />
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Reusable StatCard component
const StatCard: React.FC<{ title: string; value: string | number }> = ({ title, value }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd className="text-lg font-medium text-gray-900">{value}</dd>
          </dl>
        </div>
      </div>
    </div>
  </div>
);

// Reusable ActionButton component
const ActionButton: React.FC<{ title: string; href: string }> = ({ title, href }) => (
  <a
    href={href}
    className="block p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <h3 className="text-sm font-medium text-gray-900">{title}</h3>
  </a>
);

export default Dashboard;
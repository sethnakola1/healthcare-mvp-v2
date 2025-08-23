// src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Corrected import path
import { UserRole, getRoleColor, getRoleDisplayName, formatUserName } from '../utils/auth.util'; // Assuming these utilities exist and paths are correct
import { useNavigate } from 'react-router-dom';

// Placeholder for dashboard statistics type
interface DashboardStats {
  totalPatients?: number;
  totalDoctors?: number;
    upcomingAppointments?: number;
  totalAppointments?: number;
  totalHospitals?: number;
  todayAppointments?: number;
  revenue?: number;
}

export const Dashboard: React.FC = () => {
  const { authState, logout, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to login page
    if (!authState.isAuthenticated) {
      navigate('/login');
    }
    // Fetch dashboard specific data based on user role
    if (authState.isAuthenticated && authState.user) {
      // Example: Fetch stats based on user role
      // This would typically involve another service call
      const fetchDashboardStats = async () => {
        // Mock data for now
        setStats({
          totalPatients: authState.user.role === UserRole.Admin ? 1500 : undefined,
          totalDoctors: authState.user.role === UserRole.Admin ? 50 : undefined,
          upcomingAppointments: authState.user.role === UserRole.Doctor ? 5 : undefined,
        });
      };
      fetchDashboardStats();
    }
  }, [authState.isAuthenticated, authState.user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect handled by useEffect after authState updates
    } catch (err) {
      console.error("Logout failed:", err);
      // Handle error, e.g., display a message
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium">Loading dashboard...</p>
      </div>
    );
  }

  if (!authState.isAuthenticated || !authState.user) {
    // This case should ideally be handled by the useEffect redirect
    return null;
  }

  const userRoleColor = getRoleColor(authState.user.role);
  const userDisplayName = formatUserName(authState.user);
  const roleDisplayName = getRoleDisplayName(authState.user.role);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center py-4 px-6 bg-white shadow-md rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome,{' '}
          <span className={`font-semibold ${userRoleColor}`}>
            {userDisplayName} ({roleDisplayName})
          </span>
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      </header>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
          <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={clearError}>
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org="
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </span>
        </div>
      )}

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.totalPatients !== undefined && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
              <p className="mt-2 text-3xl font-bold text-indigo-600">{stats.totalPatients}</p>
            </div>
          )}
          {stats.totalDoctors !== undefined && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Total Doctors</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats.totalDoctors}</p>
            </div>
          )}
          {stats.upcomingAppointments !== undefined && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-700">Upcoming Appointments</h3>
              <p className="mt-2 text-3xl font-bold text-yellow-600">{stats.upcomingAppointments}</p>
            </div>
          )}
          {/* Add more dashboard cards as needed */}
        </div>
      </main>
    </div>
  );
};
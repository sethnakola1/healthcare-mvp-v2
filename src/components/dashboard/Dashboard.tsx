// src/components/dashboard/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import {
  Users,
  Building2,
  UserPlus,
  Calendar,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Activity,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logoutAsync } from '../../store/slices/authSlice';
import { toast } from 'react-hot-toast';
import type { AppDispatch } from '../../store/store';

// Dashboard Card Component
interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon,
  trend,
  onClick
}) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 ${
      onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-sm ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${
              trend.isPositive ? '' : 'transform rotate-180'
            }`} />
            {trend.value}%
          </div>
        )}
      </div>
      <div className="bg-indigo-50 p-3 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

// Quick Action Button Component
interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  description,
  icon,
  onClick,
  variant = 'secondary'
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all ${
      variant === 'primary'
        ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
        : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${
        variant === 'primary' ? 'bg-indigo-100' : 'bg-gray-100'
      }`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </button>
);

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const { user, userRole } = useAuth();
  const permissions = usePermissions();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalHospitals: 0,
    totalPatients: 0,
    todayAppointments: 0,
    revenue: 0,
    loading: true
  });

  // Load dashboard data based on user role
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Mock data for now - replace with actual API calls
        setTimeout(() => {
          setDashboardData({
            totalUsers: userRole === 'SUPER_ADMIN' ? 1250 : 45,
            totalHospitals: userRole === 'SUPER_ADMIN' ? 85 : 1,
            totalPatients: userRole === 'HOSPITAL_ADMIN' ? 2340 : 150,
            todayAppointments: 23,
            revenue: 125000,
            loading: false
          });
        }, 1000);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    loadDashboardData();
  }, [userRole]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Role-specific quick actions
  const getQuickActions = () => {
    const actions: QuickActionProps[] = [];

    if (permissions.canCreateBusinessUser) {
      actions.push({
        title: 'Create Business User',
        description: 'Add new Super Admin or Tech Advisor',
        icon: <UserPlus className="h-5 w-5 text-indigo-600" />,
        onClick: () => navigate('/admin/users/create'),
        variant: 'primary'
      });
    }

    if (permissions.canCreateHospital) {
      actions.push({
        title: 'Register Hospital',
        description: 'Add new hospital to the system',
        icon: <Building2 className="h-5 w-5 text-green-600" />,
        onClick: () => navigate('/hospitals/create')
      });
    }

    if (permissions.canCreateHospitalUser) {
      actions.push({
        title: 'Add Hospital Staff',
        description: 'Register doctors, nurses, and staff',
        icon: <Users className="h-5 w-5 text-blue-600" />,
        onClick: () => navigate('/hospital/users/create')
      });
    }

    if (permissions.canManagePatients) {
      actions.push({
        title: 'Register Patient',
        description: 'Add new patient to the system',
        icon: <UserPlus className="h-5 w-5 text-purple-600" />,
        onClick: () => navigate('/patients/create')
      });
    }

    if (permissions.canManageAppointments()) {
      actions.push({
        title: 'Schedule Appointment',
        description: 'Book new patient appointment',
        icon: <Calendar className="h-5 w-5 text-orange-600" />,
        onClick: () => navigate('/appointments/create')
      });
    }

    return actions;
  };

  // Role-specific dashboard cards
  const getDashboardCards = () => {
    const cards: DashboardCardProps[] = [];

    if (userRole === 'SUPER_ADMIN') {
      cards.push(
        {
          title: 'Total Hospitals',
          value: dashboardData.totalHospitals,
          icon: <Building2 className="h-6 w-6 text-indigo-600" />,
          trend: { value: 12, isPositive: true },
          onClick: () => navigate('/hospitals')
        },
        {
          title: 'Business Users',
          value: dashboardData.totalUsers,
          icon: <Users className="h-6 w-6 text-green-600" />,
          trend: { value: 8, isPositive: true },
          onClick: () => navigate('/admin/users')
        },
        {
          title: 'Monthly Revenue',
          value: `$${dashboardData.revenue.toLocaleString()}`,
          icon: <DollarSign className="h-6 w-6 text-yellow-600" />,
          trend: { value: 23, isPositive: true }
        }
      );
    }

    if (['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'].includes(userRole || '')) {
      cards.push(
        {
          title: 'Total Patients',
          value: dashboardData.totalPatients,
          icon: <Users className="h-6 w-6 text-blue-600" />,
          trend: { value: 15, isPositive: true },
          onClick: () => navigate('/patients')
        },
        {
          title: "Today's Appointments",
          value: dashboardData.todayAppointments,
          icon: <Calendar className="h-6 w-6 text-purple-600" />,
          onClick: () => navigate('/appointments')
        },
        {
          title: 'Active Staff',
          value: dashboardData.totalUsers,
          icon: <Activity className="h-6 w-6 text-green-600" />,
          onClick: () => navigate('/staff')
        }
      );
    }

    return cards;
  };

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  HealthHorizon
                </h1>
                <p className="text-sm text-gray-600">{user?.roleDisplayName} Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <button
                className="p-2 text-gray-600 hover:text-gray-900 relative"
                aria-label="View notifications"
                title="View notifications"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" aria-hidden="true" />
              </button>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
                <button
                  onClick={() => navigate('/profile')}
                  className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 hover:bg-indigo-200"
                  aria-label="View user profile"
                  title="View user profile"
                >
                  {user?.firstName?.charAt(0)}
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your healthcare system today.
          </p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {getDashboardCards().map((card, index) => (
            <DashboardCard key={index} {...card} />
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {getQuickActions().map((action, index) => (
                <QuickAction key={index} {...action} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    New patient registered: John Doe
                  </p>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    Appointment scheduled for tomorrow
                  </p>
                  <span className="text-xs text-gray-400">15 min ago</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <p className="text-sm text-gray-600">
                    System backup completed
                  </p>
                  <span className="text-xs text-gray-400">1 hour ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
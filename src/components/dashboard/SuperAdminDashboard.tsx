import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { selectUser } from '../../store/slices/authSlice';

interface DashboardStats {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'increase' | 'decrease';
  icon: string;
}

export const SuperAdminDashboard: React.FC = () => {
  const user = useAppSelector(selectUser);
  const [stats, setStats] = useState<DashboardStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      try {
        // In a real app, you'd fetch this from your API
        const dashboardStats: DashboardStats[] = [
          {
            title: 'Total Hospitals',
            value: 24,
            change: '+12%',
            changeType: 'increase',
            icon: '🏥'
          },
          {
            title: 'Active Tech Advisors',
            value: 8,
            change: '+2',
            changeType: 'increase',
            icon: '👥'
          },
          {
            title: 'Monthly Revenue',
            value: '$45,230',
            change: '+18%',
            changeType: 'increase',
            icon: '💰'
          },
          {
            title: 'System Health',
            value: '99.9%',
            change: 'Stable',
            changeType: 'increase',
            icon: '⚡'
          }
        ];

        setStats(dashboardStats);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.firstName || 'Super Admin'}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Healthcare Platform Super Admin Dashboard
          </p>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </div>
                        {stat.change && (
                          <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {stat.changeType === 'increase' ? '↗' : '↘'} {stat.change}
                          </div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg font-medium text-gray-900">Manage Tech Advisors</div>
                <div className="text-sm text-gray-500">Add or manage tech advisor accounts</div>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg font-medium text-gray-900">View Hospitals</div>
                <div className="text-sm text-gray-500">Monitor hospital partnerships</div>
              </button>
              <button className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left">
                <div className="text-lg font-medium text-gray-900">System Reports</div>
                <div className="text-sm text-gray-500">Generate system analytics</div>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { action: 'New hospital registered', detail: 'City General Hospital', time: '2 hours ago' },
                { action: 'Tech Advisor created', detail: 'John Smith added to Mumbai territory', time: '4 hours ago' },
                { action: 'System backup completed', detail: 'Daily backup successful', time: '6 hours ago' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.detail}</div>
                  </div>
                  <div className="text-xs text-gray-400">{activity.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
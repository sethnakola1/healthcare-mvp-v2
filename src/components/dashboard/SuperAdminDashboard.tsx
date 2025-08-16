import React from 'react';
import { Users, Building2, Activity, TrendingUp } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux';

export const SuperAdminDashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Users',
      value: '1,247',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Hospitals',
      value: '89',
      change: '+5%',
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'System Activity',
      value: '98.5%',
      change: '+2%',
      icon: Activity,
      color: 'bg-yellow-500',
    },
    {
      title: 'Growth Rate',
      value: '24%',
      change: '+8%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your healthcare network today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-green-600">{stat.change} from last month</p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="font-medium text-blue-900">Create Tech Advisor</div>
              <div className="text-sm text-blue-600">Add new tech advisor to the system</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="font-medium text-green-900">View System Analytics</div>
              <div className="text-sm text-green-600">Monitor system performance and usage</div>
            </button>
            <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="font-medium text-purple-900">Manage Permissions</div>
              <div className="text-sm text-purple-600">Configure user roles and permissions</div>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">New hospital registered</p>
                <p className="text-xs text-gray-500">City General Hospital - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Tech advisor created</p>
                <p className="text-xs text-gray-500">John Smith - Mumbai Region - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">System maintenance completed</p>
                <p className="text-xs text-gray-500">All services running normally - 6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
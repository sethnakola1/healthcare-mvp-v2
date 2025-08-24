import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  TrendingUp,
  DollarSign,
  Plus,
  Settings,
  BarChart3,
  UserPlus,
  Shield,
  Bell,
  Search,
  Filter
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateAdvisor, setShowCreateAdvisor] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard/super-admin', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setDashboardData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'tech-advisors', label: 'Tech Advisors', icon: Users },
    { id: 'hospitals', label: 'Hospitals', icon: Building2 },
    { id: 'system-users', label: 'System Users', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Super Admin</h2>
          <p className="text-sm text-gray-600">Healthcare Platform</p>
        </div>

        <nav className="mt-6">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600'
                    : 'text-gray-700'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {activeTab === 'dashboard' && <DashboardOverview data={dashboardData} />}
          {activeTab === 'tech-advisors' && (
            <TechAdvisorsManagement
              showCreate={showCreateAdvisor}
              onShowCreate={setShowCreateAdvisor}
            />
          )}
          {activeTab === 'hospitals' && <HospitalsManagement />}
          {activeTab === 'system-users' && <SystemUsersManagement />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = ({ data }) => {
  const quickStats = data?.quickStats || {};
  const systemMetrics = data?.systemMetrics || {};

  const statCards = [
    {
      title: 'Total Users',
      value: systemMetrics.totalUsers || 0,
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Total Hospitals',
      value: systemMetrics.totalHospitals || 0,
      change: '+8%',
      icon: Building2,
      color: 'green'
    },
    {
      title: 'Monthly Revenue',
      value: `$${quickStats.monthlyRevenue || '0'}`,
      change: '+15%',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Total Patients',
      value: systemMetrics.totalPatients || 0,
      change: '+18%',
      icon: TrendingUp,
      color: 'orange'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 border">
              <div className="flex items-center">
                <div className={`p-2 rounded-lg bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    <span className="ml-2 text-sm text-green-600 font-medium">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivityCard />
        <SystemHealthCard />
      </div>
    </div>
  );
};

const TechAdvisorsManagement = ({ showCreate, onShowCreate }) => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTechAdvisors();
  }, []);

  const fetchTechAdvisors = async () => {
    try {
      const response = await fetch('/api/super-admin/tech-advisors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const result = await response.json();
      if (result.success) {
        setAdvisors(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch tech advisors:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showCreate) {
    return (
      <CreateTechAdvisorForm
        onCancel={() => onShowCreate(false)}
        onSuccess={() => {
          onShowCreate(false);
          fetchTechAdvisors();
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tech Advisors</h1>
          <p className="text-gray-600">Manage technical advisors and their performance</p>
        </div>
        <button
          onClick={() => onShowCreate(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tech Advisor
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tech advisors..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      {/* Tech Advisors Table */}
      <TechAdvisorsTable advisors={advisors} loading={loading} onRefresh={fetchTechAdvisors} />
    </div>
  );
};

const CreateTechAdvisorForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    territory: '',
    commissionPercentage: '20.00',
    targetHospitalsMonthly: '5'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/super-admin/tech-advisors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          commissionPercentage: parseFloat(formData.commissionPercentage),
          targetHospitalsMonthly: parseInt(formData.targetHospitalsMonthly)
        })
      });

      const result = await response.json();

      if (result.success) {
        onSuccess();
      } else {
        setErrors({ general: result.message || 'Failed to create tech advisor' });
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onCancel}
          className="text-gray-600 hover:text-gray-800 mr-4"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Tech Advisor</h1>
          <p className="text-gray-600">Add a new technical advisor to the platform</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength="8"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Territory *
              </label>
              <input
                type="text"
                name="territory"
                value={formData.territory}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., North America, Europe"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commission Percentage
              </label>
              <input
                type="number"
                name="commissionPercentage"
                value={formData.commissionPercentage}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="100"
                step="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Hospitals (Monthly)
              </label>
              <input
                type="number"
                name="targetHospitalsMonthly"
                value={formData.targetHospitalsMonthly}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Tech Advisor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TechAdvisorsTable = ({ advisors, loading, onRefresh }) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Territory
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Commission
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {advisors.map((advisor) => (
            <tr key={advisor.businessUserId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {advisor.firstName} {advisor.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{advisor.partnerCode}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {advisor.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {advisor.territory}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {advisor.commissionPercentage}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  advisor.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {advisor.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button className="text-blue-600 hover:text-blue-800 mr-3">
                  Edit
                </button>
                <button className="text-red-600 hover:text-red-800">
                  Deactivate
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const RecentActivityCard = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {[
        { action: 'New tech advisor registered', user: 'John Doe', time: '2 hours ago' },
        { action: 'Hospital onboarded', user: 'St. Mary Hospital', time: '4 hours ago' },
        { action: 'System maintenance completed', user: 'System', time: '1 day ago' }
      ].map((activity, index) => (
        <div key={index} className="flex items-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">{activity.action}</p>
            <p className="text-xs text-gray-500">{activity.user} • {activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SystemHealthCard = () => (
  <div className="bg-white rounded-lg shadow-sm p-6 border">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Database</span>
        <span className="text-sm text-green-600 font-medium">Healthy</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">API Services</span>
        <span className="text-sm text-green-600 font-medium">Operational</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Storage</span>
        <span className="text-sm text-yellow-600 font-medium">75% Used</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Uptime</span>
        <span className="text-sm text-green-600 font-medium">99.9%</span>
      </div>
    </div>
  </div>
);

// Placeholder components for other tabs
const HospitalsManagement = () => <div>Hospitals Management - Coming Soon</div>;
const SystemUsersManagement = () => <div>System Users Management - Coming Soon</div>;
const AnalyticsView = () => <div>Analytics View - Coming Soon</div>;
const SettingsView = () => <div>Settings View - Coming Soon</div>;

export default SuperAdminDashboard;
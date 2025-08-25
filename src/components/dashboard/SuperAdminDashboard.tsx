// src/components/dashboard/SuperAdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';
import { apiService } from '../../services/api.service';
import { BarChart3, Users, Building2, Shield, TrendingUp, Settings, DollarSign } from 'lucide-react';

interface TechAdvisor {
  businessUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  territory: string;
  commissionPercentage: number;
  targetHospitalsMonthly: number;
  totalHospitalsBrought: number;
  totalCommissionEarned: number;
  isActive: boolean;
  createdAt: string;
}

interface TechAdvisorsManagementProps {
  showCreate: boolean;
  onShowCreate: (show: boolean) => void;
}

interface CreateTechAdvisorFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface TechAdvisorsTableProps {
  advisors: TechAdvisor[];
  loading: boolean;
  onRefresh: () => void;
}

interface FormErrors {
  general?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  territory?: string;
}

const CreateTechAdvisorForm: React.FC<CreateTechAdvisorFormProps> = ({
  onCancel,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    phoneNumber: '',
    territory: '',
    commissionPercentage: 20,
    targetHospitalsMonthly: 5,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));

    // Clear specific field error when user starts typing
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [e.target.name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await apiService.apiCall('/admin/users/create', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (response.success) {
        onSuccess();
      } else {
        setErrors({ general: response.error || 'Failed to create tech advisor' });
      }
    } catch (error: any) {
      setErrors({ general: error.message || 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Create Tech Advisor
        </h3>

        <form onSubmit={handleSubmit}>
          {errors.general && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="territory" className="block text-sm font-medium text-gray-700">
                Territory
              </label>
              <input
                type="text"
                name="territory"
                id="territory"
                value={formData.territory}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Tech Advisor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const TechAdvisorsTable: React.FC<TechAdvisorsTableProps> = ({
  advisors,
  loading,
  onRefresh
}) => {
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (advisors.length === 0) {
    return <div className="text-center py-8">No tech advisors found.</div>;
  }

  return (
    <div className="mt-8 flex flex-col">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Territory
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commission
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hospitals
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
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
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{advisor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{advisor.territory}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{advisor.commissionPercentage}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{advisor.totalHospitalsBrought}</div>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechAdvisorsManagement: React.FC<TechAdvisorsManagementProps> = ({
  showCreate,
  onShowCreate
}) => {
  const [advisors, setAdvisors] = useState<TechAdvisor[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTechAdvisors = async () => {
    try {
      setLoading(true);
      const response = await apiService.apiCall<TechAdvisor[]>('/business/super-admin/tech-advisors');
      if (response.success && response.data) {
        setAdvisors(response.data);
      }
    } catch (error) {
      console.error('Failed to load tech advisors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTechAdvisors();
  }, []);

  const handleSuccess = () => {
    loadTechAdvisors();
    onShowCreate(false);
  };

  if (showCreate) {
    return (
      <CreateTechAdvisorForm
        onCancel={() => onShowCreate(false)}
        onSuccess={handleSuccess}
      />
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Tech Advisors</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage tech advisors who bring hospitals to the platform.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              type="button"
              onClick={() => onShowCreate(true)}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            >
              Add Tech Advisor
            </button>
          </div>
        </div>
        <TechAdvisorsTable
          advisors={advisors}
          loading={loading}
          onRefresh={loadTechAdvisors}
        />
      </div>
    </div>
  );
};

const SuperAdminDashboard: React.FC = () => {
  const user = useSelector(selectUser);
  const [showCreateTechAdvisor, setShowCreateTechAdvisor] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiService.apiCall('/business/super-admin/dashboard');
        if (response.success) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
              showCreate={showCreateTechAdvisor}
              onShowCreate={setShowCreateTechAdvisor}
            />
          )}
          {/* TODO: Implement these components */}
          {activeTab === 'hospitals' && <div>Hospitals Management</div>}
          {activeTab === 'system-users' && <div>System Users Management</div>}
          {activeTab === 'analytics' && <div>Analytics View</div>}
          {activeTab === 'settings' && <div>Settings View</div>}
        </div>
      </div>
    </div>
  );
};

interface DashboardOverviewProps {
  data: {
    quickStats?: {
      monthlyRevenue?: number;
    };
    systemMetrics?: {
      totalUsers?: number;
      totalHospitals?: number;
      totalPatients?: number;
    };
  } | null;
}
const DashboardOverview: React.FC<DashboardOverviewProps> = ({ data }) => {
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
        {/* TODO: Implement these components */}
        <div>Recent Activity</div>
        <div>System Health</div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
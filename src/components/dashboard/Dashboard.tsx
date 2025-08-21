import { Shield, User, Hospital, CheckCircle } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// Dashboard Component
const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <Shield className="w-6 h-6 text-purple-600" />;
      case 'TECH_ADVISOR':
        return <User className="w-6 h-6 text-blue-600" />;
      case 'HOSPITAL_ADMIN':
        return <Hospital className="w-6 h-6 text-green-600" />;
      default:
        return <User className="w-6 h-6 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'from-purple-500 to-purple-600';
      case 'TECH_ADVISOR':
        return 'from-blue-500 to-blue-600';
      case 'HOSPITAL_ADMIN':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Hospital className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">HealthHorizon</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500">{user?.roleDisplayName}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className={`bg-gradient-to-r ${getRoleColor(user?.role || '')} rounded-2xl p-8 text-white mb-8`}>
          <div className="flex items-center">
            {getRoleIcon(user?.role || '')}
            <div className="ml-4">
              <h2 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h2>
              <p className="text-white/90 mt-1">
                You're logged in as {user?.roleDisplayName}
              </p>
            </div>
          </div>
        </div>

        {/* User Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{user?.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <p className="mt-1 text-sm text-gray-900">{user?.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <div className="mt-1 flex items-center">
                {getRoleIcon(user?.role || '')}
                <span className="ml-2 text-sm text-gray-900">{user?.roleDisplayName}</span>
              </div>
            </div>
            {user?.phoneNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{user.phoneNumber}</p>
              </div>
            )}
            {user?.territory && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Territory</label>
                <p className="mt-1 text-sm text-gray-900">{user.territory}</p>
              </div>
            )}
          </div>
        </div>

        {/* Role-based Features */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {user?.roleDisplayName} Dashboard
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {user?.role === 'SUPER_ADMIN' && (
              <>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">System Management</h4>
                  <p className="text-sm text-purple-700 mt-1">Manage users and system settings</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">User Analytics</h4>
                  <p className="text-sm text-purple-700 mt-1">View system-wide analytics</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Tech Advisors</h4>
                  <p className="text-sm text-purple-700 mt-1">Manage tech advisor accounts</p>
                </div>
              </>
            )}
            {user?.role === 'TECH_ADVISOR' && (
              <>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Hospital Management</h4>
                  <p className="text-sm text-blue-700 mt-1">Manage assigned hospitals</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Commission Tracking</h4>
                  <p className="text-sm text-blue-700 mt-1">Track your commissions</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">Performance</h4>
                  <p className="text-sm text-blue-700 mt-1">View performance metrics</p>
                </div>
              </>
            )}
            {user?.role === 'HOSPITAL_ADMIN' && (
              <>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Patient Management</h4>
                  <p className="text-sm text-green-700 mt-1">Manage hospital patients</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Staff Management</h4>
                  <p className="text-sm text-green-700 mt-1">Manage hospital staff</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Appointments</h4>
                  <p className="text-sm text-green-700 mt-1">Manage appointments</p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
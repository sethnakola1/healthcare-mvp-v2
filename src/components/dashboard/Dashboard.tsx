import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient } from '../../services/auth.service';
import './Dashboard.css';

interface DashboardData {
  appointments?: any[];
  bills?: any[];
  prescriptions?: any[];
  users?: any[];
  systemMetrics?: Record<string, any>;
  feedback?: any[];
  notifications?: any[];
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.get('/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load dashboard');
      }
    } catch (err: any) {
      console.error('Dashboard fetch error:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-container">
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button onClick={fetchDashboardData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderRoleSpecificContent = () => {
    if (!user) return null;

    switch (user.role) {
      case 'SUPER_ADMIN':
        return renderSuperAdminDashboard();
      case 'TECH_ADVISOR':
        return renderTechAdvisorDashboard();
      case 'HOSPITAL_ADMIN':
        return renderHospitalAdminDashboard();
      case 'DOCTOR':
        return renderDoctorDashboard();
      case 'NURSE':
        return renderNurseDashboard();
      case 'RECEPTIONIST':
        return renderReceptionistDashboard();
      case 'PATIENT':
        return renderPatientDashboard();
      default:
        return <div>Unknown role: {user.role}</div>;
    }
  };

  const renderSuperAdminDashboard = () => (
    <div className="dashboard-content">
      <h2>System Overview</h2>
      <div className="metrics-grid">
        {dashboardData.systemMetrics && Object.entries(dashboardData.systemMetrics).map(([key, value]) => (
          <div key={key} className="metric-card">
            <h3>{formatMetricName(key)}</h3>
            <p className="metric-value">{String(value)}</p>
          </div>
        ))}
      </div>

      {dashboardData.users && (
        <div className="users-section">
          <h3>Recent Users</h3>
          <div className="users-list">
            {dashboardData.users.slice(0, 5).map((user: any) => (
              <div key={user.businessUserId} className="user-item">
                <span className="user-name">{user.fullName}</span>
                <span className="user-role">{user.roleDisplayName}</span>
                <span className="user-status">{user.isActive ? 'Active' : 'Inactive'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTechAdvisorDashboard = () => (
    <div className="dashboard-content">
      <h2>Tech Advisor Dashboard</h2>
      <div className="advisor-metrics">
        <div className="metric-card">
          <h3>Territory</h3>
          <p>{user?.territory || 'Not assigned'}</p>
        </div>
        <div className="metric-card">
          <h3>Partner Code</h3>
          <p>{user?.partnerCode || 'Not generated'}</p>
        </div>
      </div>
      <p>Manage hospital partnerships and technical support.</p>
    </div>
  );

  const renderHospitalAdminDashboard = () => (
    <div className="dashboard-content">
      <h2>Hospital Administration</h2>

      {dashboardData.appointments && (
        <div className="appointments-section">
          <h3>Today's Appointments ({dashboardData.appointments.length})</h3>
          <div className="appointments-list">
            {dashboardData.appointments.slice(0, 5).map((appointment: any) => (
              <div key={appointment.appointmentId} className="appointment-item">
                <div className="appointment-time">
                  {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                </div>
                <div className="appointment-details">
                  <p><strong>{appointment.patientName}</strong></p>
                  <p>Dr. {appointment.doctorName}</p>
                  <span className={`status ${appointment.status.toLowerCase()}`}>
                    {appointment.statusDisplay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dashboardData.bills && (
        <div className="bills-section">
          <h3>Recent Bills</h3>
          <div className="bills-list">
            {dashboardData.bills.slice(0, 3).map((bill: any) => (
              <div key={bill.billingId} className="bill-item">
                <span className="bill-number">{bill.billNumber}</span>
                <span className="bill-amount">₹{bill.totalAmount}</span>
                <span className={`payment-status ${bill.paymentStatus.toLowerCase()}`}>
                  {bill.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDoctorDashboard = () => (
    <div className="dashboard-content">
      <h2>Doctor Dashboard</h2>

      {dashboardData.appointments && (
        <div className="appointments-section">
          <h3>Today's Appointments ({dashboardData.appointments.length})</h3>
          <div className="appointments-list">
            {dashboardData.appointments.map((appointment: any) => (
              <div key={appointment.appointmentId} className="appointment-item">
                <div className="appointment-time">
                  {new Date(appointment.appointmentDateTime).toLocaleTimeString()}
                </div>
                <div className="appointment-details">
                  <p><strong>{appointment.patientName}</strong></p>
                  <p>MRN: {appointment.patientMrn}</p>
                  <p>{appointment.chiefComplaint}</p>
                  <span className={`status ${appointment.status.toLowerCase()}`}>
                    {appointment.statusDisplay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dashboardData.prescriptions && (
        <div className="prescriptions-section">
          <h3>Recent Prescriptions</h3>
          <div className="prescriptions-list">
            {dashboardData.prescriptions.slice(0, 3).map((prescription: any) => (
              <div key={prescription.prescriptionId} className="prescription-item">
                <span className="prescription-number">{prescription.prescriptionNumber}</span>
                <span className="prescription-date">
                  {new Date(prescription.prescriptionDate).toLocaleDateString()}
                </span>
                <span className={`prescription-status ${prescription.status.toLowerCase()}`}>
                  {prescription.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderNurseDashboard = () => (
    <div className="dashboard-content">
      <h2>Nurse Dashboard</h2>
      <p>Manage patient care and assist with medical procedures.</p>
    </div>
  );

  const renderReceptionistDashboard = () => (
    <div className="dashboard-content">
      <h2>Reception Dashboard</h2>
      <p>Manage appointments and patient registration.</p>
    </div>
  );

  const renderPatientDashboard = () => (
    <div className="dashboard-content">
      <h2>Patient Portal</h2>

      {dashboardData.appointments && (
        <div className="appointments-section">
          <h3>My Appointments</h3>
          <div className="appointments-list">
            {dashboardData.appointments.map((appointment: any) => (
              <div key={appointment.appointmentId} className="appointment-item">
                <div className="appointment-date">
                  {new Date(appointment.appointmentDateTime).toLocaleDateString()}
                </div>
                <div className="appointment-details">
                  <p><strong>Dr. {appointment.doctorName}</strong></p>
                  <p>{appointment.doctorSpecialization}</p>
                  <p>{appointment.hospitalName}</p>
                  <span className={`status ${appointment.status.toLowerCase()}`}>
                    {appointment.statusDisplay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {dashboardData.bills && (
        <div className="bills-section">
          <h3>My Bills</h3>
          <div className="bills-list">
            {dashboardData.bills.map((bill: any) => (
              <div key={bill.billingId} className="bill-item">
                <span className="bill-number">{bill.billNumber}</span>
                <span className="bill-amount">₹{bill.totalAmount}</span>
                <span className={`payment-status ${bill.paymentStatus.toLowerCase()}`}>
                  {bill.paymentStatus}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const formatMetricName = (key: string): string => {
    return key.replace(/([A-Z])/g, ' $1')
              .replace(/^./, str => str.toUpperCase())
              .replace(/([a-z])([A-Z])/g, '$1 $2');
  };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h1>HealthHorizon</h1>
        </div>

        <div className="nav-user">
          <div className="user-info">
            <span className="user-name">{user?.fullName}</span>
            <span className="user-role">{user?.roleDisplayName}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Welcome, {user?.firstName}!</h1>
          <p>Role: {user?.roleDisplayName}</p>
        </div>

        {renderRoleSpecificContent()}
      </main>
    </div>
  );
};

export default Dashboard;
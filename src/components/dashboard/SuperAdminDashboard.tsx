// src/components/dashboard/SuperAdminDashboard.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/slices/authSlice';

const SuperAdminDashboard: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.firstName}!</h2>
        <p>System Administrator Dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Tech Advisors</h3>
          <div className="metric">12</div>
          <p>Active advisors</p>
        </div>

        <div className="dashboard-card">
          <h3>Hospitals</h3>
          <div className="metric">45</div>
          <p>Partner hospitals</p>
        </div>

        <div className="dashboard-card">
          <h3>System Health</h3>
          <div className="metric status-good">Healthy</div>
          <p>All systems operational</p>
        </div>

        <div className="dashboard-card">
          <h3>Revenue</h3>
          <div className="metric">$125K</div>
          <p>This month</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/TechAdvisorDashboard.tsx
const TechAdvisorDashboard: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.firstName}!</h2>
        <p>Tech Advisor Dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>My Hospitals</h3>
          <div className="metric">8</div>
          <p>Partner hospitals</p>
        </div>

        <div className="dashboard-card">
          <h3>This Month</h3>
          <div className="metric">2</div>
          <p>New partnerships</p>
        </div>

        <div className="dashboard-card">
          <h3>Commission</h3>
          <div className="metric">$8,500</div>
          <p>This month</p>
        </div>

        <div className="dashboard-card">
          <h3>Target</h3>
          <div className="metric">80%</div>
          <p>Monthly goal progress</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/HospitalAdminDashboard.tsx
const HospitalAdminDashboard: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.firstName}!</h2>
        <p>Hospital Administrator Dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Today's Appointments</h3>
          <div className="metric">23</div>
          <p>Scheduled appointments</p>
        </div>

        <div className="dashboard-card">
          <h3>Active Doctors</h3>
          <div className="metric">12</div>
          <p>On duty today</p>
        </div>

        <div className="dashboard-card">
          <h3>Patient Check-ins</h3>
          <div className="metric">18</div>
          <p>Completed today</p>
        </div>

        <div className="dashboard-card">
          <h3>Revenue</h3>
          <div className="metric">$12,500</div>
          <p>Today's earnings</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/DoctorDashboard.tsx
const DoctorDashboard: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, Dr. {user?.lastName}!</h2>
        <p>Doctor Dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Today's Appointments</h3>
          <div className="metric">8</div>
          <p>Scheduled patients</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Consultations</h3>
          <div className="metric">3</div>
          <p>Waiting for review</p>
        </div>

        <div className="dashboard-card">
          <h3>Prescriptions</h3>
          <div className="metric">15</div>
          <p>Issued this week</p>
        </div>

        <div className="dashboard-card">
          <h3>Next Appointment</h3>
          <div className="metric">2:30 PM</div>
          <p>Patient consultation</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/NurseDashboard.tsx
const NurseDashboard: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.firstName}!</h2>
        <p>Nurse Dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Assigned Patients</h3>
          <div className="metric">12</div>
          <p>Under your care</p>
        </div>

        <div className="dashboard-card">
          <h3>Vitals Pending</h3>
          <div className="metric">5</div>
          <p>Measurements due</p>
        </div>

        <div className="dashboard-card">
          <h3>Medications</h3>
          <div className="metric">8</div>
          <p>To be administered</p>
        </div>

        <div className="dashboard-card">
          <h3>Shift End</h3>
          <div className="metric">6:00 PM</div>
          <p>Time remaining</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/ReceptionistDashboard.tsx
const ReceptionistDashboard: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.firstName}!</h2>
        <p>Receptionist Dashboard</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Check-ins Today</h3>
          <div className="metric">34</div>
          <p>Patients processed</p>
        </div>

        <div className="dashboard-card">
          <h3>Waiting Queue</h3>
          <div className="metric">7</div>
          <p>Patients waiting</p>
        </div>

        <div className="dashboard-card">
          <h3>Appointments</h3>
          <div className="metric">45</div>
          <p>Scheduled today</p>
        </div>

        <div className="dashboard-card">
          <h3>New Registrations</h3>
          <div className="metric">3</div>
          <p>Today's new patients</p>
        </div>
      </div>
    </div>
  );
};

// src/components/dashboard/PatientDashboard.tsx
const PatientDashboard: React.FC = () => {
  const user = useSelector(selectUser);

  return (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h2>Welcome back, {user?.firstName}!</h2>
        <p>Patient Portal</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Next Appointment</h3>
          <div className="metric">Dec 15</div>
          <p>Dr. Smith - 10:00 AM</p>
        </div>

        <div className="dashboard-card">
          <h3>Prescriptions</h3>
          <div className="metric">2</div>
          <p>Active medications</p>
        </div>

        <div className="dashboard-card">
          <h3>Test Results</h3>
          <div className="metric">1</div>
          <p>Pending review</p>
        </div>

        <div className="dashboard-card">
          <h3>Outstanding Bill</h3>
          <div className="metric">$250</div>
          <p>Payment due</p>
        </div>
      </div>
    </div>
  );
};

export {
  SuperAdminDashboard,
  TechAdvisorDashboard,
  HospitalAdminDashboard,
  DoctorDashboard,
  NurseDashboard,
  ReceptionistDashboard,
  PatientDashboard
};
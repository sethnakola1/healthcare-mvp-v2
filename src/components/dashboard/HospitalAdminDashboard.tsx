// src/components/dashboard/HospitalAdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { hospitalService, doctorService, appointmentService, patientService } from '../../services';
import { HospitalStats } from '../../types/hospital.types';

interface HospitalDashboardData {
  hospitalInfo: {
    id: string;
    name: string;
    totalBeds: number;
    availableBeds: number;
    occupancyRate: number;
    rating: number;
  };
  stats: HospitalStats;
  todaysAppointments: number;
  departmentStats: {
    name: string;
    doctorCount: number;
    appointmentsToday: number;
  }[];
  recentPatients: {
    id: string;
    firstName: string;
    lastName: string;
    registeredAt: string;
  }[];
}

const HospitalAdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<HospitalDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd get the hospital ID from user context/auth
      const hospitalId = localStorage.getItem('hospitalId') || 'hospital-1';
      
      const response = await hospitalService.getHospitalStats(hospitalId);
      
      if (response.success && response.data) {
        // Mock additional data structure since we don't have the full API
        const mockDashboardData: HospitalDashboardData = {
          hospitalInfo: {
            id: hospitalId,
            name: 'City General Hospital',
            totalBeds: 200,
            availableBeds: 45,
            occupancyRate: 0.775,
            rating: 4.2
          },
          stats: response.data,
          todaysAppointments: 45,
          departmentStats: [
            { name: 'Cardiology', doctorCount: 8, appointmentsToday: 12 },
            { name: 'Neurology', doctorCount: 6, appointmentsToday: 8 },
            { name: 'Orthopedics', doctorCount: 10, appointmentsToday: 15 },
            { name: 'Pediatrics', doctorCount: 7, appointmentsToday: 10 }
          ],
          recentPatients: [
            { id: '1', firstName: 'John', lastName: 'Doe', registeredAt: '2025-08-25T10:30:00Z' },
            { id: '2', firstName: 'Jane', lastName: 'Smith', registeredAt: '2025-08-25T09:15:00Z' },
            { id: '3', firstName: 'Mike', lastName: 'Johnson', registeredAt: '2025-08-24T16:45:00Z' }
          ]
        };
        
        setDashboardData(mockDashboardData);
      } else {
        setError(response.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{ title: string; value: string | number; subtitle?: string; color?: string }> = ({ 
    title, 
    value, 
    subtitle, 
    color = 'blue' 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="flex items-center">
        <span className={`text-3xl font-bold text-${color}-600`}>{value}</span>
      </div>
      {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No dashboard data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{dashboardData.hospitalInfo.name}</h1>
          <p className="text-gray-600">Hospital Administration Dashboard</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Patients"
            value={dashboardData.stats.totalPatients}
            subtitle="Registered patients"
            color="blue"
          />
          <StatCard
            title="Total Doctors"
            value={dashboardData.stats.totalDoctors}
            subtitle="Active doctors"
            color="green"
          />
          <StatCard
            title="Today's Appointments"
            value={dashboardData.todaysAppointments}
            subtitle="Scheduled for today"
            color="yellow"
          />
          <StatCard
            title="Bed Occupancy"
            value={`${(dashboardData.hospitalInfo.occupancyRate * 100).toFixed(1)}%`}
            subtitle={`${dashboardData.hospitalInfo.availableBeds} available`}
            color="purple"
          />
        </div>

        {/* Department Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Department Overview</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Today's Appointments
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.departmentStats.map((dept) => (
                  <tr key={dept.name}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {dept.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.doctorCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dept.appointmentsToday}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Patient Registrations</h2>
          <div className="space-y-3">
            {dashboardData.recentPatients.map((patient) => (
              <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</p>
                  <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date(patient.registeredAt).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(patient.registeredAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalAdminDashboard;
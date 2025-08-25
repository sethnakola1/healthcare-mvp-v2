// src/components/dashboard/DoctorDashboard.tsx

import React, { useState, useEffect } from 'react';
import { doctorService, appointmentService } from '../../services';
import { Appointment } from '../../types/appointment.types';

interface DoctorDashboardData {
  doctorInfo: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    department: string;
    rating: number;
    reviewCount: number;
  };
  todaysAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  stats: {
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    averageRating: number;
    totalRevenue: number;
    patientsServed: number;
  };
  schedule: {
    date: string;
    appointments: {
      time: string;
      patientName: string;
      status: string;
      type: string;
    }[];
  }[];
}

const DoctorDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DoctorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, you'd get the doctor ID from user context/auth
      const doctorId = localStorage.getItem('doctorId') || 'doctor-1';
      
      // Fetch doctor stats
      const statsResponse = await doctorService.getDoctorStats(doctorId);
      
      if (statsResponse.success && statsResponse.data) {
        // Mock the complete dashboard data structure
        const mockDashboardData: DoctorDashboardData = {
          doctorInfo: {
            id: doctorId,
            firstName: 'Dr. Sarah',
            lastName: 'Wilson',
            specialization: 'Cardiology',
            department: 'Cardiology',
            rating: 4.8,
            reviewCount: 124
          },
          todaysAppointments: [
            {
              id: '1',
              patientId: 'p1',
              doctorId: doctorId,
              hospitalId: 'h1',
              appointmentDate: new Date().toISOString(),
              startTime: '09:00',
              endTime: '09:30',
              status: 'scheduled',
              type: 'consultation',
              reason: 'Chest pain',
              consultationFee: 500,
              paymentStatus: 'paid',
              followUpRequired: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              patient: {
                id: 'p1',
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@email.com',
                phone: '+91 9876543210'
              }
            }
          ],
          upcomingAppointments: [
            {
              id: '2',
              patientId: 'p2',
              doctorId: doctorId,
              hospitalId: 'h1',
              appointmentDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              startTime: '10:00',
              endTime: '10:30',
              status: 'scheduled',
              type: 'follow-up',
              reason: 'Follow-up consultation',
              consultationFee: 500,
              paymentStatus: 'pending',
              followUpRequired: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              patient: {
                id: 'p2',
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@email.com',
                phone: '+91 9876543211'
              }
            }
          ],
          stats: statsResponse.data,
          schedule: [
            {
              date: new Date().toISOString().split('T')[0],
              appointments: [
                { time: '09:00', patientName: 'John Doe', status: 'scheduled', type: 'consultation' },
                { time: '10:00', patientName: 'Jane Smith', status: 'confirmed', type: 'follow-up' },
                { time: '11:30', patientName: 'Mike Johnson', status: 'scheduled', type: 'consultation' }
              ]
            }
          ]
        };
        
        setDashboardData(mockDashboardData);
      } else {
        setError(statsResponse.error || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, {dashboardData.doctorInfo.firstName} {dashboardData.doctorInfo.lastName}
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{dashboardData.doctorInfo.specialization}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">{dashboardData.doctorInfo.department} Department</span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-gray-600 ml-1">
                {dashboardData.doctorInfo.rating} ({dashboardData.doctorInfo.reviewCount} reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Appointments</h3>
            <span className="text-3xl font-bold text-blue-600">{dashboardData.stats.totalAppointments}</span>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completed</h3>
            <span className="text-3xl font-bold text-green-600">{dashboardData.stats.completedAppointments}</span>
            <p className="text-sm text-gray-500 mt-1">
              {((dashboardData.stats.completedAppointments / dashboardData.stats.totalAppointments) * 100).toFixed(1)}% completion rate
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Patients Served</h3>
            <span className="text-3xl font-bold text-purple-600">{dashboardData.stats.patientsServed}</span>
            <p className="text-sm text-gray-500 mt-1">Unique patients</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <span className="text-3xl font-bold text-indigo-600">₹{dashboardData.stats.totalRevenue.toLocaleString()}</span>
            <p className="text-sm text-gray-500 mt-1">This month</p>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Schedule</h2>
            <div className="space-y-3">
              {dashboardData.schedule[0]?.appointments.map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="text-lg font-medium text-gray-900">{appointment.time}</div>
                    <div>
                      <p className="font-medium text-gray-800">{appointment.patientName}</p>
                      <p className="text-sm text-gray-600 capitalize">{appointment.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Upcoming Appointments</h2>
            <div className="space-y-3">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">
                      {appointment.patient?.firstName} {appointment.patient?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 capitalize">{appointment.type}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.appointmentDate).toLocaleDateString()} at {appointment.startTime}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
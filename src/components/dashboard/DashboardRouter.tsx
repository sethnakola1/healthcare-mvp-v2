// src/components/dashboard/DashboardRouter.tsx

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../../store/store';
import {
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  getCurrentUser,
  restoreAuthFromStorage
} from '../../store/slices/authSlice';
import { BusinessRole } from '../../types/auth.types';
import SuperAdminDashboard from './SuperAdminDashboard';
import TechAdvisorDashboard from './TechAdvisorDashboard';
import HospitalAdminDashboard from './HospitalAdminDashboard';
import DoctorDashboard from './DoctorDashboard';
import NurseDashboard from './NurseDashboard';
import ReceptionistDashboard from './ReceptionistDashboard';
import PatientDashboard from './PatientDashboard';
import DashboardLayout from './DashboardLayout';
import LoadingSpinner from '../common/LoadingSpinner';

const DashboardRouter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    // Try to restore auth from storage first
    dispatch(restoreAuthFromStorage());
  }, [dispatch]);

  useEffect(() => {
    // If we have authentication but no user data, fetch current user
    if (isAuthenticated && !user && !isLoading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, isAuthenticated, user, isLoading]);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && !isLoading) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!isAuthenticated || !user) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  const renderDashboardContent = () => {
    switch (user.role) {
      case BusinessRole.SUPER_ADMIN:
        return <SuperAdminDashboard />;

      case BusinessRole.TECH_ADVISOR:
        return <TechAdvisorDashboard />;

      case BusinessRole.HOSPITAL_ADMIN:
        return <HospitalAdminDashboard />;

      case BusinessRole.DOCTOR:
        return <DoctorDashboard />;

      case BusinessRole.NURSE:
        return <NurseDashboard />;

      case BusinessRole.RECEPTIONIST:
        return <ReceptionistDashboard />;

      case BusinessRole.PATIENT:
        return <PatientDashboard />;

      default:
        return (
          <div className="error-container">
            <h2>Access Denied</h2>
            <p>Your role "{user.role}" is not recognized or does not have dashboard access.</p>
            <p>Please contact your administrator for assistance.</p>
          </div>
        );
    }
  };

  return (
    <DashboardLayout user={user}>
      {renderDashboardContent()}
    </DashboardLayout>
  );
};

export default DashboardRouter;
// src/hooks/usePermissions.ts
// import { useAppSelector } from './redux';
import { useAppSelector } from '../store/hooks';
import {
  selectCanCreateBusinessUser,
  selectCanCreateHospital,
  selectCanCreateHospitalUser,
  selectCanManagePatients,
  selectUserRole
} from '../store/slices/authSlice';


export const usePermissions = () => {
  const userRole = useAppSelector(selectUserRole);
  const canCreateBusinessUser = useAppSelector(selectCanCreateBusinessUser);
  const canCreateHospital = useAppSelector(selectCanCreateHospital);
  const canCreateHospitalUser = useAppSelector(selectCanCreateHospitalUser);
  const canManagePatients = useAppSelector(selectCanManagePatients);

  // Additional permission checks
  const canViewAllHospitals = () => userRole === 'SUPER_ADMIN';
  const canViewHospitalDashboard = () => ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE'].includes(userRole || '');
  const canManageAppointments = () => ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(userRole || '');
  const canViewReports = () => ['SUPER_ADMIN', 'HOSPITAL_ADMIN'].includes(userRole || '');
  const canManageBilling = () => ['HOSPITAL_ADMIN', 'BILLING_STAFF'].includes(userRole || '');
  const canPrescribeMedication = () => userRole === 'DOCTOR';
  const canViewMedicalRecords = () => ['DOCTOR', 'NURSE'].includes(userRole || '');

  return {
    userRole,
    canCreateBusinessUser,
    canCreateHospital,
    canCreateHospitalUser,
    canManagePatients,
    canViewAllHospitals,
    canViewHospitalDashboard,
    canManageAppointments,
    canViewReports,
    canManageBilling,
    canPrescribeMedication,
    canViewMedicalRecords,
  };
};

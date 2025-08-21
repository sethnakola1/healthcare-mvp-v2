// src/constants/roles.ts
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    'manage_tech_advisors',
    'view_all_hospitals',
    'view_system_metrics',
    'manage_system_settings',
  ],
  TECH_ADVISOR: [
    'view_my_hospitals',
    'create_hospitals',
    'view_performance_metrics',
  ],
  HOSPITAL_ADMIN: [
    'manage_doctors',
    'manage_patients',
    'view_appointments',
    'view_hospital_reports',
    'manage_staff',
  ],
  DOCTOR: [
    'view_my_appointments',
    'manage_medical_records',
    'create_prescriptions',
    'view_my_patients',
  ],
  NURSE: [
    'view_patient_care',
    'view_schedules',
    'view_medical_records',
    'update_patient_vitals',
  ],
  RECEPTIONIST: [
    'manage_appointments',
    'patient_checkin',
    'view_patients',
    'manage_schedules',
  ],
  PATIENT: [
    'view_my_appointments',
    'view_my_medical_history',
    'view_my_prescriptions',
    'view_my_bills',
  ],
} as const;

export const ROLE_HIERARCHY = {
  SUPER_ADMIN: 7,
  TECH_ADVISOR: 6,
  HOSPITAL_ADMIN: 5,
  DOCTOR: 4,
  NURSE: 3,
  RECEPTIONIST: 2,
  PATIENT: 1,
} as const;

export const hasPermission = (userRole: string, permission: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  return permissions?.includes(permission) || false;
};

export const canAccessRole = (userRole: string, targetRole: string): boolean => {
  const userLevel = ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const targetLevel = ROLE_HIERARCHY[targetRole as keyof typeof ROLE_HIERARCHY] || 0;
  return userLevel >= targetLevel;
};
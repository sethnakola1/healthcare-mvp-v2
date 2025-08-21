// src/config/constants.ts

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

export const AUTH_CONFIG = {
  TOKEN_KEY: 'authToken',
  USER_KEY: 'authUser',
  REFRESH_TOKEN_KEY: 'refreshToken',
  REMEMBER_ME_KEY: 'rememberMe',

  // Token refresh threshold (refresh when less than 5 minutes remain)
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes in milliseconds

  // Auto-logout after token expires
  AUTO_LOGOUT_ENABLED: true,
};

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TECH_ADVISOR: 'TECH_ADVISOR',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  PATIENT: 'PATIENT',
} as const;

export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    'manage_users',
    'manage_hospitals',
    'view_all_data',
    'system_admin',
  ],
  [USER_ROLES.TECH_ADVISOR]: [
    'manage_hospitals',
    'view_partner_data',
  ],
  [USER_ROLES.HOSPITAL_ADMIN]: [
    'manage_hospital_users',
    'view_hospital_data',
    'manage_patients',
    'view_reports',
  ],
  [USER_ROLES.DOCTOR]: [
    'view_patients',
    'manage_appointments',
    'write_prescriptions',
    'view_medical_records',
  ],
  [USER_ROLES.NURSE]: [
    'view_patients',
    'manage_appointments',
    'view_medical_records',
  ],
  [USER_ROLES.RECEPTIONIST]: [
    'manage_appointments',
    'register_patients',
    'view_schedules',
  ],
  [USER_ROLES.PATIENT]: [
    'view_own_data',
    'book_appointments',
    'view_prescriptions',
  ],
};

export const APP_CONFIG = {
  NAME: process.env.REACT_APP_APP_NAME || 'HealthHorizon',
  VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  DEBUG_MODE: process.env.REACT_APP_DEBUG_MODE === 'true',
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
};

export const DEMO_CREDENTIALS = {
  SUPER_ADMIN: {
    email: 'sethnakola@healthhorizon.com',
    password: 'SuperAdmin123!',
    role: 'SUPER_ADMIN',
  },
  // Add more demo credentials as they become available
};

export const NAVIGATION_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  DOCTORS: '/doctors',
  HOSPITALS: '/hospitals',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
  ACCESS_DENIED: 'You do not have permission to access this resource.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
};

export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  PROFILE_UPDATED: 'Profile updated successfully.',
  PASSWORD_CHANGED: 'Password changed successfully.',
};

// Utility function to check permissions
export const hasPermission = (userRole: string, permission: string): boolean => {
  const permissions = ROLE_PERMISSIONS[userRole as keyof typeof ROLE_PERMISSIONS];
  return permissions?.includes(permission) ?? false;
};

// Utility function to get role display name
export const getRoleDisplayName = (role: string): string => {
  const displayNames: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    TECH_ADVISOR: 'Tech Advisor',
    HOSPITAL_ADMIN: 'Hospital Admin',
    DOCTOR: 'Doctor',
    NURSE: 'Nurse',
    RECEPTIONIST: 'Receptionist',
    PATIENT: 'Patient',
  };

  return displayNames[role] || role;
};

// Utility function to get role color
export const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    SUPER_ADMIN: '#e74c3c',
    TECH_ADVISOR: '#34495e',
    HOSPITAL_ADMIN: '#3498db',
    DOCTOR: '#27ae60',
    NURSE: '#f39c12',
    RECEPTIONIST: '#9b59b6',
    PATIENT: '#1abc9c',
  };

  return colors[role] || '#95a5a6';
};
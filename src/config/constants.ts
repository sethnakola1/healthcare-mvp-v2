// src/config/constants.ts

// Role definitions
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TECH_ADVISOR: 'TECH_ADVISOR',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  PATIENT: 'PATIENT',
  BILLING_STAFF: 'BILLING_STAFF',
  LAB_STAFF: 'LAB_STAFF',
  PHARMACY_STAFF: 'PHARMACY_STAFF',
} as const;

// Role colors for UI display
const ROLE_COLORS: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: '#dc2626', // red-600
  [ROLES.TECH_ADVISOR]: '#ea580c', // orange-600
  [ROLES.HOSPITAL_ADMIN]: '#7c3aed', // violet-600
  [ROLES.DOCTOR]: '#2563eb', // blue-600
  [ROLES.NURSE]: '#059669', // emerald-600
  [ROLES.RECEPTIONIST]: '#0891b2', // cyan-600
  [ROLES.PATIENT]: '#65a30d', // lime-600
  [ROLES.BILLING_STAFF]: '#ca8a04', // yellow-600
  [ROLES.LAB_STAFF]: '#c2410c', // orange-700
  [ROLES.PHARMACY_STAFF]: '#9333ea', // purple-600
};

// Function to get role color
export const getRoleColor = (role: string): string => {
  return ROLE_COLORS[role] || '#6b7280'; // gray-500 as default
};

// Role display names
export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.TECH_ADVISOR]: 'Tech Advisor',
  [ROLES.HOSPITAL_ADMIN]: 'Hospital Admin',
  [ROLES.DOCTOR]: 'Doctor',
  [ROLES.NURSE]: 'Nurse',
  [ROLES.RECEPTIONIST]: 'Receptionist',
  [ROLES.PATIENT]: 'Patient',
  [ROLES.BILLING_STAFF]: 'Billing Staff',
  [ROLES.LAB_STAFF]: 'Lab Staff',
  [ROLES.PHARMACY_STAFF]: 'Pharmacy Staff',
};

// Function to get role display name
export const getRoleDisplayName = (role: string): string => {
  return ROLE_DISPLAY_NAMES[role] || role;
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'accessToken',
  REFRESH_TOKEN_KEY: 'refreshToken',
  USER_KEY: 'user',
  TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000, // 5 minutes in milliseconds
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

// Appointment Status Colors
export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  [APPOINTMENT_STATUS.SCHEDULED]: '#f59e0b', // amber-500
  [APPOINTMENT_STATUS.CONFIRMED]: '#3b82f6', // blue-500
  [APPOINTMENT_STATUS.IN_PROGRESS]: '#8b5cf6', // violet-500
  [APPOINTMENT_STATUS.COMPLETED]: '#10b981', // emerald-500
  [APPOINTMENT_STATUS.CANCELLED]: '#ef4444', // red-500
  [APPOINTMENT_STATUS.NO_SHOW]: '#6b7280', // gray-500
};

// Patient Status
export const PATIENT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISCHARGED: 'DISCHARGED',
} as const;

// Blood Groups
export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
] as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  LOGOUT: 'Logout successful',
  PATIENT_CREATED: 'Patient registered successfully',
  PATIENT_UPDATED: 'Patient updated successfully',
  APPOINTMENT_CREATED: 'Appointment booked successfully',
  APPOINTMENT_UPDATED: 'Appointment updated successfully',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  TOKEN_EXPIRED: 'Your session has expired. Please login again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  DATETIME: 'MMM dd, yyyy hh:mm a',
  TIME: 'hh:mm a',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

// Theme Configuration
export const THEME = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;

// Navigation Menu Items (for role-based access)
export const MENU_ITEMS = {
  [ROLES.SUPER_ADMIN]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/users', label: 'User Management', icon: 'users' },
    { path: '/hospitals', label: 'Hospitals', icon: 'hospital' },
    { path: '/reports', label: 'Reports', icon: 'reports' },
    { path: '/settings', label: 'Settings', icon: 'settings' },
  ],
  [ROLES.HOSPITAL_ADMIN]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/patients', label: 'Patients', icon: 'patients' },
    { path: '/appointments', label: 'Appointments', icon: 'appointments' },
    { path: '/doctors', label: 'Doctors', icon: 'doctors' },
    { path: '/staff', label: 'Staff', icon: 'staff' },
    { path: '/billing', label: 'Billing', icon: 'billing' },
    { path: '/reports', label: 'Reports', icon: 'reports' },
  ],
  [ROLES.DOCTOR]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/appointments', label: 'Appointments', icon: 'appointments' },
    { path: '/patients', label: 'Patients', icon: 'patients' },
    { path: '/medical-records', label: 'Medical Records', icon: 'records' },
    { path: '/prescriptions', label: 'Prescriptions', icon: 'prescriptions' },
  ],
  [ROLES.PATIENT]: [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { path: '/appointments', label: 'My Appointments', icon: 'appointments' },
    { path: '/medical-records', label: 'Medical Records', icon: 'records' },
    { path: '/prescriptions', label: 'Prescriptions', icon: 'prescriptions' },
    { path: '/billing', label: 'Billing', icon: 'billing' },
  ],
};

// Export default object with all constants
export default {
  ROLES,
  ROLE_COLORS,
  ROLE_DISPLAY_NAMES,
  API_CONFIG,
  AUTH_CONFIG,
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_COLORS,
  PATIENT_STATUS,
  BLOOD_GROUPS,
  GENDER_OPTIONS,
  HTTP_STATUS,
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
  PAGINATION,
  DATE_FORMATS,
  STORAGE_KEYS,
  THEME,
  MENU_ITEMS,
  getRoleColor,
  getRoleDisplayName,
};
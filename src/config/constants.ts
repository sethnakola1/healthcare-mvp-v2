// src/config/constants.ts

export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  REGISTER: '/auth/register',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  AUTH_USER: 'authUser',
  REFRESH_TOKEN: 'refreshToken',
  REMEMBER_ME: 'rememberMe',
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PATIENTS: '/patients',
  APPOINTMENTS: '/appointments',
  DOCTORS: '/doctors',
  HOSPITALS: '/hospitals',
  MEDICAL_RECORDS: '/medical-records',
  PRESCRIPTIONS: '/prescriptions',
  BILLING: '/billing',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TECH_ADVISOR: 'TECH_ADVISOR',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  PATIENT: 'PATIENT',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
} as const;

export const APPOINTMENT_TYPES = {
  CONSULTATION: 'CONSULTATION',
  FOLLOW_UP: 'FOLLOW_UP',
  EMERGENCY: 'EMERGENCY',
  CHECKUP: 'CHECKUP',
  PROCEDURE: 'PROCEDURE',
  SURGERY: 'SURGERY',
} as const;

export const GENDER_OPTIONS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER',
} as const;

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MAX_PHONE_LENGTH: 20,
  MAX_ADDRESS_LENGTH: 500,
} as const;

export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy hh:mm a',
  INPUT: 'yyyy-MM-dd',
  INPUT_WITH_TIME: 'yyyy-MM-dd HH:mm',
  ISO: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
} as const;

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

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

export const THEME = {
  COLORS: {
    PRIMARY: '#3b82f6',
    PRIMARY_DARK: '#1d4ed8',
    SECONDARY: '#64748b',
    SUCCESS: '#10b981',
    WARNING: '#f59e0b',
    ERROR: '#ef4444',
    INFO: '#3b82f6',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
} as const;

export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

export default {
  API_BASE_URL,
  AUTH_ENDPOINTS,
  STORAGE_KEYS,
  ROUTES,
  USER_ROLES,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  GENDER_OPTIONS,
  BLOOD_GROUPS,
  PAGINATION,
  VALIDATION,
  DATE_FORMATS,
  TOAST_TYPES,
  HTTP_STATUS,
  THEME,
  DEBOUNCE_DELAY,
  TOAST_DURATION,
  TOKEN_REFRESH_THRESHOLD,
};
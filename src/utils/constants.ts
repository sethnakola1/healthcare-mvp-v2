// src/utils/constants.ts
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
    VALIDATE: '/api/auth/validate',
  },
  DASHBOARD: '/api/dashboard',
  USERS: '/api/users',
  HOSPITALS: '/api/hospitals',
  DOCTORS: '/api/doctors',
  PATIENTS: '/api/patients',
  APPOINTMENTS: '/api/appointments',
} as const;

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  SESSION_EXPIRY: 'sessionExpiry',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  CHANGE_PASSWORD: '/change-password',
} as const;

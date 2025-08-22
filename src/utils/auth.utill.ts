// Role definitions and utilities
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  TECH_ADVISOR: 'TECH_ADVISOR',
  HOSPITAL_ADMIN: 'HOSPITAL_ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  RECEPTIONIST: 'RECEPTIONIST',
  PATIENT: 'PATIENT',
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

// Role display names
export const getRoleDisplayName = (role: string): string => {
  const roleMap: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: 'Super Admin',
    [ROLES.TECH_ADVISOR]: 'Tech Advisor',
    [ROLES.HOSPITAL_ADMIN]: 'Hospital Admin',
    [ROLES.DOCTOR]: 'Doctor',
    [ROLES.NURSE]: 'Nurse',
    [ROLES.RECEPTIONIST]: 'Receptionist',
    [ROLES.PATIENT]: 'Patient',
  };
  return roleMap[role] || role;
};

// Role color utilities
export const getRoleColor = (role: string): string => {
  const colorMap: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: 'bg-red-100 text-red-800',
    [ROLES.TECH_ADVISOR]: 'bg-purple-100 text-purple-800',
    [ROLES.HOSPITAL_ADMIN]: 'bg-blue-100 text-blue-800',
    [ROLES.DOCTOR]: 'bg-green-100 text-green-800',
    [ROLES.NURSE]: 'bg-teal-100 text-teal-800',
    [ROLES.RECEPTIONIST]: 'bg-yellow-100 text-yellow-800',
    [ROLES.PATIENT]: 'bg-gray-100 text-gray-800',
  };
  return colorMap[role] || 'bg-gray-100 text-gray-800';
};

// Role badge variants for different UI libraries
export const getRoleBadgeColor = (role: string): { bg: string; text: string; border?: string } => {
  const colorMap: Record<string, { bg: string; text: string; border?: string }> = {
    [ROLES.SUPER_ADMIN]: { bg: 'bg-red-500', text: 'text-white', border: 'border-red-500' },
    [ROLES.TECH_ADVISOR]: { bg: 'bg-purple-500', text: 'text-white', border: 'border-purple-500' },
    [ROLES.HOSPITAL_ADMIN]: { bg: 'bg-blue-500', text: 'text-white', border: 'border-blue-500' },
    [ROLES.DOCTOR]: { bg: 'bg-green-500', text: 'text-white', border: 'border-green-500' },
    [ROLES.NURSE]: { bg: 'bg-teal-500', text: 'text-white', border: 'border-teal-500' },
    [ROLES.RECEPTIONIST]: { bg: 'bg-yellow-500', text: 'text-white', border: 'border-yellow-500' },
    [ROLES.PATIENT]: { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' },
  };
  return colorMap[role] || { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
};

// Permission utilities
export const hasPermission = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole);
};

export const isAdminRole = (role: string): boolean => {
  return [ROLES.SUPER_ADMIN, ROLES.HOSPITAL_ADMIN].includes(role as UserRole);
};

export const isMedicalStaff = (role: string): boolean => {
  return [ROLES.DOCTOR, ROLES.NURSE].includes(role as UserRole);
};

export const canManageAppointments = (role: string): boolean => {
  return [ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST].includes(role as UserRole);
};

export const canViewPatientData = (role: string): boolean => {
  return [ROLES.HOSPITAL_ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST].includes(role as UserRole);
};

// Token utilities
export const getTokenFromStorage = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const getRefreshTokenFromStorage = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const setTokenInStorage = (token: string): void => {
  localStorage.setItem('accessToken', token);
};

export const setRefreshTokenInStorage = (token: string): void => {
  localStorage.setItem('refreshToken', token);
};

export const removeTokensFromStorage = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

// API utilities
export const getAuthHeaders = (): Record<string, string> => {
  const token = getTokenFromStorage();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers,
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Navigation utilities
export const getDefaultRoute = (role: string): string => {
  const routeMap: Record<string, string> = {
    [ROLES.SUPER_ADMIN]: '/admin/dashboard',
    [ROLES.TECH_ADVISOR]: '/advisor/dashboard',
    [ROLES.HOSPITAL_ADMIN]: '/hospital/dashboard',
    [ROLES.DOCTOR]: '/doctor/dashboard',
    [ROLES.NURSE]: '/nurse/dashboard',
    [ROLES.RECEPTIONIST]: '/reception/dashboard',
    [ROLES.PATIENT]: '/patient/dashboard',
  };
  return routeMap[role] || '/dashboard';
};

// Error handling utilities
export const formatAuthError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.error) {
    return error.error;
  }

  return 'An unexpected error occurred. Please try again.';
};

// Date/Time utilities for auth
export const formatLastLogin = (lastLogin: string | null): string => {
  if (!lastLogin) {
    return 'Never';
  }

  const loginDate = new Date(lastLogin);
  const now = new Date();
  const diffInMs = now.getTime() - loginDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else {
    return loginDate.toLocaleDateString();
  }
};

// URL utilities
export const getAPIBaseURL = (): string => {
  return process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
};

// Local storage utilities with error handling
export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to get item from localStorage: ${key}`, error);
    return null;
  }
};

export const safeLocalStorageSet = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Failed to set item in localStorage: ${key}`, error);
    return false;
  }
};

export const safeLocalStorageRemove = (key: string): boolean => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove item from localStorage: ${key}`, error);
    return false;
  }
};

export default {
  ROLES,
  getRoleDisplayName,
  getRoleColor,
  getRoleBadgeColor,
  hasPermission,
  isAdminRole,
  isMedicalStaff,
  canManageAppointments,
  canViewPatientData,
  getTokenFromStorage,
  getRefreshTokenFromStorage,
  setTokenInStorage,
  setRefreshTokenInStorage,
  removeTokensFromStorage,
  isTokenExpired,
  getAuthHeaders,
  makeAuthenticatedRequest,
  validateEmail,
  validatePassword,
  getDefaultRoute,
  formatAuthError,
  formatLastLogin,
  getAPIBaseURL,
  safeLocalStorageGet,
  safeLocalStorageSet,
  safeLocalStorageRemove,
};
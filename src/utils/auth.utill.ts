// src/utils/auth.util.ts
import { User } from '../contexts/AuthContext';

export interface TokenPayload {
  userId: string;
  email: string;
  hospitalId?: string;
  roles: string[];
  tokenType: string;
  sub: string;
  iat: number;
  exp: number;
}

// Role color mapping
export const getRoleColor = (role: string): string => {
  const roleColors: Record<string, string> = {
    SUPER_ADMIN: '#dc2626', // red-600
    TECH_ADVISOR: '#059669', // emerald-600
    HOSPITAL_ADMIN: '#2563eb', // blue-600
    DOCTOR: '#7c3aed', // violet-600
    NURSE: '#db2777', // pink-600
    RECEPTIONIST: '#ea580c', // orange-600
    PATIENT: '#0891b2', // cyan-600
    BILLING_STAFF: '#65a30d', // lime-600
    LAB_ADMIN: '#a21caf', // fuchsia-700
    LAB_STAFF: '#0d9488', // teal-600
    PHARMACY_ADMIN: '#be185d', // pink-700
    PHARMACY_STAFF: '#0369a1', // sky-700
    TECHNICIAN: '#374151', // gray-700
  };

  return roleColors[role] || '#6b7280'; // gray-500 as default
};

// Role display names
export const getRoleDisplayName = (role: string): string => {
  const roleDisplayNames: Record<string, string> = {
    SUPER_ADMIN: 'Super Admin',
    TECH_ADVISOR: 'Tech Advisor',
    HOSPITAL_ADMIN: 'Hospital Admin',
    DOCTOR: 'Doctor',
    NURSE: 'Nurse',
    RECEPTIONIST: 'Receptionist',
    PATIENT: 'Patient',
    BILLING_STAFF: 'Billing Staff',
    LAB_ADMIN: 'Lab Admin',
    LAB_STAFF: 'Lab Staff',
    PHARMACY_ADMIN: 'Pharmacy Admin',
    PHARMACY_STAFF: 'Pharmacy Staff',
    TECHNICIAN: 'Technician',
  };

  return roleDisplayNames[role] || role.replace('_', ' ');
};

// Check if user has specific role
export const hasRole = (user: User | null, role: string): boolean => {
  if (!user) return false;
  return user.role === role;
};

// Check if user has any of the specified roles
export const hasAnyRole = (user: User | null, roles: string[]): boolean => {
  if (!user) return false;
  return roles.includes(user.role);
};

// Check admin permissions
export const isAdmin = (user: User | null): boolean => {
  return hasAnyRole(user, ['SUPER_ADMIN', 'HOSPITAL_ADMIN']);
};

// Check medical staff permissions
export const isMedicalStaff = (user: User | null): boolean => {
  return hasAnyRole(user, ['DOCTOR', 'NURSE']);
};

// Check if user can manage appointments
export const canManageAppointments = (user: User | null): boolean => {
  return hasAnyRole(user, ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']);
};

// Check if user can view patient data
export const canViewPatientData = (user: User | null): boolean => {
  return hasAnyRole(user, ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']);
};

// Check if user can manage billing
export const canManageBilling = (user: User | null): boolean => {
  return hasAnyRole(user, ['HOSPITAL_ADMIN', 'BILLING_STAFF', 'RECEPTIONIST']);
};

// Token utilities
export const parseToken = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

export const isTokenValid = (token: string): boolean => {
  try {
    const payload = parseToken(token);
    if (!payload) return false;

    const currentTime = Date.now() / 1000;
    return payload.exp > currentTime;
  } catch (error) {
    return false;
  }
};

export const getTokenExpirationTime = (token: string): Date | null => {
  try {
    const payload = parseToken(token);
    if (!payload) return null;

    return new Date(payload.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Storage utilities
export const getStoredUser = (): User | null => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

export const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getStoredRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

export const clearAuthStorage = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Format utilities
export const formatUserName = (user: User | null): string => {
  if (!user) return 'Unknown User';
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
};

export const formatUserInitials = (user: User | null): string => {
  if (!user) return 'UN';
  const firstInitial = user.firstName?.charAt(0).toUpperCase() || '';
  const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
  return (firstInitial + lastInitial) || user.email?.charAt(0).toUpperCase() || 'U';
};

// Navigation utilities based on role
export const getDefaultRoute = (role: string): string => {
  const defaultRoutes: Record<string, string> = {
    SUPER_ADMIN: '/admin/dashboard',
    TECH_ADVISOR: '/advisor/dashboard',
    HOSPITAL_ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
    NURSE: '/nurse/dashboard',
    RECEPTIONIST: '/reception/dashboard',
    PATIENT: '/patient/dashboard',
    BILLING_STAFF: '/billing/dashboard',
    LAB_ADMIN: '/lab/dashboard',
    LAB_STAFF: '/lab/dashboard',
    PHARMACY_ADMIN: '/pharmacy/dashboard',
    PHARMACY_STAFF: '/pharmacy/dashboard',
    TECHNICIAN: '/tech/dashboard',
  };

  return defaultRoutes[role] || '/dashboard';
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

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/(?=.*[@$!%*?&])/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Create auth utilities object
const authUtils = {
  getRoleColor,
  getRoleDisplayName,
  hasRole,
  hasAnyRole,
  isAdmin,
  isMedicalStaff,
  canManageAppointments,
  canViewPatientData,
  canManageBilling,
  parseToken,
  isTokenValid,
  getTokenExpirationTime,
  getStoredUser,
  getStoredToken,
  getStoredRefreshToken,
  clearAuthStorage,
  formatUserName,
  formatUserInitials,
  getDefaultRoute,
  validateEmail,
  validatePassword,
};

export default authUtils;
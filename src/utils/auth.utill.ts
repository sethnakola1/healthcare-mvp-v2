// auth.util.ts
export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  TECH_ADVISOR = "TECH_ADVISOR",
  HOSPITAL_ADMIN = "HOSPITAL_ADMIN",
  DOCTOR = "DOCTOR",
  NURSE = "NURSE",
  RECEPTIONIST = "RECEPTIONIST",
  PATIENT = "PATIENT"
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  hospitalId?: string;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  loginTime: string;
}

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return '#8B5CF6'; // Purple
    case UserRole.TECH_ADVISOR:
      return '#06B6D4'; // Cyan
    case UserRole.HOSPITAL_ADMIN:
      return '#EF4444'; // Red
    case UserRole.DOCTOR:
      return '#10B981'; // Green
    case UserRole.NURSE:
      return '#F59E0B'; // Yellow
    case UserRole.RECEPTIONIST:
      return '#6366F1'; // Indigo
    case UserRole.PATIENT:
      return '#84CC16'; // Lime
    default:
      return '#6B7280'; // Gray
  }
};

export const canAccessPatientData = (userRole: UserRole): boolean => {
  return [
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.HOSPITAL_ADMIN
  ].includes(userRole);
};

export const canManageAppointments = (userRole: UserRole): boolean => {
  return [
    UserRole.HOSPITAL_ADMIN,
    UserRole.DOCTOR,
    UserRole.NURSE,
    UserRole.RECEPTIONIST
  ].includes(userRole);
};

export const canManageHospital = (userRole: UserRole): boolean => {
  return [
    UserRole.SUPER_ADMIN,
    UserRole.TECH_ADVISOR,
    UserRole.HOSPITAL_ADMIN
  ].includes(userRole);
};

export const isAdminRole = (userRole: UserRole): boolean => {
  return [
    UserRole.SUPER_ADMIN,
    UserRole.HOSPITAL_ADMIN
  ].includes(userRole);
};

export const isMedicalStaff = (userRole: UserRole): boolean => {
  return [
    UserRole.DOCTOR,
    UserRole.NURSE
  ].includes(userRole);
};

// Role hierarchy for permission checking
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRole.SUPER_ADMIN]: 100,
  [UserRole.TECH_ADVISOR]: 80,
  [UserRole.HOSPITAL_ADMIN]: 60,
  [UserRole.DOCTOR]: 50,
  [UserRole.NURSE]: 40,
  [UserRole.RECEPTIONIST]: 30,
  [UserRole.PATIENT]: 10
};

export const hasHigherPermission = (userRole: UserRole, requiredRole: UserRole): boolean => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case UserRole.SUPER_ADMIN:
      return 'Super Admin';
    case UserRole.TECH_ADVISOR:
      return 'Tech Advisor';
    case UserRole.HOSPITAL_ADMIN:
      return 'Hospital Admin';
    case UserRole.DOCTOR:
      return 'Doctor';
    case UserRole.NURSE:
      return 'Nurse';
    case UserRole.RECEPTIONIST:
      return 'Receptionist';
    case UserRole.PATIENT:
      return 'Patient';
    default:
      return role;
  }
};

export const parseUserRole = (roleString: string): UserRole => {
  const normalizedRole = roleString.replace('ROLE_', '').toUpperCase();
  return Object.values(UserRole).find(role => role === normalizedRole) || UserRole.PATIENT;
};

// Token utilities
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const getTokenPayload = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export const formatUserName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`.trim();
};

export default {
  UserRole,
  getRoleColor,
  canAccessPatientData,
  canManageAppointments,
  canManageHospital,
  isAdminRole,
  isMedicalStaff,
  hasHigherPermission,
  getRoleDisplayName,
  parseUserRole,
  isTokenExpired,
  getTokenPayload,
  formatUserName
};
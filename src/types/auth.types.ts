export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  error: string | null;
  lastActivity: number;
}

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  role: BusinessRole; // Fixed: Use BusinessRole enum instead of string
  roleDisplayName: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt: string;
}

export enum BusinessRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  LAB_STAFF = 'LAB_STAFF',
  PHARMACY_STAFF = 'PHARMACY_STAFF',
  BILLING_STAFF = 'BILLING_STAFF',
  PATIENT = 'PATIENT'
}

export interface LoginCredentials {
  email: string;
  password: string;
}

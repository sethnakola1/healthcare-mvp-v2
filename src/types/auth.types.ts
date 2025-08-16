// src/types/auth.types.ts

export interface LoginRequest {
  email: string;
  password: string;
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

export interface UserProfile {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  role: string;
  roleDisplayName: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt: string;
  // Business-specific fields for TECH_ADVISOR role
  commissionPercentage?: number;
  targetHospitalsMonthly?: number;
  totalHospitalsBrought?: number;
  totalCommissionEarned?: number;
}

export interface RegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: BusinessRole;
}

export enum BusinessRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TECH_ADVISOR = 'TECH_ADVISOR',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PATIENT = 'PATIENT'
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: number | null;
}

export interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegistrationRequest) => Promise<void>;
  refreshAuth: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: BusinessRole) => boolean;
  hasAnyRole: (roles: BusinessRole[]) => boolean;
}

// API Response wrapper type
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

// Error response type
export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: any;
  timestamp: string;
}

// Security-related types
export interface SecurityConfig {
  csrfToken?: string;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

// Dashboard data type
export interface DashboardData {
  appointments?: any[];
  bills?: any[];
  prescriptions?: any[];
  users?: any[];
  systemMetrics?: Record<string, any>;
  feedback?: any[];
  notifications?: any[];
}

export interface User{
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  role: BusinessRole;
  roleDisplayName: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt: string;
}
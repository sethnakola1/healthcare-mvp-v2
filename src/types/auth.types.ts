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
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt?: string;
  // Business-specific fields for TECH_ADVISOR role
  commissionPercentage?: number;
  targetHospitalsMonthly?: number;
  totalHospitalsBrought?: number;
  totalCommissionEarned?: number;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  username: string;
  roleDisplayName: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  role: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  sessionExpiry: number | null;
}

export interface BusinessUser {
  businessUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessRole: string;
  partnerCode?: string;
  territory?: string;
  isActive: boolean;
  emailVerified: boolean;
}

export interface BusinessState {
  users: BusinessUser[];
  currentUser: BusinessUser | null;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface BusinessUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
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
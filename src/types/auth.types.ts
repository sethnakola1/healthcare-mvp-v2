// export interface AuthState {
//   user: User | null;
//   token: string | null;
//   refreshToken: string | null;
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   error: string | null;
// }

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
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


// export interface User {
//   userId: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   fullName: string;
//   username: string;
//   role: string;
//   roleDisplayName: string;
//   isActive: boolean;
//   emailVerified: boolean;
//   phoneNumber?: string;
//   territory?: string;
//   partnerCode?: string;
//   lastLogin?: string;
//   createdAt: string;
// }

export interface User {
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
}






export enum UserRole {
  ADMIN = 'admin',
  DOCTOR = 'doctor',
  NURSE = 'nurse',
  PATIENT = 'patient',
  STAFF = 'staff'
}

// src/types/auth.types.ts
// export interface LoginRequest {
//   email: string;
//   password: string;
// }

// src/types/auth.types.ts
export interface LoginRequest {
  email: string;
  password: string;
}



// export interface LoginResponse {
//   accessToken: string;
//   refreshToken: string;
//   tokenType: string;
//   expiresIn: number;
//   userId: string;
//   email: string;
//   firstName: string;
//   lastName: string;
//   role: string;
//   loginTime: string;
// }

export interface LoginResponse {
  error: string;
  user: any;
  success: any;
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

export interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetResponse {
  success: boolean;
  message: string;
  error?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}


export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  errorCode?: string;
}





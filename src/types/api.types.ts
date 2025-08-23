// src/types/api.types.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp: string;
  path?: string;
  status?: number;
  metadata?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  sortBy?: string;
  sortDirection?: string;
}

// export interface BaseResponse<T> extends ApiResponse<T> {
//   error?: string;
// }

export interface BaseResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface ErrorResponse {
  success: false;
  errorCode: string;
  message: string;
  timestamp: string;
  path?: string;
  status?: number;
  metadata?: {
    fieldErrors?: Record<string, string>;
    [key: string]: any;
  };
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

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface User {
  id: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
   //role: UserRole; // Assuming UserRole is defined elsewhere or in this file
  updatedAt: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt: string;
  profilePicture?: string;
}

// Login Payload
export interface LoginCredentials {
  email: string;
  password: string;
}

// Login Response Data (what's inside BaseResponse.data for login)
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User; // The actual user object
}

// You might have UserRole defined in auth.util.ts or a global types file
export enum UserRole {
  Patient = 'PATIENT',
  Doctor = 'DOCTOR',
  Admin = 'ADMIN',
  Nurse = 'NURSE',
  Receptionist = 'RECEPTIONIST',
  Pharmacist = 'PHARMACIST',
  Laboratory = 'LABORATORY',
  Radiologist = 'RADIOLOGIST',
}

export default ApiResponse;
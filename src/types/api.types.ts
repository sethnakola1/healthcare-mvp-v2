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

export interface BaseResponse<T> extends ApiResponse<T> {
  error?: string;
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
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  updatedAt: string;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt: string;
}

export default ApiResponse;
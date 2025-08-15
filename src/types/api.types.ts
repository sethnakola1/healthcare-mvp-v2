// src/types/api.types.ts (MISSING FILE - ADD THIS)
export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

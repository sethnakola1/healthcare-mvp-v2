// src/types/api.d.ts
export interface ApiRequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

export interface SearchParams {
  search?: string;
  filters?: Record<string, any>;
}

export interface ApiListResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
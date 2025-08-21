// src/utils/api.ts
import { AUTH_CONFIG, API_CONFIG } from '../config/constants';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
  timestamp?: string;
  path?: string;
}

export interface ApiError {
  message: string;
  status: number;
  errorCode?: string;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  // Get stored token
  private getToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  }

  // Get stored refresh token
  private getRefreshToken(): string | null {
    return localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  }

  // Set new tokens
  private setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, accessToken);
    if (refreshToken) {
      localStorage.setItem(AUTH_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  // Clear all tokens
  private clearTokens(): void {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.USER_KEY);
  }

  // Refresh access token
  private async refreshAccessToken(): Promise<string> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      this.clearTokens();
      throw new Error('Token refresh failed');
    }

    const result: ApiResponse = await response.json();
    if (!result.success || !result.data) {
      this.clearTokens();
      throw new Error(result.message || 'Token refresh failed');
    }

    const { accessToken, refreshToken: newRefreshToken } = result.data;
    this.setTokens(accessToken, newRefreshToken);
    return accessToken;
  }

  // Build request headers
  private buildHeaders(includeAuth: boolean = true, customHeaders: Record<string, string> = {}): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (includeAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  // Make HTTP request with automatic token handling
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true,
    retryCount: number = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: this.buildHeaders(includeAuth, options.headers as Record<string, string>),
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, requestOptions);
      const result: ApiResponse<T> = await response.json();

      // Handle 401 Unauthorized - try to refresh token
      if (response.status === 401 && includeAuth && retryCount === 0) {
        try {
          await this.refreshAccessToken();
          // Retry the request with new token
          return this.makeRequest<T>(endpoint, options, includeAuth, retryCount + 1);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          this.clearTokens();
          throw new ApiError('Session expired. Please login again.', 401, 'TOKEN_EXPIRED');
        }
      }

      // Handle other error responses
      if (!response.ok) {
        throw new ApiError(
          result.message || result.error || `HTTP ${response.status}`,
          response.status,
          result.errorCode
        );
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Network error. Please check your connection.', 0, 'NETWORK_ERROR');
      }

      // Handle timeout errors
      if (error instanceof DOMException && error.name === 'TimeoutError') {
        throw new ApiError('Request timeout. Please try again.', 0, 'TIMEOUT_ERROR');
      }

      // Handle other errors
      throw new ApiError(error instanceof Error ? error.message : 'Unknown error occurred', 0, 'UNKNOWN_ERROR');
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' }, includeAuth);
  }

  async post<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async put<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async patch<T>(endpoint: string, data?: any, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      includeAuth
    );
  }

  async delete<T>(endpoint: string, includeAuth: boolean = true): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' }, includeAuth);
  }

  // File upload method
  async uploadFile<T>(endpoint: string, file: File, additionalData?: Record<string, any>): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    const token = this.getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return this.makeRequest<T>(
      endpoint,
      {
        method: 'POST',
        body: formData,
        headers,
      },
      false // Don't include default auth headers as we're setting them manually
    );
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export ApiError class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errorCode?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Utility functions for common API patterns
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Type guards
export const isApiResponse = <T>(response: any): response is ApiResponse<T> => {
  return (
    typeof response === 'object' &&
    response !== null &&
    typeof response.success === 'boolean'
  );
};

export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
};

// Default export
export default apiClient;
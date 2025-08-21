// src/services/api.service.ts

import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  // ApiResponse,
  UserProfile,
  ChangePasswordRequest
} from '../types/auth.types';

// Base response interface for API calls
export interface BaseResponse<T> {
  accessToken: string; // Change to string property
  refreshToken: string; // Change to string property
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds timeout
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken({ refreshToken });

              localStorage.setItem('accessToken', response.data.accessToken);
              localStorage.setItem('refreshToken', response.data.refreshToken);

              // Retry the original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              }
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.clearClientData();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private clearClientData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionExpiry');
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const sessionExpiry = localStorage.getItem('sessionExpiry');

    if (!token || !sessionExpiry) {
      return false;
    }

    const expiryTime = parseInt(sessionExpiry, 10);
    const currentTime = Date.now();

    return currentTime < expiryTime;
  }

  // Authentication methods
  public async login(credentials: LoginRequest): Promise<AxiosResponse<BaseResponse<LoginResponse>>> {
    try {
      const response = await this.api.post<BaseResponse<LoginResponse>>('/api/auth/login', credentials);

      if (response.data.success && response.data.data) {
        const loginData = response.data.data;

        // Store tokens and user data
        localStorage.setItem('accessToken', loginData.accessToken);
        localStorage.setItem('refreshToken', loginData.refreshToken);

        // Calculate session expiry (expiresIn is in seconds)
        const expiryTime = Date.now() + (loginData.expiresIn * 1000);
        localStorage.setItem('sessionExpiry', expiryTime.toString());

        // Store basic user info
        const userInfo = {
          userId: loginData.userId,
          email: loginData.email,
          firstName: loginData.firstName,
          lastName: loginData.lastName,
          role: loginData.role,
        };
        localStorage.setItem('user', JSON.stringify(userInfo));
      }

      return response;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async getCurrentUser(): Promise<AxiosResponse<BaseResponse<UserProfile>>> {
    try {
      return await this.api.get<BaseResponse<UserProfile>>('/api/auth/me');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async refreshToken(request: RefreshTokenRequest): Promise<AxiosResponse<BaseResponse<LoginResponse>>> {
    try {
      return await this.api.post<BaseResponse<LoginResponse>>('/api/auth/refresh', request);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async logout(): Promise<AxiosResponse<BaseResponse<string>>> {
    try {
      const response = await this.api.post<BaseResponse<string>>('/api/auth/logout');
      this.clearClientData();
      return response;
    } catch (error: any) {
      // Clear data even if logout fails
      this.clearClientData();
      throw this.handleError(error);
    }
  }

  public async changePassword(request: ChangePasswordRequest): Promise<AxiosResponse<BaseResponse<string>>> {
    try {
      return await this.api.post<BaseResponse<string>>('/api/auth/change-password', request);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async validateToken(): Promise<AxiosResponse<BaseResponse<boolean>>> {
    try {
      return await this.api.get<BaseResponse<boolean>>('/api/auth/validate');
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  // Generic API methods
  public async get<T>(endpoint: string): Promise<AxiosResponse<BaseResponse<T>>> {
    try {
      return await this.api.get<BaseResponse<T>>(endpoint);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async post<T>(endpoint: string, data?: any): Promise<AxiosResponse<BaseResponse<T>>> {
    try {
      return await this.api.post<BaseResponse<T>>(endpoint, data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async put<T>(endpoint: string, data?: any): Promise<AxiosResponse<BaseResponse<T>>> {
    try {
      return await this.api.put<BaseResponse<T>>(endpoint, data);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  public async delete<T>(endpoint: string): Promise<AxiosResponse<BaseResponse<T>>> {
    try {
      return await this.api.delete<BaseResponse<T>>(endpoint);
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const serverError = error.response.data;
      const message = serverError?.message || serverError?.error || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      // Request made but no response received
      return new Error('Network error - please check your connection');
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  // Utility methods
  public getBaseURL(): string {
    return this.baseURL;
  }

  public setAuthToken(token: string): void {
    if (this.api.defaults.headers) {
      this.api.defaults.headers.Authorization = `Bearer ${token}`;
    }
  }

  public clearAuthToken(): void {
    if (this.api.defaults.headers) {
      delete this.api.defaults.headers.Authorization;
    }
  }
}

// Create a singleton instance
const apiService = new ApiService();

// Named exports for specific services
export const authService = {
  login: (credentials: LoginRequest) => apiService.login(credentials),
  getCurrentUser: () => apiService.getCurrentUser(),
  refreshToken: (request: RefreshTokenRequest) => apiService.refreshToken(request),
  logout: () => apiService.logout(),
  changePassword: (request: ChangePasswordRequest) => apiService.changePassword(request),
  validateToken: () => apiService.validateToken(),
  isAuthenticated: () => apiService.isAuthenticated(),
};

// Default export
export default apiService;
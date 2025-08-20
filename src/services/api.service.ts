import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import toast from "react-hot-toast";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
  timestamp?: string;
}

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

// API Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

class ApiService {
  private api: AxiosInstance;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  constructor() {
    this.api = axios.create(API_CONFIG);
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF protection
        const csrfToken = this.getCSRFToken();
        if (csrfToken && config.headers) {
          config.headers['X-CSRF-TOKEN'] = csrfToken;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.api(originalRequest);
            }).catch(err => {
              return Promise.reject(err);
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const refreshToken = this.getRefreshToken();
            if (!refreshToken) {
              throw new Error('No refresh token available');
            }

            const response = await this.refreshToken(refreshToken);
            const { accessToken } = response.data;

            this.setAccessToken(accessToken);
            this.processQueue(null, accessToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.api(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError, null);
            this.handleAuthError();
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });

    this.failedQueue = [];
  }

  private handleApiError(error: any) {
    let message = 'An unexpected error occurred';

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          message = data.message || 'Invalid request data';
          break;
        case 401:
          message = 'Authentication failed';
          break;
        case 403:
          message = 'Access denied';
          break;
        case 404:
          message = 'Resource not found';
          break;
        case 422:
          message = data.message || 'Validation failed';
          break;
        case 500:
          message = 'Server error occurred';
          break;
        default:
          message = data.message || `Error ${status}`;
      }
    } else if (error.request) {
      message = 'Network error - please check your connection';
    }

    toast.error(message);

    return {
      message,
      status: error.response?.status,
      data: error.response?.data,
    };
  }

  private handleAuthError() {
    this.clearTokens();
    // Dispatch logout action to Redux
    window.dispatchEvent(new CustomEvent('auth:logout'));
    // Redirect to login
    window.location.href = '/login';
  }

  // Token management
  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem('refreshToken', token);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  private getCSRFToken(): string | null {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  }

  // Public methods
  public async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response = await this.api.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;
        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);

        // Store user data
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async refreshToken(refreshToken: string): Promise<ApiResponse<LoginResponse>> {
    const response = await this.api.post<ApiResponse<LoginResponse>>('/api/auth/refresh', {
      refreshToken
    });
    return response.data;
  }

  public async logout(): Promise<void> {
    try {
      await this.api.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  public async getCurrentUser(): Promise<ApiResponse<any>> {
    const response = await this.api.get<ApiResponse<any>>('/api/auth/me');
    return response.data;
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<string>> {
    const response = await this.api.post<ApiResponse<string>>('/api/auth/change-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  }

  // Generic CRUD methods
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      await this.api.get('/api/auth/health');
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get raw axios instance for special cases
  public getAxiosInstance(): AxiosInstance {
    return this.api;
  }
}

// Create singleton instance
export const apiService = new ApiService();
export default apiService;
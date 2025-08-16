// src/services/api.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export class ApiService {
  private static instance: ApiService;
  private axiosInstance: AxiosInstance;
  private csrfToken: string | null = null;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest' // CSRF protection
      }
    });

    this.setupInterceptors();
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add authentication token
        const token = SecurityUtils.getSecureToken(process.env.REACT_APP_JWT_STORAGE_KEY!);
        if (token && !SecurityUtils.isTokenExpired(token)) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add CSRF token
        if (this.csrfToken) {
          config.headers['X-CSRF-Token'] = this.csrfToken;
        }

        // Sanitize request data
        if (config.data && typeof config.data === 'object') {
          config.data = this.sanitizeRequestData(config.data);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle token refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // Redirect to login
            SecurityUtils.removeSecureToken(process.env.REACT_APP_JWT_STORAGE_KEY!);
            SecurityUtils.removeSecureToken(process.env.REACT_APP_REFRESH_TOKEN_KEY!);
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private sanitizeRequestData(data: any): any {
    if (typeof data === 'string') {
      return SecurityUtils.sanitizeInput(data);
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string') {
          sanitized[key] = SecurityUtils.sanitizeInput(value);
        } else {
          sanitized[key] = this.sanitizeRequestData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = SecurityUtils.getSecureToken(process.env.REACT_APP_REFRESH_TOKEN_KEY!);
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await this.axiosInstance.post('/auth/refresh', {
      refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    SecurityUtils.setSecureToken(process.env.REACT_APP_JWT_STORAGE_KEY!, accessToken);
    SecurityUtils.setSecureToken(process.env.REACT_APP_REFRESH_TOKEN_KEY!, newRefreshToken);
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.get<BaseResponse<T>>(url, config);
    return response.data;
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.post<BaseResponse<T>>(url, data, config);
    return response.data;
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.put<BaseResponse<T>>(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<BaseResponse<T>> {
    const response = await this.axiosInstance.delete<BaseResponse<T>>(url, config);
    return response.data;
  }

  public setCSRFToken(token: string): void {
    this.csrfToken = token;
  }
}

export const apiService = ApiService.getInstance();
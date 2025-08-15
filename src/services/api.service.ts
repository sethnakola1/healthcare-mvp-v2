import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { SecurityUtils } from '../utils/security.utils';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

class ApiService {
  private axiosInstance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
    
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      withCredentials: true, // Important for HttpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Add CSRF token if available
        const csrfToken = this.getCsrfToken();
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
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
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login
          window.location.href = '/login';
        }
        
        return Promise.reject(this.handleApiError(error));
      }
    );
  }

  private getCsrfToken(): string | null {
    // Extract CSRF token from meta tag or cookie
    const metaToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    return metaToken || null;
  }

  private sanitizeRequestData(data: any): any {
    if (typeof data === 'string') {
      return SecurityUtils.sanitizeInput(data);
    }
    
    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeRequestData(item));
    }
    
    if (typeof data === 'object' && data !== null) {
      const sanitized: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          sanitized[key] = this.sanitizeRequestData(data[key]);
        }
      }
      return sanitized;
    }
    
    return data;
  }

  private handleApiError(error: AxiosError): Error {
    // Don't expose sensitive error details
    if (process.env.REACT_APP_ENVIRONMENT === 'production') {
      return new Error('An error occurred. Please try again.');
    }
    
    return new Error(error.message || 'API request failed');
  }

  // HTTP Methods
  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url);
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(url);
    return response.data;
  }
}

export const apiService = new ApiService();
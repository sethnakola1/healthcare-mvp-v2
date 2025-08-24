import axios, { AxiosResponse } from 'axios';
import { BaseResponse } from '../types/api.types';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: any;
  data: { [x: string]: any; accessToken: any; refreshToken: any; };
  message: string;
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

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
}

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
  createdAt?: string;
}

export interface UserInfo {
  success: any;
  data: User;
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
  createdAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
  timestamp: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    // Add request interceptor to include auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.refreshToken({ refreshToken });
              localStorage.setItem('accessToken', response.data.accessToken);
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.logout();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  async login(email: string, password: string): Promise<AxiosResponse<BaseResponse<LoginResponse>>> {
    const response = await this.api.post<BaseResponse<LoginResponse>>('/auth/login', {
      email,
      password,
    });
    return response;
  }

  async refreshToken(request: RefreshTokenRequest): Promise<AxiosResponse<BaseResponse<LoginResponse>>> {
    const response = await this.api.post<BaseResponse<LoginResponse>>('/auth/refresh', request);
    return response;
  }

  async getCurrentUser(): Promise<AxiosResponse<BaseResponse<User>>> {
    const response = await this.api.get<BaseResponse<User>>('/auth/me');
    return response;
  }

  async logout(): Promise<AxiosResponse<BaseResponse<string>>> {
    try {
      const response = await this.api.post<BaseResponse<string>>('/auth/logout');
      return response;
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<AxiosResponse<BaseResponse<string>>> {
    const response = await this.api.post<BaseResponse<string>>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  }

  async validateToken(): Promise<AxiosResponse<BaseResponse<boolean>>> {
    const response = await this.api.get<BaseResponse<boolean>>('/auth/validate');
    return response;
  }

  // Utility methods
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
        return null;
      }
    }
    return null;
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearAuth(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

export default new AuthService();
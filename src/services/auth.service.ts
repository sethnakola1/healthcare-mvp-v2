// src/services/auth.service.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base API URL - adjust according to your backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Types
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

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp?: string;
}

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  fullName?: string;
  username?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  phoneNumber?: string;
  territory?: string;
  partnerCode?: string;
  lastLogin?: string;
  createdAt?: string;
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

class AuthService {
  private api: AxiosInstance;
  private refreshPromise: Promise<any> | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getStoredRefreshToken();
            if (refreshToken) {
              // Prevent multiple refresh requests
              if (!this.refreshPromise) {
                this.refreshPromise = this.refreshToken({ refreshToken });
              }

              const response = await this.refreshPromise;
              this.refreshPromise = null;

              if (response.success && response.data?.accessToken) {
                this.setStoredToken(response.data.accessToken);
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return this.api(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            this.clearTokens();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Secure token storage methods
  private getStoredToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private setStoredToken(token: string): void {
    localStorage.setItem('accessToken', token);
  }

  private getStoredRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Auth methods
  public async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post(
        '/auth/login',
        credentials
      );

      // Enhanced error handling
      if (response.data.success && response.data.data) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login service error:', error);

      // Handle different error scenarios
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 423) {
        throw new Error('Account is temporarily locked. Please try again later.');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Network error. Please check your connection.');
      }
    }
  }

  public async refreshToken(request: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    try {
      const response: AxiosResponse<ApiResponse<LoginResponse>> = await this.api.post(
        '/auth/refresh',
        request
      );
      return response.data;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  public async register(userData: RegisterRequest): Promise<ApiResponse<any>> {
    try {
      const response: AxiosResponse<ApiResponse<any>> = await this.api.post(
        '/auth/register',
        userData
      );
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }

  public async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/me');
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw new Error(error.response?.data?.message || 'Failed to get user information');
    }
  }

  public async validateToken(): Promise<ApiResponse<boolean>> {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await this.api.get('/auth/validate');
      return response.data;
    } catch (error: any) {
      console.error('Token validation error:', error);
      throw new Error('Token validation failed');
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      this.clearTokens();
    }
  }

  public async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<string>> {
    try {
      const response: AxiosResponse<ApiResponse<string>> = await this.api.post(
        '/auth/change-password',
        { currentPassword, newPassword }
      );
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  }

  // Utility methods
  public isAuthenticated(): boolean {
    return Boolean(this.getStoredToken());
  }

  public getAuthHeader(): string | null {
    const token = this.getStoredToken();
    return token ? `Bearer ${token}` : null;
  }

  // Security utilities
  public isTokenExpired(): boolean {
    const token = this.getStoredToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }
}

export const authService = new AuthService();
export default authService;
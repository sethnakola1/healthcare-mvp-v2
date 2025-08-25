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
  data: any;
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
  errorCode?: string;
  timestamp: string;
  path?: string;
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
        const token = this.getAccessToken();
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
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              // Prevent multiple refresh requests
              if (!this.refreshPromise) {
                this.refreshPromise = this.refreshToken({ refreshToken });
              }

              const response = await this.refreshPromise;
              this.refreshPromise = null;

              if (response.success && response.data?.accessToken) {
                this.setTokens(response.data.accessToken, response.data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
                return this.api(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            this.clearAuth();
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Secure token storage methods
  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  public setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  public clearAuth(): void {
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

      if (response.data.success && response.data.data) {
        const { accessToken, refreshToken } = response.data.data;
        this.setTokens(accessToken, refreshToken);
        // The user object will be fetched and set in the authSlice
      }

      return response.data;
    } catch (error: any) {
      console.error('Login service error:', error);
      this.handleApiError(error);
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
      this.handleApiError(error);
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
      this.handleApiError(error);
    }
  }

  public async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/users/me');
      if(response.data.success && response.data.data){
        this.setUser(response.data.data);
      }
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      this.handleApiError(error);
    }
  }

  public async validateToken(): Promise<ApiResponse<boolean>> {
    try {
      const response: AxiosResponse<ApiResponse<boolean>> = await this.api.get('/auth/validate');
      return response.data;
    } catch (error: any) {
      console.error('Token validation error:', error);
      this.handleApiError(error);
    }
  }

  public async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server logout fails
    } finally {
      this.clearAuth();
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
      this.handleApiError(error);
    }
  }

  // Utility methods
  public isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }

  public getAuthHeader(): string | null {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : null;
  }

  public isTokenExpired(): boolean {
    const token = this.getAccessToken();
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

  private handleApiError(error: any): never {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      if (status === 401) {
        this.clearAuth();
        window.location.href = '/login';
        throw new Error('Unauthorized. Please log in again.');
      }
      if (status === 403) {
        throw new Error('You do not have permission to perform this action.');
      }
      if (status === 423) {
        throw new Error('Account is temporarily locked. Please try again later.');
      }
      if (status >= 500) {
        throw new Error('Server error. Please try again later.');
      }
      throw new Error(data.message || 'An unexpected error occurred.');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(error.message);
    }
  }
}

export const authService = new AuthService();
export default authService;
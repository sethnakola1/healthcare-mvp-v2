// src/services/auth.service.ts
// import axios, { AxiosResponse } from 'axios';
import { LoginCredentials } from '../types';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface LoginResponse {
  user(user: any): string;
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

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
  timestamp: string;
  path?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

class AuthService {
  private readonly API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

  // Login method aligned with backend /api/auth/login
  async login(credentials: LoginCredentials): Promise<BaseResponse<LoginResponse>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data: BaseResponse<LoginResponse> = await response.json();
      if (data.success && data.data) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }

      return data;
    } catch (error) {
      throw new Error((error as Error).message || 'Network error during login');
    }
  }

  // Refresh token method aligned with backend /api/auth/refresh
  async refreshToken(): Promise<BaseResponse<{ accessToken: string; refreshToken: string }>> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      if (data.success && data.data) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
      }

      return data;
    } catch (error) {
      throw new Error((error as Error).message || 'Network error during token refresh');
    }
  }

  // Logout method aligned with backend (clears localStorage, calls /api/auth/logout if exists)
  async logout(): Promise<BaseResponse<string>> {
    const token = localStorage.getItem('accessToken');
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      if (!response.ok) {
        throw new Error('Logout failed on server');
      }

      return await response.json();
    } catch (error) {
      localStorage.clear(); // Force clear on error
      throw new Error((error as Error).message || 'Network error during logout');
    }
  }

  // Get current user from localStorage or backend /api/users/profile
  async getCurrentUser(): Promise<BaseResponse<{ user: any }>> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No token available');
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Try refresh if 401
        if (response.status === 401) {
          await this.refreshToken();
          return this.getCurrentUser(); // Retry
        }
        throw new Error('Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      throw new Error((error as Error).message || 'Network error fetching user');
    }
  }
}

// const authServiceInstance = new AuthService();
// export { authServiceInstance as authService };
// export default authServiceInstance;

export default new AuthService();
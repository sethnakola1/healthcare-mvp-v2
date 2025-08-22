// src/services/auth.service.ts
import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
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
  private readonly baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/auth`;
  }

  async login(credentials: LoginRequest): Promise<BaseResponse<LoginResponse>> {
    try {
      const response: AxiosResponse<BaseResponse<LoginResponse>> = await axios.post(
        `${this.baseURL}/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          success: false,
          message: 'Network error. Please check your connection.',
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  async refreshToken(request: RefreshTokenRequest): Promise<BaseResponse<LoginResponse>> {
    try {
      const response: AxiosResponse<BaseResponse<LoginResponse>> = await axios.post(
        `${this.baseURL}/refresh`,
        request,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          success: false,
          message: 'Token refresh failed',
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  async logout(): Promise<BaseResponse<string>> {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<BaseResponse<string>> = await axios.post(
        `${this.baseURL}/logout`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      // Even if logout fails on server, we should clear local storage
      return {
        success: true,
        message: 'Logged out locally',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async getCurrentUser(): Promise<BaseResponse<any>> {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<BaseResponse<any>> = await axios.get(
        `${this.baseURL}/me`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          success: false,
          message: 'Failed to get user info',
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<BaseResponse<string>> {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<BaseResponse<string>> = await axios.post(
        `${this.baseURL}/change-password`,
        request,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          success: false,
          message: 'Password change failed',
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  async validateToken(): Promise<BaseResponse<boolean>> {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<BaseResponse<boolean>> = await axios.get(
        `${this.baseURL}/validate`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      } else {
        throw {
          success: false,
          message: 'Token validation failed',
          timestamp: new Date().toISOString(),
        };
      }
    }
  }

  // Utility methods
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }
}

const authServiceInstance = new AuthService();
export { authServiceInstance as authService };
export default authServiceInstance;
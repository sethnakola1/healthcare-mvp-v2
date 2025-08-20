import axios, { AxiosResponse } from 'axios';
import { LoginResponse, UserProfile } from '../types/auth.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<BaseResponse<LoginResponse>> = await api.post('/auth/login', credentials);

      if (response.data.success) {
        const loginData = response.data.data;

        // Store tokens
        localStorage.setItem('accessToken', loginData.accessToken);
        localStorage.setItem('refreshToken', loginData.refreshToken);
        localStorage.setItem('userId', loginData.userId);

        return loginData;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  }

  async getCurrentUser(): Promise<UserProfile> {
    try {
      const response: AxiosResponse<BaseResponse<UserProfile>> = await api.get('/auth/me');

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error('Failed to get user profile');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get user profile');
    }
  }

  async refreshToken(refreshTokenRequest: RefreshTokenRequest): Promise<LoginResponse> {
    try {
      const response: AxiosResponse<BaseResponse<LoginResponse>> = await api.post('/auth/refresh', refreshTokenRequest);

      if (response.data.success) {
        const loginData = response.data.data;

        // Update tokens
        localStorage.setItem('accessToken', loginData.accessToken);
        localStorage.setItem('refreshToken', loginData.refreshToken);

        return loginData;
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token refresh failed');
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearClientData();
    }
  }

  clearClientData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}

export default new AuthService();
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

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

  // async put<T>(endpoint: string, data: any): Promise<BaseResponse<T>>
  //  {
  //   try {
  //     const response: AxiosResponse<BaseResponse<T>> = await api.put(endpoint, data);
  //     return response.data;
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || 'Request failed');
  //   }
  // }

  // Generic DELETE method
  async delete<T>(endpoint: string, data?: any): Promise<BaseResponse<T>> {
  try {
    const response: AxiosResponse<BaseResponse<T>> = await api.delete(endpoint, data ? { data } : undefined);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Request failed');
  }
}
  // async delete<T>(endpoint: string): Promise<BaseResponse<T>> {
  //   try {
  //     const response: AxiosResponse<BaseResponse<T>> = await api.delete(endpoint);
  //     return response.data;
  //   } catch (error: any) {
  //     throw new Error(error.response?.data?.message || 'Request failed');
  //   }
  // }

  // Clear client data
  clearClientData(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
  }

  // Check if authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearClientData();
    }
  }
}

// Export single instance
const authService = new AuthService();
export default authService;
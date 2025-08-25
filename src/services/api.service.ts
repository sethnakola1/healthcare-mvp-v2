// src/services/api.service.ts
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  User
} from '../types/auth.types';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: ApiResponse<T>;

  // Get authentication token
  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('auth_token');
    }
    return this.token;
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Generic API call method
  async apiCall<T = any>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    options?: RequestInit
  ): Promise<ApiResponse<T>> {
    try {
      data = await response.json();
    } catch (error) {
      throw new Error('Invalid JSON response from server');
    }

    if (!response.ok) {
      // Backend returns structured error responses
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  }

  async login(loginRequest: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginRequest),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async refreshToken(refreshRequest: RefreshTokenRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(refreshRequest),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<User>(response);
  }

  // PUT request
  async put<T = any>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.apiCall<T>(endpoint, 'PUT', data);
  }

  async logout(): Promise<ApiResponse<string>> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<string>(response);
  }

  async validateToken(): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<boolean>(response);
  }

  // Generic API call method
  async apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    return this.handleResponse<T>(response);
  }
}

export const apiService = new ApiService();
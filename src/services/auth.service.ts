// Auth Service for Healthcare MVP
// Integrates with Spring Boot backend

import { User } from "../types";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

class AuthService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data: ApiResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    if (!data.success) {
      throw new Error(data.error || data.message || 'Operation failed');
    }

    return data.data as T;
  }

  async login(email: string, password: string, credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  async register(userData: RegisterRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(userData),
    });

    return this.handleResponse<any>(response);
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const newRefreshToken = localStorage.getItem('refreshToken');

    if (!newRefreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ newRefreshToken }),
    });

    const newTokens = await this.handleResponse<LoginResponse>(response);

    // Update stored tokens
    localStorage.setItem('accessToken', newTokens.accessToken);
    if (newTokens.refreshToken) {
      localStorage.setItem('refreshToken', newTokens.refreshToken);
    }

    return newTokens;
  }

  async getCurrentUser(token: string): Promise<UserInfo> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    return this.handleResponse<UserInfo>(response);
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (err) {
      console.error('Logout API call failed:', err);
      // Continue with local logout even if API call fails
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const result = await this.handleResponse<boolean>(response);
      return result;
    } catch (err) {
      return false;
    }
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    await this.handleResponse<string>(response);
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    return !!token;
  }

  // Helper method to get stored token
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Helper method to get user role from token (basic decode)
  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.roles?.[0] || null;
    } catch (err) {
      console.error('Failed to decode token:', err);
      return null;
    }
  }
}

export const authService = new AuthService();
export default AuthService;
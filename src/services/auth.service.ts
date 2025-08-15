// src/services/auth.service.ts
import {
  User,
  LoginRequest,
  LoginResponse,
  AuthResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  ChangePasswordRequest,
  ApiError
} from '../types/auth.types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api';

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      credentials: 'include', // Include HTTP-only cookies
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
        ...options.headers,
      },
    };

    const config = { ...defaultOptions, ...options };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.message || `HTTP error! status: ${response.status}`,
          status: response.status,
          code: errorData.code
        };
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error; // Re-throw API errors
      }

      // Network or other errors
      throw {
        message: 'Network error or server unavailable',
        status: 0
      } as ApiError;
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Input validation
      if (!email || !email.includes('@')) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (!password || password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      const loginData: LoginRequest = {
        email: email.trim().toLowerCase(),
        password
      };

      const response = await this.makeRequest<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.message || 'Login failed. Please try again.'
      };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Even if logout fails on backend, we should clear client state
      console.error('Logout error:', error);
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.makeRequest<AuthResponse>('/auth/me');
      return response.user || null;
    } catch (error) {
      const apiError = error as ApiError;

      // If unauthorized, user is not logged in
      if (apiError.status === 401) {
        return null;
      }

      throw error;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResponse> {
    try {
      if (!email || !email.includes('@')) {
        return {
          success: false,
          message: '',
          error: 'Please enter a valid email address'
        };
      }

      const resetData: PasswordResetRequest = {
        email: email.trim().toLowerCase()
      };

      const response = await this.makeRequest<PasswordResetResponse>('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(resetData),
      });

      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        message: '',
        error: apiError.message || 'Failed to send reset email. Please try again.'
      };
    }
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<AuthResponse> {
    try {
      if (!passwordData.currentPassword) {
        throw new Error('Current password is required');
      }

      if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
        throw new Error('New password must be at least 6 characters long');
      }

      return this.makeRequest<AuthResponse>('/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });
    } catch (error) {
      const apiError = error as ApiError;
      throw new Error(apiError.message || 'Failed to change password');
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    return this.makeRequest<AuthResponse>(`/auth/verify-email/${token}`, {
      method: 'POST',
    });
  }

  // Utility method to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();

export { LoginRequest };

import axios, { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// API Base URL - matches your Spring Boot server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// Types for API responses (matching your backend DTOs)
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

export interface BaseResponse<T> {
  success: boolean;
  message: string;
  errorCode?: string;
  data: T;
  error?: string;
  timestamp: string;
  path?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Configure axios defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
          const refreshResponse = await authService.refreshToken(refreshToken);
          if (refreshResponse.success) {
            const newToken = refreshResponse.data.accessToken;
            Cookies.set('access_token', newToken, { expires: 1 });

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

class AuthService {
  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<BaseResponse<LoginResponse>> {
    try {
      const request: LoginRequest = { email, password };
      const response: AxiosResponse<BaseResponse<LoginResponse>> = await apiClient.post('/auth/login', request);
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Register new user
   */
  async register(userData: RegisterRequest): Promise<BaseResponse<any>> {
    try {
      const response: AxiosResponse<BaseResponse<any>> = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<BaseResponse<LoginResponse>> {
    try {
      const request: RefreshTokenRequest = { refreshToken };
      const response: AxiosResponse<BaseResponse<LoginResponse>> = await apiClient.post('/auth/refresh', request);
      return response.data;
    } catch (error: any) {
      console.error('Token refresh error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get current user details
   */
  async getCurrentUser(token?: string): Promise<BaseResponse<any>> {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response: AxiosResponse<BaseResponse<any>> = await apiClient.get('/auth/me', { headers });
      return response.data;
    } catch (error: any) {
      console.error('Get current user error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error: any) {
      console.error('Logout error:', error);
      // Don't throw error for logout failures
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<BaseResponse<string>> {
    try {
      const request = { currentPassword, newPassword };
      const response: AxiosResponse<BaseResponse<string>> = await apiClient.post('/auth/change-password', request);
      return response.data;
    } catch (error: any) {
      console.error('Change password error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate token
   */
  async validateToken(): Promise<BaseResponse<boolean>> {
    try {
      const response: AxiosResponse<BaseResponse<boolean>> = await apiClient.get('/auth/validate');
      return response.data;
    } catch (error: any) {
      console.error('Token validation error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<BaseResponse<string>> {
    try {
      const request = { email };
      const response: AxiosResponse<BaseResponse<string>> = await apiClient.post('/auth/reset-password', request);
      return response.data;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Confirm password reset
   */
  async confirmPasswordReset(token: string, newPassword: string): Promise<BaseResponse<string>> {
    try {
      const request = { token, newPassword };
      const response: AxiosResponse<BaseResponse<string>> = await apiClient.post('/auth/confirm-reset', request);
      return response.data;
    } catch (error: any) {
      console.error('Password reset confirmation error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check email/username availability
   */
  async checkAvailability(email?: string, username?: string): Promise<BaseResponse<any>> {
    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (username) params.append('username', username);

      const response: AxiosResponse<BaseResponse<any>> = await apiClient.get(`/auth/registration/check-availability?${params}`);
      return response.data;
    } catch (error: any) {
      console.error('Availability check error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get available roles for registration
   */
  async getAvailableRoles(): Promise<BaseResponse<any[]>> {
    try {
      const response: AxiosResponse<BaseResponse<any[]>> = await apiClient.get('/auth/registration/roles');
      return response.data;
    } catch (error: any) {
      console.error('Get roles error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors consistently
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Server responded with error status
      const serverError = error.response.data;

      if (serverError && typeof serverError === 'object') {
        return new Error(serverError.message || serverError.error || 'Server error occurred');
      } else {
        return new Error(`Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Network error. Please check your connection and try again.');
    } else {
      // Other error
      return new Error(error.message || 'An unexpected error occurred');
    }
  }

  /**
   * Initialize Super Admin (for initial setup)
   */
  async initializeSuperAdmin(): Promise<BaseResponse<any>> {
    try {
      const response: AxiosResponse<BaseResponse<any>> = await apiClient.post('/business/super-admin/initialize');
      return response.data;
    } catch (error: any) {
      console.error('Initialize super admin error:', error);
      throw this.handleError(error);
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export API client for other services
export { apiClient };

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
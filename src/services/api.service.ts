// src/services/api.service.ts

// Types
export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
  timestamp: string;
  path?: string;
}

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

export interface User {
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

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DashboardData {
  appointments?: any[];
  bills?: any[];
  prescriptions?: any[];
  users?: any[];
  systemMetrics?: { [key: string]: any };
  feedback?: any[];
  notifications?: any[];
}



export interface LoginRequest {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
}

// API Service
class ApiService {
  private static readonly BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  private static getAuthHeaders(token?: string): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const authToken = token || this.getStoredToken();
    if (authToken) {
      headers.append('Authorization', `Bearer ${authToken}`);
    }

    return headers;
  }

  private static getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }

  private static async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format');
    }

    const result: BaseResponse<T> = await response.json();

    if (!response.ok) {
      throw new Error(result.error || result.message || `HTTP ${response.status}`);
    }

    if (!result.success) {
      throw new Error(result.error || result.message || 'Request failed');
    }

    return result.data as T;
  }

  // ========================= AUTH ENDPOINTS =========================

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  static async refreshToken(refreshTokenRequest: RefreshTokenRequest): Promise<LoginResponse> {
    const response = await fetch(`${this.BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(refreshTokenRequest),
    });

    return this.handleResponse<LoginResponse>(response);
  }

  static async getCurrentUser(token?: string): Promise<User> {
    const response = await fetch(`${this.BASE_URL}/auth/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<User>(response);
  }

  static async validateToken(token?: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/validate`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
      });

      const result = await this.handleResponse<boolean>(response);
      return result === true;
    } catch {
      return false;
    }
  }

  static async logout(token?: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      console.warn('Logout request failed, but continuing with client-side logout');
    }
  }

  static async changePassword(request: ChangePasswordRequest, token?: string): Promise<void> {
    const response = await fetch(`${this.BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(request),
    });

    return this.handleResponse<void>(response);
  }

  // ========================= DASHBOARD ENDPOINTS =========================

  static async getDashboard(token?: string): Promise<DashboardData> {
    const response = await fetch(`${this.BASE_URL}/dashboard`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<DashboardData>(response);
  }

  // ========================= USER PROFILE ENDPOINTS =========================

  static async getUserProfile(token?: string): Promise<User> {
    const response = await fetch(`${this.BASE_URL}/users/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    return this.handleResponse<User>(response);
  }

  // ========================= UTILITY METHODS =========================

  static async healthCheck(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/auth/health`, {
        method: 'GET',
        headers: new Headers({ 'Content-Type': 'application/json' }),
      });

      return this.handleResponse<{ status: string }>(response);
    } catch (error) {
      throw new Error('Backend service is unavailable');
    }
  }

  // Error handling helper
  static isAuthError(error: any): boolean {
    return error?.message?.includes('authentication') ||
           error?.message?.includes('unauthorized') ||
           error?.message?.includes('token');
  }

  // Token expiration helper
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}

export default ApiService;
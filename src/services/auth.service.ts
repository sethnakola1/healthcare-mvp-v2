// src/services/auth.service.ts
import { apiService } from './api.service';
// import { SecurityUtils } from '../utils/security';
import {
  LoginRequest,
  LoginResponse,
  User,
  RefreshTokenRequest,
  ChangePasswordRequest
} from '../types/auth.types';
import { SecurityUtils } from '../utils/security.utils';

export class AuthService {
  static login(email: string, password: string) {
    throw new Error('Method not implemented.');
  }
  static getCurrentUser() {
    throw new Error('Method not implemented.');
  }
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    // Sanitize inputs
    const sanitizedCredentials = {
      email: SecurityUtils.sanitizeInput(credentials.email.toLowerCase().trim()),
      password: credentials.password // Don't sanitize password as it might contain special chars
    };

    const response = await apiService.post<LoginResponse>('/auth/login', sanitizedCredentials);

    if (response.success && response.data) {
      // Store tokens securely
      SecurityUtils.setSecureToken(
        process.env.REACT_APP_JWT_STORAGE_KEY!,
        response.data.accessToken
      );
      SecurityUtils.setSecureToken(
        process.env.REACT_APP_REFRESH_TOKEN_KEY!,
        response.data.refreshToken
      );
    }

    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<User>('/auth/me');
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const request: RefreshTokenRequest = { refreshToken };
    const response = await apiService.post<LoginResponse>('/auth/refresh', request);

    if (response.success && response.data) {
      SecurityUtils.setSecureToken(
        process.env.REACT_APP_JWT_STORAGE_KEY!,
        response.data.accessToken
      );
      SecurityUtils.setSecureToken(
        process.env.REACT_APP_REFRESH_TOKEN_KEY!,
        response.data.refreshToken
      );
    }

    return response.data;
  }

  async changePassword(request: ChangePasswordRequest): Promise<void> {
    await apiService.post<string>('/auth/change-password', request);
  }

  async logout(): Promise<void> {
    try {
      await apiService.post<string>('/auth/logout');
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      // Always clear tokens locally
      this.clearTokens();
    }
  }

  async validateToken(): Promise<boolean> {
    try {
      await apiService.get<boolean>('/auth/validate');
      return true;
    } catch {
      return false;
    }
  }

  clearTokens(): void {
    SecurityUtils.removeSecureToken(process.env.REACT_APP_JWT_STORAGE_KEY!);
    SecurityUtils.removeSecureToken(process.env.REACT_APP_REFRESH_TOKEN_KEY!);
  }

  isAuthenticated(): boolean {
    const token = SecurityUtils.getSecureToken(process.env.REACT_APP_JWT_STORAGE_KEY!);
    return token !== null && !SecurityUtils.isTokenExpired(token);
  }

  getStoredToken(): string | null {
    return SecurityUtils.getSecureToken(process.env.REACT_APP_JWT_STORAGE_KEY!);
  }
}

export const authService = AuthService.getInstance();
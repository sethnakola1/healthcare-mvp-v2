import { apiService, ApiResponse } from './api.service';
import { SecurityUtils } from '../utils/security.utils';
import { BusinessRole, UserProfile } from '../types/auth.types';
import { parseBusinessRole, isValidUserProfile } from '../utils/typeGuards';

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

export interface ApiUserProfile {
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
  createdAt: string;
}

class AuthService {
  private readonly LOGIN_ATTEMPT_KEY = 'login_attempts';
  private isGettingCurrentUser = false; // Prevent multiple simultaneous calls

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    // Rate limiting check
    if (!SecurityUtils.checkRateLimit(this.LOGIN_ATTEMPT_KEY, 5, 15 * 60 * 1000)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    // Input validation
    const sanitizedEmail = SecurityUtils.sanitizeInput(credentials.email);
    
    if (!SecurityUtils.validateEmail(sanitizedEmail)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = SecurityUtils.validatePassword(credentials.password);
    if (!passwordValidation.isValid) {
      throw new Error('Invalid password format');
    }

    try {
      const response = await apiService.post<LoginResponse>('/api/auth/login', {
        email: sanitizedEmail,
        password: credentials.password,
      });

      if (response.success) {
        // Reset rate limiting on successful login
        SecurityUtils.resetRateLimit(this.LOGIN_ATTEMPT_KEY);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<ApiResponse<UserProfile>> {
    // Prevent multiple simultaneous calls
    if (this.isGettingCurrentUser) {
      throw new Error('Already getting current user');
    }

    this.isGettingCurrentUser = true;

    try {
      const response = await apiService.get<ApiUserProfile>('/api/auth/me');

      if (response.success && response.data) {
        const userProfile: UserProfile = {
          userId: response.data.userId,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          fullName: response.data.fullName,
          username: response.data.username,
          role: parseBusinessRole(response.data.role),
          roleDisplayName: response.data.roleDisplayName,
          isActive: response.data.isActive,
          emailVerified: response.data.emailVerified,
          phoneNumber: response.data.phoneNumber,
          territory: response.data.territory,
          partnerCode: response.data.partnerCode,
          lastLogin: response.data.lastLogin,
          createdAt: response.data.createdAt,
        };

        if (!isValidUserProfile(userProfile)) {
          throw new Error('Invalid user profile received from server');
        }

        return {
          ...response,
          data: userProfile
        };
      }

      return response as ApiResponse<UserProfile>;
    } catch (error) {
      throw error;
    } finally {
      this.isGettingCurrentUser = false;
    }
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse>> {
    return apiService.post<LoginResponse>('/api/auth/refresh');
  }

  async logout(): Promise<ApiResponse<string>> {
    const response = await apiService.post<string>('/api/auth/logout');
    SecurityUtils.resetRateLimit(this.LOGIN_ATTEMPT_KEY);
    return response;
  }

  async validateToken(): Promise<ApiResponse<boolean>> {
    return apiService.get<boolean>('/api/auth/validate');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<string>> {
    const passwordValidation = SecurityUtils.validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors.join(', '));
    }

    return apiService.post<string>('/api/auth/change-password', {
      currentPassword,
      newPassword,
    });
  }
}

export const authService = new AuthService();
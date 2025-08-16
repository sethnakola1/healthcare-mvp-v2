// src/services/auth.service.ts
import { apiService } from './api.service';
import { LoginRequest, LoginResponse, User } from '../types/auth.types';

class AuthService {
  public async login(email: string, password: string, credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/login', credentials);

      if (response.data.success) {
        const loginData = response.data.data;

        // Store tokens securely
        this.storeAuthData(loginData);

        return loginData;
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Network error or server unavailable');
    }
  }

  public async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  public async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>('/auth/me');

      if (response.data.success) {
        const userData = response.data.data;
        sessionStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else {
        throw new Error(response.data.message || 'Failed to get user data');
      }
    } catch (error: any) {
      this.clearAuthData();
      throw error;
    }
  }

  public async refreshToken(refreshToken: string): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse>('/auth/refresh', { refreshToken });

      if (response.data.success) {
        const loginData = response.data.data;
        this.storeAuthData(loginData);
        return loginData;
      } else {
        throw new Error(response.data.message || 'Token refresh failed');
      }
    } catch (error) {
      this.clearAuthData();
      throw error;
    }
  }

  private storeAuthData(loginData: LoginResponse): void {
    // Use sessionStorage for better security (cleared on tab close)
    sessionStorage.setItem('accessToken', loginData.accessToken);
    sessionStorage.setItem('refreshToken', loginData.refreshToken);

    const user = {
      userId: loginData.userId,
      email: loginData.email,
      firstName: loginData.firstName,
      lastName: loginData.lastName,
      role: loginData.role,
      fullName: `${loginData.firstName} ${loginData.lastName}`,
    };

    sessionStorage.setItem('user', JSON.stringify(user));
  }

  private clearAuthData(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }

  public getStoredToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  public getStoredUser(): User | null {
    const userData = sessionStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  public isAuthenticated(): boolean {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }
}

export const authService = new AuthService();
// src/services/auth.service.ts
import { LoginRequest, LoginResponse, UserProfile, RegistrationRequest } from '../types/auth.types';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// Security headers for all requests
const getSecurityHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
});

// Custom fetch wrapper with security measures
const secureApiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    credentials: 'include', // Include HttpOnly cookies
    headers: {
      ...getSecurityHeaders(),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    // Check for security-related response headers
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      throw new Error('Invalid response type - potential security issue');
    }

    return response;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// API response wrapper with error handling
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
};

export class AuthService {
  // Login with email and password
  static async login(email: string, password: string): Promise<LoginResponse> {
    const loginRequest: LoginRequest = { email, password };

    const response = await secureApiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginRequest),
    });

    const result = await handleApiResponse<{data: LoginResponse}>(response);

    // Validate response structure
    if (!result.data || !result.data.accessToken) {
      throw new Error('Invalid login response format');
    }

    return result.data;
  }

  // Register new user
  static async register(registrationData: RegistrationRequest): Promise<UserProfile> {
    const response = await secureApiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });

    const result = await handleApiResponse<{data: UserProfile}>(response);
    return result.data;
  }

  // Get current user profile
  static async getCurrentUser(): Promise<UserProfile> {
    const response = await secureApiCall('/api/auth/me');
    const result = await handleApiResponse<{data: UserProfile}>(response);
    return result.data;
  }

  // Refresh authentication token
  static async refreshToken(): Promise<LoginResponse> {
    const response = await secureApiCall('/api/auth/refresh', {
      method: 'POST',
    });

    const result = await handleApiResponse<{data: LoginResponse}>(response);
    return result.data;
  }

  // Logout user
  static async logout(): Promise<void> {
    try {
      await secureApiCall('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    }
  }

  // Validate current session
  static async validateSession(): Promise<boolean> {
    try {
      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  // Change password
  static async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await secureApiCall('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    await handleApiResponse(response);
  }

  // Security utility: Clear any remaining client-side data
  static clearClientData(): void {
    // Clear any sessionStorage (if used for non-sensitive data)
    sessionStorage.clear();

    // Clear any localStorage (should not contain sensitive data)
    localStorage.clear();

    // Clear any cached data
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => caches.delete(name));
      });
    }
  }
}
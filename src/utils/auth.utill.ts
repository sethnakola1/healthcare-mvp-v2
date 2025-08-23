// src/utils/auth.util.ts

export interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  loginTime?: string;
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

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
}

// Token management utilities
export const TokenUtils = {
  setToken: (token: string): void => {
    localStorage.setItem('accessToken', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('accessToken');
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem('refreshToken', token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem('refreshToken');
  },

  removeTokens: (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
};

// User management utilities
export const UserUtils = {
  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  removeUser: (): void => {
    localStorage.removeItem('user');
  },

  isAuthenticated: (): boolean => {
    const token = TokenUtils.getToken();
    const user = UserUtils.getUser();

    if (!token || !user) return false;

    return !TokenUtils.isTokenExpired(token);
  }
};

// Role utilities
export const RoleUtils = {
  hasRole: (requiredRole: string): boolean => {
    const user = UserUtils.getUser();
    return user?.role === requiredRole;
  },

  hasAnyRole: (roles: string[]): boolean => {
    const user = UserUtils.getUser();
    return user ? roles.includes(user.role) : false;
  },

  isAdmin: (): boolean => {
    return RoleUtils.hasAnyRole(['SUPER_ADMIN', 'HOSPITAL_ADMIN']);
  },

  isSuperAdmin: (): boolean => {
    return RoleUtils.hasRole('SUPER_ADMIN');
  },

  isMedicalStaff: (): boolean => {
    return RoleUtils.hasAnyRole(['DOCTOR', 'NURSE']);
  }
};

// Display utilities
export const DisplayUtils = {
  getRoleDisplayName: (role: string): string => {
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'Super Admin',
      'HOSPITAL_ADMIN': 'Hospital Admin',
      'TECH_ADVISOR': 'Tech Advisor',
      'DOCTOR': 'Doctor',
      'NURSE': 'Nurse',
      'RECEPTIONIST': 'Receptionist',
      'PATIENT': 'Patient'
    };
    return roleMap[role] || role;
  },

  formatUserName: (user: User | null): string => {
    if (!user) return 'Guest';
    return `${user.firstName} ${user.lastName}`.trim() || user.email;
  },

  getUserInitials: (user: User | null): string => {
    if (!user) return 'G';
    const firstName = user.firstName?.charAt(0).toUpperCase() || '';
    const lastName = user.lastName?.charAt(0).toUpperCase() || '';
    return firstName + lastName || user.email.charAt(0).toUpperCase();
  }
};

// API utilities
export const ApiUtils = {
  getAuthHeaders: (): Record<string, string> => {
    const token = TokenUtils.getToken();
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  },

  handleApiError: (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  }
};

// Validation utilities
export const ValidationUtils = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isValidPassword: (password: string): boolean => {
    return password.length >= 8;
  },

  validateLoginForm: (email: string, password: string): string[] => {
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else if (!ValidationUtils.isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (!password) {
      errors.push('Password is required');
    } else if (!ValidationUtils.isValidPassword(password)) {
      errors.push('Password must be at least 8 characters long');
    }

    return errors;
  }
};

// Navigation utilities based on role
export const NavigationUtils = {
  getDefaultRoute: (role: string): string => {
    const routes: Record<string, string> = {
      'SUPER_ADMIN': '/admin/dashboard',
      'HOSPITAL_ADMIN': '/hospital/dashboard',
      'TECH_ADVISOR': '/advisor/dashboard',
      'DOCTOR': '/doctor/dashboard',
      'NURSE': '/nurse/dashboard',
      'RECEPTIONIST': '/reception/dashboard',
      'PATIENT': '/patient/dashboard'
    };
    return routes[role] || '/dashboard';
  },

  getAvailableRoutes: (role: string): string[] => {
    const routeMap: Record<string, string[]> = {
      'SUPER_ADMIN': ['/admin/dashboard', '/admin/users', '/admin/hospitals', '/admin/analytics'],
      'HOSPITAL_ADMIN': ['/hospital/dashboard', '/hospital/patients', '/hospital/doctors', '/hospital/appointments'],
      'DOCTOR': ['/doctor/dashboard', '/doctor/appointments', '/doctor/patients', '/doctor/prescriptions'],
      'NURSE': ['/nurse/dashboard', '/nurse/patients', '/nurse/appointments'],
      'RECEPTIONIST': ['/reception/dashboard', '/reception/appointments', '/reception/patients'],
      'PATIENT': ['/patient/dashboard', '/patient/appointments', '/patient/medical-records']
    };
    return routeMap[role] || ['/dashboard'];
  }
};

// Export everything as a combined utility object for convenience
export const AuthUtils = {
  ...TokenUtils,
  ...UserUtils,
  ...RoleUtils,
  ...DisplayUtils,
  ...ApiUtils,
  ...ValidationUtils,
  ...NavigationUtils
};
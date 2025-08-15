// src/utils/debug.ts (MISSING FILE - ADD THIS)
// Debug utilities for development environment
export class DebugUtils {
  private static isDebugMode(): boolean {
    return process.env.REACT_APP_ENVIRONMENT === 'development';
  }

  static log(message: string, data?: any): void {
    if (this.isDebugMode()) {
      console.log(`[DEBUG] ${message}`, data || '');
    }
  }

  static logApiCall(method: string, url: string, data?: any): void {
    if (this.isDebugMode()) {
      console.group(`[API] ${method.toUpperCase()} ${url}`);
      if (data) {
        console.log('Request data:', data);
      }
      console.groupEnd();
    }
  }

  static logAuthState(state: any): void {
    if (this.isDebugMode()) {
      console.group('[AUTH] State Update');
      console.log('Authenticated:', state.isAuthenticated);
      console.log('Loading:', state.isLoading);
      console.log('User:', state.user?.firstName, state.user?.role);
      console.log('Error:', state.error);
      console.groupEnd();
    }
  }

  static testBackendConnection = async (): Promise<void> => {
    if (!this.isDebugMode()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/health`);
      if (response.ok) {
        console.log('✅ Backend connection successful');
      } else {
        console.error('❌ Backend connection failed:', response.status);
      }
    } catch (error) {
      console.error('❌ Backend connection error:', error);
    }
  };

  static createTestUser = async (): Promise<void> => {
    if (!this.isDebugMode()) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/debug/fix-super-admin-complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      console.log('🔧 Test user creation result:', result);
    } catch (error) {
      console.error('❌ Failed to create test user:', error);
    }
  };
}

// Make debug utilities available globally in development
if (process.env.REACT_APP_ENVIRONMENT === 'development') {
  (window as any).HealthHorizonDebug = DebugUtils;
}
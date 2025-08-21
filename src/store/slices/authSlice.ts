// src/store/slices/authSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/api.service';
import {
  AuthState,
  LoginRequest,
  LoginResponse,
  UserProfile,
  RefreshTokenRequest,
  ChangePasswordRequest
} from '../../types/auth.types';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  sessionExpiry: null,
};

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      
      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Login failed');
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Failed to get user data');
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user data');
    }
  }
);

export const refreshUserToken = createAsyncThunk(
  'auth/refreshToken',
  async (request: RefreshTokenRequest, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken(request);

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Token refresh failed');
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return true;
    } catch (error: any) {
      // Even if logout fails on server, we should clear local state
      return true;
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  'auth/changePassword',
  async (request: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(request);

      if (!response.data.success) {
        return rejectWithValue(response.data.message || 'Password change failed');
      }

      return response.data.message;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password change failed');
    }
  }
);

export const validateAuthToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.validateToken();

      if (!response.data.success) {
        return rejectWithValue('Token validation failed');
      }

      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Token validation failed');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      state.sessionExpiry = null;
      state.isLoading = false;

      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('sessionExpiry');
    },

    restoreAuthFromStorage: (state) => {
      try {
        const token = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const userStr = localStorage.getItem('user');
        const sessionExpiry = localStorage.getItem('sessionExpiry');

        if (token && userStr && sessionExpiry) {
          const expiryTime = parseInt(sessionExpiry, 10);
          const currentTime = Date.now();

          // Check if token is still valid
          if (currentTime < expiryTime) {
            state.token = token;
            state.refreshToken = refreshToken;
            state.user = JSON.parse(userStr);
            state.isAuthenticated = true;
            state.sessionExpiry = expiryTime;
          } else {
            // Token expired, clear everything
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('sessionExpiry');
          }
        }
      } catch (error) {
        console.error('Error restoring auth from storage:', error);
        // Clear corrupted data
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('sessionExpiry');
      }
    },

    updateSessionExpiry: (state, action: PayloadAction<number>) => {
      state.sessionExpiry = action.payload;
      localStorage.setItem('sessionExpiry', action.payload.toString());
    },
  },

  extraReducers: (builder) => {
    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        // Create user profile from login response
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          role: action.payload.role,
          isActive: true,
          emailVerified: true,
        };

        // Calculate session expiry
        const expiryTime = Date.now() + (action.payload.expiresIn * 1000);
        state.sessionExpiry = expiryTime;

        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.sessionExpiry = null;
        state.error = action.payload as string;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Refresh token
    builder
      .addCase(refreshUserToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshUserToken.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        // Update session expiry
        const expiryTime = Date.now() + (action.payload.expiresIn * 1000);
        state.sessionExpiry = expiryTime;

        state.error = null;
      })
      .addCase(refreshUserToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.sessionExpiry = null;
        state.error = action.payload as string;
      });

    // Logout user
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.sessionExpiry = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if logout fails, clear local state
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.sessionExpiry = null;
        state.error = null;
      });

    // Change password
    builder
      .addCase(changeUserPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changeUserPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Validate token
    builder
      .addCase(validateAuthToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(validateAuthToken.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(validateAuthToken.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.sessionExpiry = null;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearError,
  clearAuth,
  restoreAuthFromStorage,
  updateSessionExpiry
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

// Helper selectors
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectUserFullName = (state: { auth: AuthState }) => {
  const user = state.auth.user;
  return user ? `${user.firstName} ${user.lastName}` : '';
};

// Export reducer
export default authSlice.reducer;
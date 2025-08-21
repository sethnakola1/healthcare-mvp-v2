import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  User } from '../../types/auth.types';
import {apiService, authService } from '../../services/api.service';

export interface AuthState {
  user: User | null;
  users: User[] | null; // Assuming you want to track multiple users
  token: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loading: boolean;
  error: string | null;
  loginAttempts: number;
  lastLoginAttempt: number | null;
  isInitialized: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  users: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  loginAttempts: 0,
  lastLoginAttempt: null,
  isInitialized: false,
  loading: false
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      // Use the authService from api.service.ts
      const loginResponse = await authService.login(credentials);
      const userProfile = await authService.getCurrentUser();
      
      return {
        loginData: loginResponse,
        user: userProfile
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);
// export const loginAsync = createAsyncThunk(
//   'auth/login',
//   async (credentials: LoginRequest, { rejectWithValue }) => {
//     try {
//       const response = await apiService.login(credentials);
//       if (response.success) {
//         return response.data;
//       }
//       return rejectWithValue(response.error || 'Login failed');
//     } catch (error: any) {
//       return rejectWithValue(error.message || 'Login failed');
//     }
//   }
// );

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Failed to get user data');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user data');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiService.logout();
      return;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Logout failed');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.changePassword(currentPassword, newPassword);
      if (response.success) {
        return response.data;
      }
      return rejectWithValue(response.error || 'Password change failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Password change failed');
    }
  }
);

export const initializeAuthAsync = createAsyncThunk(
  'auth/initialize',
  async (_, { dispatch, getState }) => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        // Verify token is still valid by fetching current user
        await dispatch(getCurrentUserAsync()).unwrap();
        return { user, token };
      } catch (error) {
        // Token is invalid, clear storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        throw error;
      }
    }

    return null;
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAuthState: (state) => {
      return {
        ...initialState,
        accessToken: null,
        refreshToken: null,
        isInitialized: true,
      };
    },
    updateTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken?: string }>) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      localStorage.setItem('accessToken', action.payload.accessToken);
      if (action.payload.refreshToken) {
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
    },
    incrementLoginAttempts: (state) => {
      state.loginAttempts += 1;
      state.lastLoginAttempt = Date.now();
    },
    resetLoginAttempts: (state) => {
      state.loginAttempts = 0;
      state.lastLoginAttempt = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize auth
      .addCase(initializeAuthAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.loginData.accessToken;
      state.refreshToken = action.payload.loginData.refreshToken;
      state.error = null;
    })
    .addCase(loginAsync.rejected, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload as string;
    })
      .addCase(initializeAuthAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload) {
          state.user = action.payload.user;
          state.accessToken = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(initializeAuthAsync.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
      })
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;

        // Extract user data from login response
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          fullName: `${action.payload.firstName} ${action.payload.lastName}`,
          username: action.payload.email, // Use email as username fallback
          role: action.payload.role,
          roleDisplayName: action.payload.role.replace('_', ' '),
          isActive: true,
          emailVerified: true,
        };

        state.loginAttempts = 0;
        state.lastLoginAttempt = null;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.error = action.payload as string;
        state.loginAttempts += 1;
        state.lastLoginAttempt = Date.now();
      })
      // Get current user
      .addCase(getCurrentUserAsync.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
          fullName: `${action.payload.firstName} ${action.payload.lastName}`,
        };
        state.isAuthenticated = true;
        localStorage.setItem('user', JSON.stringify(state.user));
      })
      .addCase(getCurrentUserAsync.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      })
      // Logout
      .addCase(logoutAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        return {
          ...initialState,
          isInitialized: true,
        };
      })
      .addCase(logoutAsync.rejected, (state) => {
        // Even if logout fails on server, clear local state
        return {
          ...initialState,
          isInitialized: true,
        };
      })
      // Change password
      .addCase(changePasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const {
  // clearError,
  resetAuthState,
  updateTokens,
  incrementLoginAttempts,
  resetLoginAttempts,
  updateUser,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRole = (state: { auth: AuthState }) => state.auth.user?.role;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;

// Helper selectors
export const selectCanCreateBusinessUser = (state: { auth: AuthState }) => {
  const role = state.auth.user?.role;
  return role === 'SUPER_ADMIN';
};

export const selectCanCreateHospital = (state: { auth: AuthState }) => {
  const role = state.auth.user?.role;
  return role === 'SUPER_ADMIN' || role === 'TECH_ADVISOR';
};

export const selectCanCreateHospitalUser = (state: { auth: AuthState }) => {
  const role = state.auth.user?.role;
  return role === 'HOSPITAL_ADMIN';
};

export const selectCanManagePatients = (state: { auth: AuthState }) => {
  const role = state.auth.user?.role;
  return ['HOSPITAL_ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(role || '');
};

// Rate limiting selector
export const selectIsRateLimited = (state: { auth: AuthState }) => {
  const { loginAttempts, lastLoginAttempt } = state.auth;
  if (loginAttempts >= 5 && lastLoginAttempt) {
    const timeSinceLastAttempt = Date.now() - lastLoginAttempt;
    const lockoutTime = 15 * 60 * 1000; // 15 minutes
    return timeSinceLastAttempt < lockoutTime;
  }
  return false;
};

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;
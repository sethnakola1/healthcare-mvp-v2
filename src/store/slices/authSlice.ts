import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, LoginRequest } from '../../services/auth.service';
import { AuthState, BusinessRole, UserProfile } from '../../types/auth.types';

// Session timeout (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data) {
        // Get full user profile after login
        const profileResponse = await authService.getCurrentUser();
        return profileResponse.data;
      }
      throw new Error(response.error || 'Login failed');
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
      if (response.success) {
        return response.data;
      }
      throw new Error(response.error || 'Failed to get user profile');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user profile');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error: any) {
      // Still logout on client side even if server call fails
      return null;
    }
  }
);

export const validateSession = createAsyncThunk(
  'auth/validateSession',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { auth: AuthState };
      const lastActivity = state.auth.lastActivity;
      const now = Date.now();
      
      // Check session timeout
      if (now - lastActivity > SESSION_TIMEOUT) {
        throw new Error('Session expired');
      }

      const response = await authService.validateToken();
      if (response.success) {
        return response.data;
      }
      throw new Error('Invalid session');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Session validation failed');
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  user: null,
  error: null,
  lastActivity: Date.now(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateActivity: (state) => {
      state.lastActivity = Date.now();
    },
    sessionExpired: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = 'Session expired. Please login again.';
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        // Create a clean user object to avoid immer issues
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          fullName: action.payload.fullName,
          username: action.payload.username,
          role: action.payload.role as BusinessRole,
          roleDisplayName: action.payload.roleDisplayName,
          isActive: action.payload.isActive,
          emailVerified: action.payload.emailVerified,
          phoneNumber: action.payload.phoneNumber,
          territory: action.payload.territory,
          partnerCode: action.payload.partnerCode,
          lastLogin: action.payload.lastLogin,
          createdAt: action.payload.createdAt,
        };
        state.error = null;
        state.lastActivity = Date.now();
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload as string;
      })
      // Get current user
      .addCase(getCurrentUser.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.isAuthenticated = true;
        // Create a clean user object
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          fullName: action.payload.fullName,
          username: action.payload.username,
          role: action.payload.role as BusinessRole,
          roleDisplayName: action.payload.roleDisplayName,
          isActive: action.payload.isActive,
          emailVerified: action.payload.emailVerified,
          phoneNumber: action.payload.phoneNumber,
          territory: action.payload.territory,
          partnerCode: action.payload.partnerCode,
          lastLogin: action.payload.lastLogin,
          createdAt: action.payload.createdAt,
        };
        state.lastActivity = Date.now();
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      // Validate session
      .addCase(validateSession.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.error = 'Session expired';
      });
  },
});

export const { clearError, updateActivity, sessionExpired } = authSlice.actions;
export default authSlice.reducer;
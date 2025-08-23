import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AuthService, { LoginResponse, User, BaseResponse } from '../../services/auth.service';

// Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  token: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
};

// Async thunks
export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await AuthService.login(email, password);

      if (response.data.success && response.data.data) {
        const loginData = response.data.data;

        // Store tokens in localStorage
        AuthService.setTokens(loginData.accessToken, loginData.refreshToken);

        // Get user details
        const userResponse = await AuthService.getCurrentUser();
        if (userResponse.data.success && userResponse.data.data) {
          AuthService.setUser(userResponse.data.data);
        }

        return loginData;
      } else {
        return rejectWithValue(response.data.error || 'Login failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk<
  User,
  void,
  { rejectValue: string }
>(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await AuthService.getCurrentUser();

      if (response.data.success && response.data.data) {
        AuthService.setUser(response.data.data);
        return response.data.data;
      } else {
        return rejectWithValue(response.data.error || 'Failed to get user');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to get user';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
    } catch (error: any) {
      // Even if logout API fails, clear local storage
      console.error('Logout API failed:', error);
    } finally {
      AuthService.clearAuth();
    }
  }
);

export const refreshToken = createAsyncThunk<
  LoginResponse,
  void,
  { rejectValue: string }
>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        return rejectWithValue('No refresh token available');
      }

      const response = await AuthService.refreshToken({ refreshToken });

      if (response.data.success && response.data.data) {
        const loginData = response.data.data;
        AuthService.setTokens(loginData.accessToken, loginData.refreshToken);
        return loginData;
      } else {
        return rejectWithValue(response.data.error || 'Token refresh failed');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Token refresh failed';
      return rejectWithValue(message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      AuthService.setUser(action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.isLoading = false;
      AuthService.clearAuth();
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('accessToken');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          state.user = user;
          state.token = token;
          state.refreshToken = localStorage.getItem('refreshToken');
          state.isAuthenticated = true;
        } catch (error) {
          console.error('Error parsing stored user data:', error);
          AuthService.clearAuth();
        }
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Login failed';
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      });

    // Get current user
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to get user';
        state.isAuthenticated = false;
        state.user = null;
      });

    // Logout
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
        state.isLoading = false;
      });

    // Refresh token
    builder
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Token refresh failed';
        // Don't clear authentication here, let the user try to login again
      });
  },
});

// Export actions
export const { clearError, setUser, clearAuth, initializeAuth } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
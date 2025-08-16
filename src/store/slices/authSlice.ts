// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Mock auth service for now
const mockAuthService = {
  login: async (credentials: { email: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === 'admin@test.com' && credentials.password === 'password123') {
      return {
        accessToken: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        tokenType: 'Bearer',
        expiresIn: 3600,
        userId: '1',
        email: credentials.email,
        firstName: 'Admin',
        lastName: 'User',
        role: 'SUPER_ADMIN',
        loginTime: new Date().toISOString(),
      };
    } else {
      throw new Error('Invalid credentials');
    }
  },

  getCurrentUser: async () => {
    return {
      userId: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      username: 'admin',
      role: 'SUPER_ADMIN',
      roleDisplayName: 'Super Admin',
      isActive: true,
      emailVerified: true,
    };
  },

  validateToken: async () => {
    return {
      userId: '1',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      fullName: 'Admin User',
      username: 'admin',
      role: 'SUPER_ADMIN',
      roleDisplayName: 'Super Admin',
      isActive: true,
      emailVerified: true,
    };
  },

  logout: async () => {
    // Simulate logout
  }
};

interface User {
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
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      return await mockAuthService.login(credentials);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const getCurrentUserAsync = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await mockAuthService.getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user data');
    }
  }
);

export const validateTokenAsync = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue }) => {
    try {
      return await mockAuthService.validateToken();
    } catch (error: any) {
      return rejectWithValue('Token validation failed');
    }
  }
);

export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await mockAuthService.logout();
    } catch (error: any) {
      console.error('Logout error:', error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.user = {
          userId: action.payload.userId,
          email: action.payload.email,
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          fullName: `${action.payload.firstName} ${action.payload.lastName}`,
          username: action.payload.email,
          role: action.payload.role,
          roleDisplayName: action.payload.role,
          isActive: true,
          emailVerified: true,
        };
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Validate token
      .addCase(validateTokenAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(validateTokenAsync.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError, setAuthenticated, clearAuth } = authSlice.actions;
export default authSlice.reducer;
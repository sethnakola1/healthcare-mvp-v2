// src/store/slices/businessSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface BusinessUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  phoneNumber?: string;
  territory: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBusinessUserData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  territory: string;
  role: 'SUPER_ADMIN' | 'TECH_ADVISOR';
}

export interface BusinessState {
  users: BusinessUser[];
  currentUser: BusinessUser | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

// Initial state
const initialState: BusinessState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
  success: null,
};

// Async thunks
export const createBusinessUserAsync = createAsyncThunk(
  'business/createUser',
  async (userData: CreateBusinessUserData, { rejectWithValue }) => {
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/business/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }

      const newUser = await response.json();
      return newUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const fetchBusinessUsersAsync = createAsyncThunk(
  'business/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/business/users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const users = await response.json();
      return users;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const updateBusinessUserAsync = createAsyncThunk(
  'business/updateUser',
  async ({ id, data }: { id: string; data: Partial<BusinessUser> }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/business/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user');
      }

      const updatedUser = await response.json();
      return updatedUser;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

export const deleteBusinessUserAsync = createAsyncThunk(
  'business/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/business/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      return userId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'An unknown error occurred'
      );
    }
  }
);

// Slice
const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentUser: (state, action: PayloadAction<BusinessUser | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create Business User
    builder
      .addCase(createBusinessUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createBusinessUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
        state.success = 'User created successfully';
      })
      .addCase(createBusinessUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Business Users
    builder
      .addCase(fetchBusinessUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessUsersAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchBusinessUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Business User
    builder
      .addCase(updateBusinessUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusinessUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1 && action.payload && typeof action.payload === 'object' && 'id' in action.payload) {
          state.users[index] = action.payload;
        }
        state.success = 'User updated successfully';
      })
      .addCase(updateBusinessUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Business User
    builder
      .addCase(deleteBusinessUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBusinessUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = state.users.filter(user => user.id !== action.payload);
        state.success = 'User deleted successfully';
      })
      .addCase(deleteBusinessUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, setCurrentUser } = businessSlice.actions;
export default businessSlice.reducer;
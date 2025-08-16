import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface BusinessUser {
  businessUserId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  businessRole: string;
  partnerCode?: string;
  commissionPercentage?: number;
  territory?: string;
  targetHospitalsMonthly?: number;
  totalHospitalsBrought?: number;
  totalCommissionEarned?: number;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin?: string;
  createdAt?: string;
  fullName: string;
  roleDisplayName: string;
}

interface BusinessState {
  users: BusinessUser[];
  currentUser: BusinessUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BusinessState = {
  users: [],
  currentUser: null,
  isLoading: false,
  error: null,
};

// Mock service
export const createBusinessUserAsync = createAsyncThunk(
  'business/createUser',
  async (userData: any, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: BusinessUser = {
        businessUserId: Math.random().toString(36),
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        businessRole: userData.role,
        territory: userData.territory,
        isActive: true,
        emailVerified: true,
        fullName: `${userData.firstName} ${userData.lastName}`,
        roleDisplayName: userData.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Tech Advisor',
        createdAt: new Date().toISOString(),
      };

      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create user');
    }
  }
);

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBusinessUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusinessUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users.push(action.payload);
        state.error = null;
      })
      .addCase(createBusinessUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = businessSlice.actions;
export default businessSlice.reducer;
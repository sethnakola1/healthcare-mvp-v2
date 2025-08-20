import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BusinessState, BusinessUser } from '../../types/auth.types';

const initialState: BusinessState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

const businessSlice = createSlice({
  name: 'business',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<BusinessUser[]>) => {
      state.users = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<BusinessUser | null>) => {
      state.currentUser = action.payload;
    },
    addUser: (state, action: PayloadAction<BusinessUser>) => {
      state.users.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setUsers,
  setCurrentUser,
  addUser,
  setLoading,
  setError,
} = businessSlice.actions;

export default businessSlice.reducer;
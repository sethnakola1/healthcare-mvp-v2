// src/store/slices/hospitalSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { hospitalService } from '../../services/hospital.service';
import { Hospital, CreateHospitalRequest } from '../../types/hospital.types';

interface HospitalState {
  hospitals: Hospital[];
  currentHospital: Hospital | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: HospitalState = {
  hospitals: [],
  currentHospital: null,
  isLoading: false,
  error: null,
};

export const createHospitalAsync = createAsyncThunk(
  'hospital/create',
  async ({ hospitalData, createdByBusinessUserId }: {
    hospitalData: CreateHospitalRequest;
    createdByBusinessUserId: string;
  }, { rejectWithValue }) => {
    try {
      return await hospitalService.createHospital(hospitalData, createdByBusinessUserId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create hospital');
    }
  }
);

export const getAllHospitalsAsync = createAsyncThunk(
  'hospital/getAll',
  async (_, { rejectWithValue }) => {
    try {
      return await hospitalService.getAllHospitals();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch hospitals');
    }
  }
);

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createHospitalAsync.fulfilled, (state, action: PayloadAction<Hospital>) => {
        state.hospitals.push(action.payload);
        state.isLoading = false;
      })
      .addCase(getAllHospitalsAsync.fulfilled, (state, action: PayloadAction<Hospital[]>) => {
        state.hospitals = action.payload;
        state.isLoading = false;
      });
  },
});

export const { clearError } = hospitalSlice.actions;
export default hospitalSlice.reducer;
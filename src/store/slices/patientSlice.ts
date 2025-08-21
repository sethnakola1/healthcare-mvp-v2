// src/store/slices/patientSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { patientService } from '../../services/patient.service';
import { Patient, CreatePatientRequest } from '../../types/patient.types';
import { PaginatedResponse } from '../../types/common.types';

interface PatientState {
  patients: Patient[];
  currentPatient: Patient | null;
  paginatedPatients: PaginatedResponse<Patient> | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  patients: [],
  currentPatient: null,
  paginatedPatients: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const registerPatientAsync = createAsyncThunk(
  'patient/register',
  async (patientData: CreatePatientRequest, { rejectWithValue }) => {
    try {
      return await patientService.registerPatient(patientData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to register patient');
    }
  }
);

export const getPatientsByHospitalAsync = createAsyncThunk(
  'patient/getByHospital',
  async ({ hospitalId, page, size, sort }: {
    hospitalId: string;
    page?: number;
    size?: number;
    sort?: string;
  }, { rejectWithValue }) => {
    try {
      return await patientService.getPatientsByHospital(hospitalId, page, size, sort);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patients');
    }
  }
);

export const searchPatientsByHospitalAsync = createAsyncThunk(
  'patient/searchByHospital',
  async ({ hospitalId, searchTerm, page, size }: {
    hospitalId: string;
    searchTerm: string;
    page?: number;
    size?: number;
  }, { rejectWithValue }) => {
    try {
      return await patientService.searchPatientsByHospital(hospitalId, searchTerm, page, size);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search patients');
    }
  }
);

export const getPatientByIdAsync = createAsyncThunk(
  'patient/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await patientService.getPatientById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch patient');
    }
  }
);

export const updatePatientAsync = createAsyncThunk(
  'patient/update',
  async ({ id, patientData }: { id: string; patientData: CreatePatientRequest }, { rejectWithValue }) => {
    try {
      return await patientService.updatePatient(id, patientData);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update patient');
    }
  }
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    clearPatients: (state) => {
      state.patients = [];
      state.paginatedPatients = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register patient
      .addCase(registerPatientAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerPatientAsync.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.isLoading = false;
        state.patients.unshift(action.payload);
        state.error = null;
      })
      .addCase(registerPatientAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get patients by hospital
      .addCase(getPatientsByHospitalAsync.fulfilled, (state, action: PayloadAction<PaginatedResponse<Patient>>) => {
        state.paginatedPatients = action.payload;
        state.patients = action.payload.content;
        state.isLoading = false;
      })
      // Search patients
      .addCase(searchPatientsByHospitalAsync.fulfilled, (state, action: PayloadAction<PaginatedResponse<Patient>>) => {
        state.paginatedPatients = action.payload;
        state.patients = action.payload.content;
        state.isLoading = false;
      })
      // Get patient by ID
      .addCase(getPatientByIdAsync.fulfilled, (state, action: PayloadAction<Patient>) => {
        state.currentPatient = action.payload;
        state.isLoading = false;
      })
      // Update patient
      .addCase(updatePatientAsync.fulfilled, (state, action: PayloadAction<Patient>) => {
        const index = state.patients.findIndex(patient => patient.patientId === action.payload.patientId);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        // Ensure currentPatient is updated with the new data, creating a new object to trigger reactivity
        state.currentPatient = { ...action.payload };
        state.isLoading = false;
      });
  },
});

export const { clearError, clearCurrentPatient, clearPatients } = patientSlice.actions;
export default patientSlice.reducer;
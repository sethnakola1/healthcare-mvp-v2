// src/services/patient.service.ts
import { apiService } from './api.service';
import { PatientDto, CreatePatientRequest } from '../types/patient.types';
import { ApiResponse, PaginatedResponse } from '../types/api.types';

class PatientService {
  // Register new patient
  async registerPatient(request: CreatePatientRequest): Promise<ApiResponse<PatientDto>> {
    const response = await apiService.post<PatientDto>('/api/patients', request);
    return response.data;
  }

  // Get hospital patients with pagination
  async getHospitalPatients(
    hospitalId: string,
    page: number = 0,
    size: number = 20,
    search?: string
  ): Promise<ApiResponse<PaginatedResponse<PatientDto>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (search) {
      params.append('search', search);
    }

    const response = await apiService.get<PaginatedResponse<PatientDto>>(
      `/api/patients/hospital/${hospitalId}?${params.toString()}`
    );
    return response.data;
  }

  // Get patient by ID
  async getPatientById(patientId: string): Promise<ApiResponse<PatientDto>> {
    const response = await apiService.get<PatientDto>(`/api/patients/${patientId}`);
    return response.data;
  }

  // Search patients globally
  async searchPatientsGlobally(searchTerm: string): Promise<ApiResponse<PatientDto[]>> {
    const params = new URLSearchParams({ searchTerm });
    const response = await apiService.get<PatientDto[]>(`/api/patients/search?${params.toString()}`);
    return response.data;
  }

  // Update patient
  async updatePatient(patientId: string, request: CreatePatientRequest): Promise<ApiResponse<PatientDto>> {
    const response = await apiService.put<PatientDto>(`/api/patients/${patientId}`, request);
    return response.data;
  }
}

export const patientService = new PatientService();
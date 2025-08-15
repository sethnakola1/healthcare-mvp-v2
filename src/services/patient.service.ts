// src/services/patient.service.ts
import { apiService } from './api.service';
import { PatientDto, CreatePatientRequest } from '../types/patient.types';
import { ApiResponse, PaginatedResponse } from '../types/api.types';

class PatientService {
  // Register new patient
  async registerPatient(request: CreatePatientRequest): Promise<ApiResponse<PatientDto>> {
    return apiService.post<PatientDto>('/api/patients', request);
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

    return apiService.get<PaginatedResponse<PatientDto>>(
      `/api/patients/hospital/${hospitalId}?${params.toString()}`
    );
  }

  // Get patient by ID
  async getPatientById(patientId: string): Promise<ApiResponse<PatientDto>> {
    return apiService.get<PatientDto>(`/api/patients/${patientId}`);
  }

  // Search patients globally
  async searchPatientsGlobally(searchTerm: string): Promise<ApiResponse<PatientDto[]>> {
    const params = new URLSearchParams({ searchTerm });
    return apiService.get<PatientDto[]>(`/api/patients/search?${params.toString()}`);
  }

  // Update patient
  async updatePatient(patientId: string, request: CreatePatientRequest): Promise<ApiResponse<PatientDto>> {
    return apiService.put<PatientDto>(`/api/patients/${patientId}`, request);
  }
}

export const patientService = new PatientService();
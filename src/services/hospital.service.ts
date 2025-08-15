// src/services/hospital.service.ts
import { apiService } from './api.service';
import { HospitalDto, CreateHospitalRequest } from '../types/hospital.types';
import { ApiResponse } from '../types/api.types';

class HospitalService {
  // Create hospital
  async createHospital(request: CreateHospitalRequest, createdBy: string): Promise<ApiResponse<HospitalDto>> {
    const params = new URLSearchParams({ createdByBusinessUserId: createdBy });
    return apiService.post<HospitalDto>(`/api/hospitals?${params.toString()}`, request);
  }

  // Get all hospitals
  async getAllHospitals(): Promise<ApiResponse<HospitalDto[]>> {
    return apiService.get<HospitalDto[]>('/api/hospitals');
  }

  // Get hospital by ID
  async getHospitalById(hospitalId: string): Promise<ApiResponse<HospitalDto>> {
    return apiService.get<HospitalDto>(`/api/hospitals/${hospitalId}`);
  }

  // Get hospital by code
  async getHospitalByCode(hospitalCode: string): Promise<ApiResponse<HospitalDto>> {
    return apiService.get<HospitalDto>(`/api/hospitals/code/${hospitalCode}`);
  }

  // Update hospital
  async updateHospital(hospitalId: string, request: CreateHospitalRequest): Promise<ApiResponse<HospitalDto>> {
    return apiService.put<HospitalDto>(`/api/hospitals/${hospitalId}`, request);
  }

  // Deactivate hospital
  async deactivateHospital(hospitalId: string): Promise<ApiResponse<string>> {
    return apiService.delete<string>(`/api/hospitals/${hospitalId}`);
  }
}

export const hospitalService = new HospitalService();
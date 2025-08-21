// src/services/doctor.service.ts
import { DoctorDto, CreateDoctorRequest } from '../types/doctor.types';
import { ApiResponse } from '../types/api.types';
import apiService from './api.service';


class DoctorService {
  // Create doctor
  async createDoctor(request: CreateDoctorRequest): Promise<ApiResponse<DoctorDto>> {
    return apiService.post<DoctorDto>('/api/doctors', request);
  }

  // Get hospital doctors
  async getHospitalDoctors(hospitalId: string): Promise<ApiResponse<DoctorDto[]>> {
    return apiService.get<DoctorDto[]>(`/api/doctors/hospital/${hospitalId}`);
  }

  // Get doctor by ID
  async getDoctorById(doctorId: string): Promise<ApiResponse<DoctorDto>> {
    return apiService.get<DoctorDto>(`/api/doctors/${doctorId}`);
  }

  // Get doctor by code
  async getDoctorByCode(doctorCode: string): Promise<ApiResponse<DoctorDto>> {
    return apiService.get<DoctorDto>(`/api/doctors/code/${doctorCode}`);
  }

  // Search doctors
  async searchDoctors(searchTerm: string): Promise<ApiResponse<DoctorDto[]>> {
    const params = new URLSearchParams({ searchTerm });
    return apiService.get<DoctorDto[]>(`/api/doctors/search?${params.toString()}`);
  }

  // Get doctors by specialization
  async getDoctorsBySpecialization(specialization: string): Promise<ApiResponse<DoctorDto[]>> {
    return apiService.get<DoctorDto[]>(`/api/doctors/specialization/${specialization}`);
  }

  // Update doctor
  async updateDoctor(doctorId: string, request: CreateDoctorRequest): Promise<ApiResponse<DoctorDto>> {
    return apiService.put<DoctorDto>(`/api/doctors/${doctorId}`, request);
  }

  // Deactivate doctor
  async deactivateDoctor(doctorId: string): Promise<ApiResponse<string>> {
    return apiService.delete<string>(`/api/doctors/${doctorId}`);
  }
}

export const doctorService = new DoctorService();
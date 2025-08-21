// src/services/doctor.service.ts
import apiService, { ApiResponse } from './api.service';

export interface DoctorDto {
  doctorId: string;
  hospitalId: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  medicalLicenseNumber: string;
  isActive: boolean;
  // Add other properties as needed
}

export interface CreateDoctorRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  specialization: string;
  medicalLicenseNumber: string;
  qualification?: string;
  experienceYears?: number;
  department?: string;
  consultationFee?: number;
  availableDays?: string[];
  availableStartTime?: string;
  availableEndTime?: string;
  dateOfJoining?: string;
  bio?: string;
  languagesSpoken?: string[];
  isTelemedicineEnabled?: boolean;
}

class DoctorService {
  async createDoctor(request: CreateDoctorRequest): Promise<ApiResponse<DoctorDto>> {
    return apiService.post<ApiResponse<DoctorDto>>('/doctors', request);
  }

  async getHospitalDoctors(hospitalId: string): Promise<ApiResponse<DoctorDto[]>> {
    return apiService.get<ApiResponse<DoctorDto[]>>(`/doctors/hospital/${hospitalId}`);
  }

  async getDoctorById(doctorId: string): Promise<ApiResponse<DoctorDto>> {
    return apiService.get<ApiResponse<DoctorDto>>(`/doctors/${doctorId}`);
  }

  async getDoctorByCode(doctorCode: string): Promise<ApiResponse<DoctorDto>> {
    return apiService.get<ApiResponse<DoctorDto>>(`/doctors/code/${doctorCode}`);
  }

  async searchDoctors(searchTerm: string): Promise<ApiResponse<DoctorDto[]>> {
    const params = new URLSearchParams({ searchTerm });
    return apiService.get<ApiResponse<DoctorDto[]>>(`/doctors/search?${params}`);
  }

  async getDoctorsBySpecialization(specialization: string): Promise<ApiResponse<DoctorDto[]>> {
    return apiService.get<ApiResponse<DoctorDto[]>>(`/doctors/specialization/${specialization}`);
  }

  async updateDoctor(doctorId: string, request: CreateDoctorRequest): Promise<ApiResponse<DoctorDto>> {
    return apiService.put<ApiResponse<DoctorDto>>(`/doctors/${doctorId}`, request);
  }

  async deactivateDoctor(doctorId: string): Promise<ApiResponse<string>> {
    return apiService.delete<ApiResponse<string>>(`/doctors/${doctorId}`);
  }
}

const doctorService = new DoctorService();
export default doctorService;
export { doctorService };
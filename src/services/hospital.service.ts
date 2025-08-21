// src/services/hospital.service.ts
import apiService, { ApiResponse } from './api.service';

export interface HospitalDto {
  hospitalId: string;
  hospitalName: string;
  hospitalCode: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  isActive: boolean;
  // Add other properties as needed
}

export interface CreateHospitalRequest {
  hospitalName: string;
  licenseNumber?: string;
  taxId?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  partnerCodeUsed?: string;
  techSupport1Id?: string;
  techSupport2Id?: string;
  subscriptionPlan?: string;
  contractStartDate?: string;
  contractEndDate?: string;
}

class HospitalService {
  async createHospital(request: CreateHospitalRequest, createdByBusinessUserId: string): Promise<ApiResponse<HospitalDto>> {
    const params = new URLSearchParams({ createdByBusinessUserId });
    return apiService.post<ApiResponse<HospitalDto>>(`/hospitals?${params}`, request);
  }

  async getAllHospitals(): Promise<ApiResponse<HospitalDto[]>> {
    return apiService.get<ApiResponse<HospitalDto[]>>('/hospitals');
  }

  async getHospitalsByBusinessUser(partnerCodeUsed: string): Promise<ApiResponse<HospitalDto[]>> {
    return apiService.get<ApiResponse<HospitalDto[]>>(`/hospitals/business-user/${partnerCodeUsed}`);
  }

  async getHospitalById(hospitalId: string): Promise<ApiResponse<HospitalDto>> {
    return apiService.get<ApiResponse<HospitalDto>>(`/hospitals/${hospitalId}`);
  }

  async getHospitalByCode(hospitalCode: string): Promise<ApiResponse<HospitalDto>> {
    return apiService.get<ApiResponse<HospitalDto>>(`/hospitals/code/${hospitalCode}`);
  }

  async updateHospital(hospitalId: string, request: CreateHospitalRequest): Promise<ApiResponse<HospitalDto>> {
    return apiService.put<ApiResponse<HospitalDto>>(`/hospitals/${hospitalId}`, request);
  }

  async deactivateHospital(hospitalId: string): Promise<ApiResponse<string>> {
    return apiService.delete<ApiResponse<string>>(`/hospitals/${hospitalId}`);
  }
}

const hospitalService = new HospitalService();
export default hospitalService;
export { hospitalService };
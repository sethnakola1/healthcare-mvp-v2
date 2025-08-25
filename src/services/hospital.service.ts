// src/services/hospital.service.ts
import axios, { AxiosResponse } from 'axios';
import { BaseResponse } from '../types/api.types';
// import { BaseResponse } from './auth.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

export interface HospitalDto {
  hospitalId: string;
  hospitalName: string;
  hospitalCode: string;
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
  broughtByBusinessUserName?: string;
  broughtByPartnerCode?: string;
  partnerCodeUsed?: string;
  techSupport1Name?: string;
  techSupport2Name?: string;
  subscriptionPlan: string;
  monthlyRevenue?: number;
  commissionRate?: number;
  isActive: boolean;
  contractStartDate?: string;
  contractEndDate?: string;
  createdAt: string;
}

class HospitalService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/hospitals`;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createHospital(
    request: CreateHospitalRequest,
    createdByBusinessUserId: string
  ): Promise<BaseResponse<HospitalDto>> {
    try {
      const params = new URLSearchParams({ createdByBusinessUserId });
      const response: AxiosResponse<BaseResponse<HospitalDto>> = await axios.post(
        `${this.baseURL}?${params.toString()}`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getAllHospitals(): Promise<BaseResponse<HospitalDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<HospitalDto[]>> = await axios.get(
        this.baseURL,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getHospitalsByBusinessUser(partnerCodeUsed: string): Promise<BaseResponse<HospitalDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<HospitalDto[]>> = await axios.get(
        `${this.baseURL}/business-user/${partnerCodeUsed}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getHospitalById(hospitalId: string): Promise<BaseResponse<HospitalDto>> {
    try {
      const response: AxiosResponse<BaseResponse<HospitalDto>> = await axios.get(
        `${this.baseURL}/${hospitalId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getHospitalByCode(hospitalCode: string): Promise<BaseResponse<HospitalDto>> {
    try {
      const response: AxiosResponse<BaseResponse<HospitalDto>> = await axios.get(
        `${this.baseURL}/code/${hospitalCode}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async updateHospital(hospitalId: string, request: CreateHospitalRequest): Promise<BaseResponse<HospitalDto>> {
    try {
      const response: AxiosResponse<BaseResponse<HospitalDto>> = await axios.put(
        `${this.baseURL}/${hospitalId}`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async deactivateHospital(hospitalId: string): Promise<BaseResponse<string>> {
    try {
      const response: AxiosResponse<BaseResponse<string>> = await axios.delete(
        `${this.baseURL}/${hospitalId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async searchHospitals(searchTerm: string): Promise<BaseResponse<HospitalDto[]>> {
    try {
      const params = new URLSearchParams({ searchTerm });
      const response: AxiosResponse<BaseResponse<HospitalDto[]>> = await axios.get(
        `${this.baseURL}/search?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getHospitalsByCity(city: string): Promise<BaseResponse<HospitalDto[]>> {
    try {
      const params = new URLSearchParams({ city });
      const response: AxiosResponse<BaseResponse<HospitalDto[]>> = await axios.get(
        `${this.baseURL}/city?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
  // Update hospital bed availability
  async updateBedAvailability(
    hospitalId: string,
    availableBeds: number
  ): Promise<ApiResponse<{ availableBeds: number; occupancyRate: number }>> {
    return apiService.put<any>(`${this.endpoint}/${hospitalId}/beds`, { availableBeds });
  }

  // Get hospital types
  async getHospitalTypes(): Promise<ApiResponse<string[]>> {
    return apiService.get<string[]>(`${this.endpoint}/types`);
  }
  async getHospitalsByState(state: string): Promise<BaseResponse<HospitalDto[]>> {
    try {
      const params = new URLSearchParams({ state });
      const response: AxiosResponse<BaseResponse<HospitalDto[]>> = await axios.get(
        `${this.baseURL}/state?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

const hospitalServiceInstance = new HospitalService();
export { hospitalServiceInstance as hospitalService };
export default hospitalServiceInstance;
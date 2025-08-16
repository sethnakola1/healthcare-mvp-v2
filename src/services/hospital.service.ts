// src/services/hospital.service.ts
import { apiService } from './api.service';
import { Hospital, CreateHospitalRequest } from '../types/hospital.types';

export class HospitalService {
  private static instance: HospitalService;

  private constructor() {}

  public static getInstance(): HospitalService {
    if (!HospitalService.instance) {
      HospitalService.instance = new HospitalService();
    }
    return HospitalService.instance;
  }

  async createHospital(hospitalData: CreateHospitalRequest, createdByBusinessUserId: string): Promise<Hospital> {
    const response = await apiService.post<Hospital>(
      `/hospitals?createdByBusinessUserId=${createdByBusinessUserId}`,
      hospitalData
    );
    return response.data;
  }

  async getAllHospitals(): Promise<Hospital[]> {
    const response = await apiService.get<Hospital[]>('/hospitals');
    return response.data;
  }

  async getHospitalById(id: string): Promise<Hospital> {
    const response = await apiService.get<Hospital>(`/hospitals/${id}`);
    return response.data;
  }

  async getHospitalByCode(code: string): Promise<Hospital> {
    const response = await apiService.get<Hospital>(`/hospitals/code/${code}`);
    return response.data;
  }

  async getHospitalsByBusinessUser(partnerCode: string): Promise<Hospital[]> {
    const response = await apiService.get<Hospital[]>(`/hospitals/business-user/${partnerCode}`);
    return response.data;
  }

  async updateHospital(id: string, hospitalData: CreateHospitalRequest): Promise<Hospital> {
    const response = await apiService.put<Hospital>(`/hospitals/${id}`, hospitalData);
    return response.data;
  }

  async deactivateHospital(id: string): Promise<void> {
    await apiService.delete<string>(`/hospitals/${id}`);
  }
}

export const hospitalService = HospitalService.getInstance();
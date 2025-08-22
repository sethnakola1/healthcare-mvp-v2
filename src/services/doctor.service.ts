// src/services/doctor.service.ts
import axios, { AxiosResponse } from 'axios';
import { BaseResponse } from './auth.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

export interface DoctorDto {
  doctorId: string;
  hospitalId: string;
  hospitalName: string;
  doctorCode: string;
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
  isActive: boolean;
  dateOfJoining?: string;
  profilePictureUrl?: string;
  bio?: string;
  languagesSpoken?: string[];
  isTelemedicineEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

class DoctorService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/doctors`;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createDoctor(request: CreateDoctorRequest): Promise<BaseResponse<DoctorDto>> {
    try {
      const response: AxiosResponse<BaseResponse<DoctorDto>> = await axios.post(
        this.baseURL,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getHospitalDoctors(hospitalId: string): Promise<BaseResponse<DoctorDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<DoctorDto[]>> = await axios.get(
        `${this.baseURL}/hospital/${hospitalId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getDoctorById(doctorId: string): Promise<BaseResponse<DoctorDto>> {
    try {
      const response: AxiosResponse<BaseResponse<DoctorDto>> = await axios.get(
        `${this.baseURL}/${doctorId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getDoctorByCode(doctorCode: string): Promise<BaseResponse<DoctorDto>> {
    try {
      const response: AxiosResponse<BaseResponse<DoctorDto>> = await axios.get(
        `${this.baseURL}/code/${doctorCode}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async searchDoctors(searchTerm: string): Promise<BaseResponse<DoctorDto[]>> {
    try {
      const params = new URLSearchParams({ searchTerm });
      const response: AxiosResponse<BaseResponse<DoctorDto[]>> = await axios.get(
        `${this.baseURL}/search?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getDoctorsBySpecialization(specialization: string): Promise<BaseResponse<DoctorDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<DoctorDto[]>> = await axios.get(
        `${this.baseURL}/specialization/${specialization}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async updateDoctor(doctorId: string, request: CreateDoctorRequest): Promise<BaseResponse<DoctorDto>> {
    try {
      const response: AxiosResponse<BaseResponse<DoctorDto>> = await axios.put(
        `${this.baseURL}/${doctorId}`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async deactivateDoctor(doctorId: string): Promise<BaseResponse<string>> {
    try {
      const response: AxiosResponse<BaseResponse<string>> = await axios.delete(
        `${this.baseURL}/${doctorId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getDoctorsByDepartment(department: string): Promise<BaseResponse<DoctorDto[]>> {
    try {
      const params = new URLSearchParams({ department });
      const response: AxiosResponse<BaseResponse<DoctorDto[]>> = await axios.get(
        `${this.baseURL}/department?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getTelemedicineDoctors(hospitalId: string): Promise<BaseResponse<DoctorDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<DoctorDto[]>> = await axios.get(
        `${this.baseURL}/hospital/${hospitalId}/telemedicine`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

const doctorServiceInstance = new DoctorService();
export { doctorServiceInstance as doctorService };
export default doctorServiceInstance;
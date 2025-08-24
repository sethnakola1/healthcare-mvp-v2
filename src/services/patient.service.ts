// src/services/patient.service.ts
import axios, { AxiosResponse } from 'axios';
import { BaseResponse } from '../types/api.types';
// import { BaseResponse } from './../auth.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export interface CreatePatientRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodGroup?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  initialSymptoms?: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  fhirPatientId?: string;
  ssnLast4?: string;
}

export interface PatientDto {
  patientId: string;
  hospitalId: string;
  hospitalName: string;
  globalPatientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodGroup?: string;
  contactInfo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  initialSymptoms?: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  fhirPatientId?: string;
  ssnLast4?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  age?: number;
  fullName: string;
}

class PatientService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/patients`;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async registerPatient(request: CreatePatientRequest): Promise<BaseResponse<PatientDto>> {
    try {
      const response: AxiosResponse<BaseResponse<PatientDto>> = await axios.post(
        this.baseURL,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getHospitalPatients(
    hospitalId: string,
    page = 0,
    size = 20,
    search?: string
  ): Promise<BaseResponse<any>> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (search) {
        params.append('search', search);
      }

      const response: AxiosResponse<BaseResponse<any>> = await axios.get(
        `${this.baseURL}/hospital/${hospitalId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getPatientById(patientId: string): Promise<BaseResponse<PatientDto>> {
    try {
      const response: AxiosResponse<BaseResponse<PatientDto>> = await axios.get(
        `${this.baseURL}/${patientId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async searchPatientsGlobally(searchTerm: string): Promise<BaseResponse<PatientDto[]>> {
    try {
      const params = new URLSearchParams({ searchTerm });
      const response: AxiosResponse<BaseResponse<PatientDto[]>> = await axios.get(
        `${this.baseURL}/search?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async updatePatient(patientId: string, request: CreatePatientRequest): Promise<BaseResponse<PatientDto>> {
    try {
      const response: AxiosResponse<BaseResponse<PatientDto>> = await axios.put(
        `${this.baseURL}/${patientId}`,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getPatientByMrn(mrn: string): Promise<BaseResponse<PatientDto[]>> {
    try {
      const params = new URLSearchParams({ mrn });
      const response: AxiosResponse<BaseResponse<PatientDto[]>> = await axios.get(
        `${this.baseURL}/mrn?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getPatientByGlobalId(globalPatientId: string): Promise<BaseResponse<PatientDto>> {
    try {
      const response: AxiosResponse<BaseResponse<PatientDto>> = await axios.get(
        `${this.baseURL}/global/${globalPatientId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

const patientServiceInstance = new PatientService();
export { patientServiceInstance as patientService };
export default patientServiceInstance;
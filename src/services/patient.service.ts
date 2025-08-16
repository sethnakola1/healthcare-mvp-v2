// src/services/patient.service.ts
import { apiService } from './api.service';
import { Patient, CreatePatientRequest } from '../types/patient.types';
import { PaginatedResponse } from '../types/common.types';

export class PatientService {
  private static instance: PatientService;

  private constructor() {}

  public static getInstance(): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService();
    }
    return PatientService.instance;
  }

  async registerPatient(patientData: CreatePatientRequest): Promise<Patient> {
    const response = await apiService.post<Patient>('/patients', patientData);
    return response.data;
  }

  async getPatientsByHospital(
    hospitalId: string,
    page: number = 0,
    size: number = 20,
    sort: string = 'createdAt,desc'
  ): Promise<PaginatedResponse<Patient>> {
    const response = await apiService.get<PaginatedResponse<Patient>>(
      `/patients/hospital/${hospitalId}?page=${page}&size=${size}&sort=${sort}`
    );
    return response.data;
  }

  async searchPatientsByHospital(
    hospitalId: string,
    searchTerm: string,
    page: number = 0,
    size: number = 20
  ): Promise<PaginatedResponse<Patient>> {
    const response = await apiService.get<PaginatedResponse<Patient>>(
      `/patients/hospital/${hospitalId}?search=${encodeURIComponent(searchTerm)}&page=${page}&size=${size}`
    );
    return response.data;
  }

  async getPatientById(id: string): Promise<Patient> {
    const response = await apiService.get<Patient>(`/patients/${id}`);
    return response.data;
  }

  async updatePatient(id: string, patientData: CreatePatientRequest): Promise<Patient> {
    const response = await apiService.put<Patient>(`/patients/${id}`, patientData);
    return response.data;
  }

  async searchPatientsGlobally(searchTerm: string): Promise<Patient[]> {
    const response = await apiService.get<Patient[]>(
      `/patients/search?searchTerm=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  }
}

export const patientService = PatientService.getInstance();
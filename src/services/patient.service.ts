// src/services/patient.service.ts
import apiService, { ApiResponse, PaginatedResponse } from './api.service';

export interface PatientDto {
  patientId: string;
  hospitalId: string;
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
  isActive: boolean;
  // Add other properties as needed
}

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

class PatientService {
  async registerPatient(request: CreatePatientRequest): Promise<ApiResponse<PatientDto>> {
    return apiService.post<ApiResponse<PatientDto>>('/patients', request);
  }

  async getPatientsByHospital(hospitalId: string, page = 0, size = 20, search?: string): Promise<ApiResponse<PaginatedResponse<PatientDto>>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });

    if (search) {
      params.append('search', search);
    }

    return apiService.get<ApiResponse<PaginatedResponse<PatientDto>>>(`/patients/hospital/${hospitalId}?${params}`);
  }

  async getPatientById(patientId: string): Promise<ApiResponse<PatientDto>> {
    return apiService.get<ApiResponse<PatientDto>>(`/patients/${patientId}`);
  }

  async searchPatientsGlobally(searchTerm: string): Promise<ApiResponse<PatientDto[]>> {
    const params = new URLSearchParams({ searchTerm });
    return apiService.get<ApiResponse<PatientDto[]>>(`/patients/search?${params}`);
  }

  async updatePatient(patientId: string, request: CreatePatientRequest): Promise<ApiResponse<PatientDto>> {
    return apiService.put<ApiResponse<PatientDto>>(`/patients/${patientId}`, request);
  }
}

const patientService = new PatientService();
export default patientService;
export { patientService };
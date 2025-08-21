// src/services/appointment.service.ts
import apiService, { ApiResponse } from './api.service';

// Define types
export interface AppointmentDto {
  appointmentId: string;
  hospitalId: string;
  patientId: string;
  doctorId: string;
  appointmentDateTime: string;
  status: string;
  // Add other properties as needed
}

export interface CreateAppointmentRequest {
  hospitalId: string;
  patientId: string;
  doctorId: string;
  appointmentDateTime: string;
  durationMinutes?: number;
  appointmentType?: string;
  chiefComplaint?: string;
  notes?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  isEmergency?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

class AppointmentService {
  async createAppointment(request: CreateAppointmentRequest): Promise<ApiResponse<AppointmentDto>> {
    return apiService.post<ApiResponse<AppointmentDto>>('/appointments', request);
  }

  async getHospitalAppointments(hospitalId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<ApiResponse<AppointmentDto[]>>(`/appointments/hospital/${hospitalId}`);
  }

  async getDoctorAppointments(doctorId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<ApiResponse<AppointmentDto[]>>(`/appointments/doctor/${doctorId}`);
  }

  async getPatientAppointments(patientId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<ApiResponse<AppointmentDto[]>>(`/appointments/patient/${patientId}`);
  }

  async updateAppointmentStatus(appointmentId: string, status: string, reason?: string): Promise<ApiResponse<AppointmentDto>> {
    const params = new URLSearchParams({ status });
    if (reason) params.append('reason', reason);

    return apiService.put<ApiResponse<AppointmentDto>>(`/appointments/${appointmentId}/status?${params}`);
  }

  async cancelAppointment(appointmentId: string, reason: string): Promise<ApiResponse<string>> {
    const params = new URLSearchParams({ reason });
    return apiService.delete<ApiResponse<string>>(`/appointments/${appointmentId}?${params}`);
  }

  async getTodaysPatientAppointments(patientId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<ApiResponse<AppointmentDto[]>>(`/appointments/patient/${patientId}/today`);
  }

  async getTodaysHospitalAppointments(hospitalId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<ApiResponse<AppointmentDto[]>>(`/appointments/hospital/${hospitalId}/today`);
  }

  async getTodaysDoctorAppointments(doctorId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<ApiResponse<AppointmentDto[]>>(`/appointments/doctor/${doctorId}/today`);
  }
}

const appointmentService = new AppointmentService();
export default appointmentService;
export { appointmentService };
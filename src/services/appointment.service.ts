// src/services/appointment.service.ts
// import { apiService } from './api.service';
import { AppointmentDto, CreateAppointmentRequest } from '../types/appointment.types';
import { ApiResponse } from '../types/api.types';
import apiService from './api.service';
// import { apiService } from '.';

class AppointmentService {
  // Book new appointment
  async bookAppointment(request: CreateAppointmentRequest): Promise<ApiResponse<AppointmentDto>> {
    return apiService.post<AppointmentDto>('/api/appointments', request);
  }

  // Get hospital appointments
  async getHospitalAppointments(hospitalId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<AppointmentDto[]>(`/api/appointments/hospital/${hospitalId}`);
  }

  // Get doctor appointments
  async getDoctorAppointments(doctorId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<AppointmentDto[]>(`/api/appointments/doctor/${doctorId}`);
  }

  // Get patient appointments
  async getPatientAppointments(patientId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<AppointmentDto[]>(`/api/appointments/patient/${patientId}`);
  }

  // Get today's appointments for hospital
  async getTodaysHospitalAppointments(hospitalId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<AppointmentDto[]>(`/api/appointments/hospital/${hospitalId}/today`);
  }

  // Get today's appointments for doctor
  async getTodaysDoctorAppointments(doctorId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<AppointmentDto[]>(`/api/appointments/doctor/${doctorId}/today`);
  }

  // Get today's appointments for patient
  async getTodaysPatientAppointments(patientId: string): Promise<ApiResponse<AppointmentDto[]>> {
    return apiService.get<AppointmentDto[]>(`/api/appointments/patient/${patientId}/today`);
  }

  // Update appointment status
  async updateAppointmentStatus(
    appointmentId: string,
    status: string,
    reason?: string
  ): Promise<ApiResponse<AppointmentDto>> {
    const params = new URLSearchParams({ status });
    if (reason) params.append('reason', reason);

    return apiService.put<AppointmentDto>(
      `/api/appointments/${appointmentId}/status?${params.toString()}`
    );
  }

  // Cancel appointment
  async cancelAppointment(appointmentId: string, reason: string): Promise<ApiResponse<string>> {
    const params = new URLSearchParams({ reason });
    return apiService.delete<string>(`/api/appointments/${appointmentId}?${params.toString()}`);
  }
}

export const appointmentService = new AppointmentService();
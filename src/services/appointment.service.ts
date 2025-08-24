// src/services/appointment.service.ts
import axios, { AxiosResponse } from 'axios';
import { BaseResponse } from '../types/api.types';
// import { BaseResponse } from './auth.service';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

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

export interface AppointmentDto {
  appointmentId: string;
  hospitalId: string;
  hospitalName: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  appointmentDateTime: string;
  durationMinutes: number;
  status: string;
  appointmentType: string;
  chiefComplaint?: string;
  notes?: string;
  cancellationReason?: string;
  isVirtual: boolean;
  meetingLink?: string;
  isEmergency: boolean;
  followUpRequired: boolean;
  followUpDate?: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

class AppointmentService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = `${API_BASE_URL}/appointments`;
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async createAppointment(request: CreateAppointmentRequest): Promise<BaseResponse<AppointmentDto>> {
    try {
      const response: AxiosResponse<BaseResponse<AppointmentDto>> = await axios.post(
        this.baseURL,
        request,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getHospitalAppointments(hospitalId: string): Promise<BaseResponse<AppointmentDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<AppointmentDto[]>> = await axios.get(
        `${this.baseURL}/hospital/${hospitalId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getDoctorAppointments(doctorId: string): Promise<BaseResponse<AppointmentDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<AppointmentDto[]>> = await axios.get(
        `${this.baseURL}/doctor/${doctorId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getPatientAppointments(patientId: string): Promise<BaseResponse<AppointmentDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<AppointmentDto[]>> = await axios.get(
        `${this.baseURL}/patient/${patientId}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getTodaysHospitalAppointments(hospitalId: string): Promise<BaseResponse<AppointmentDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<AppointmentDto[]>> = await axios.get(
        `${this.baseURL}/hospital/${hospitalId}/today`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getTodaysDoctorAppointments(doctorId: string): Promise<BaseResponse<AppointmentDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<AppointmentDto[]>> = await axios.get(
        `${this.baseURL}/doctor/${doctorId}/today`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async getTodaysPatientAppointments(patientId: string): Promise<BaseResponse<AppointmentDto[]>> {
    try {
      const response: AxiosResponse<BaseResponse<AppointmentDto[]>> = await axios.get(
        `${this.baseURL}/patient/${patientId}/today`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async updateAppointmentStatus(
    appointmentId: string,
    status: string,
    reason?: string
  ): Promise<BaseResponse<AppointmentDto>> {
    try {
      const params = new URLSearchParams({ status });
      if (reason) params.append('reason', reason);

      const response: AxiosResponse<BaseResponse<AppointmentDto>> = await axios.put(
        `${this.baseURL}/${appointmentId}/status?${params.toString()}`,
        {},
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }

  async cancelAppointment(appointmentId: string, reason: string): Promise<BaseResponse<string>> {
    try {
      const params = new URLSearchParams({ reason });
      const response: AxiosResponse<BaseResponse<string>> = await axios.delete(
        `${this.baseURL}/${appointmentId}?${params.toString()}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  }
}

const appointmentServiceInstance = new AppointmentService();
export { appointmentServiceInstance as appointmentService };
export default appointmentServiceInstance;
// src/types/appointment.types.ts

export interface AppointmentDto {
  appointmentId: string;
  hospitalId: string;
  hospitalName?: string;
  patientId: string;
  patientName?: string;
  patientMrn?: string;
  doctorId: string;
  doctorName?: string;
  doctorSpecialization?: string;

  appointmentDateTime: string;
  durationMinutes: number;
  status: AppointmentStatus;
  appointmentType: AppointmentType;

  chiefComplaint?: string;
  notes?: string;
  cancellationReason?: string;

  isVirtual: boolean;
  meetingLink?: string;

  isEmergency: boolean;
  followUpRequired: boolean;
  followUpDate?: string;

  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
}

export interface CreateAppointmentRequest {
  hospitalId: string;
  patientId: string;
  doctorId: string;
  appointmentDateTime: string;
  durationMinutes?: number;
  appointmentType?: AppointmentType;
  chiefComplaint?: string;
  notes?: string;
  isVirtual?: boolean;
  meetingLink?: string;
  isEmergency?: boolean;
  followUpRequired?: boolean;
  followUpDate?: string;
}

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum AppointmentType {
  CONSULTATION = 'CONSULTATION',
  FOLLOW_UP = 'FOLLOW_UP',
  EMERGENCY = 'EMERGENCY',
  CHECKUP = 'CHECKUP',
  PROCEDURE = 'PROCEDURE',
  SURGERY = 'SURGERY'
}

export interface AppointmentFilters {
  hospitalId?: string;
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  appointmentType?: AppointmentType;
  dateFrom?: string;
  dateTo?: string;
  isVirtual?: boolean;
  isEmergency?: boolean;
}

export default AppointmentDto;
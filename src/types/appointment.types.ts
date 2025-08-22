// src/types/appointment.types.ts

export interface Appointment {
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
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
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

export interface CreateAppointmentData {
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

export interface AppointmentSearchFilters {
  hospitalId?: string;
  patientId?: string;
  doctorId?: string;
  status?: AppointmentStatus;
  appointmentType?: AppointmentType;
  startDate?: string;
  endDate?: string;
  isVirtual?: boolean;
  isEmergency?: boolean;
}

export interface AppointmentSummary {
  totalAppointments: number;
  scheduledAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  todaysAppointments: number;
  upcomingAppointments: number;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointmentId?: string;
}

export interface DoctorSchedule {
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlots: TimeSlot[];
}

// Utility types for appointment forms
export interface AppointmentFormData extends Omit<CreateAppointmentData, 'appointmentDateTime'> {
  appointmentDate: string;
  appointmentTime: string;
}

export interface AppointmentStatusUpdate {
  appointmentId: string;
  status: AppointmentStatus;
  reason?: string;
  updatedBy: string;
}

export interface AppointmentCancellation {
  appointmentId: string;
  reason: string;
  cancelledBy: string;
}

// Response types for API calls
export interface AppointmentResponse {
  success: boolean;
  message: string;
  data?: Appointment;
  error?: string;
}

export interface AppointmentListResponse {
  success: boolean;
  message: string;
  data?: Appointment[];
  error?: string;
}

export interface AppointmentSummaryResponse {
  success: boolean;
  message: string;
  data?: AppointmentSummary;
  error?: string;
}
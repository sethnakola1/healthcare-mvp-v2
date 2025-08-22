// src/types/doctor.types.ts

export interface Doctor {
  doctorId: string;
  hospitalId: string;
  hospitalName?: string;
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

export enum DoctorSpecialization {
  GENERAL_MEDICINE = 'General Medicine',
  CARDIOLOGY = 'Cardiology',
  DERMATOLOGY = 'Dermatology',
  ENDOCRINOLOGY = 'Endocrinology',
  GASTROENTEROLOGY = 'Gastroenterology',
  NEUROLOGY = 'Neurology',
  ONCOLOGY = 'Oncology',
  ORTHOPEDICS = 'Orthopedics',
  PEDIATRICS = 'Pediatrics',
  PSYCHIATRY = 'Psychiatry',
  PULMONOLOGY = 'Pulmonology',
  RADIOLOGY = 'Radiology',
  SURGERY = 'Surgery',
  GYNECOLOGY = 'Gynecology',
  OPHTHALMOLOGY = 'Ophthalmology',
  ENT = 'ENT',
  UROLOGY = 'Urology',
  ANESTHESIOLOGY = 'Anesthesiology',
  PATHOLOGY = 'Pathology',
  EMERGENCY_MEDICINE = 'Emergency Medicine'
}

export enum DoctorDepartment {
  EMERGENCY = 'Emergency',
  ICU = 'ICU',
  CARDIOLOGY = 'Cardiology',
  NEUROLOGY = 'Neurology',
  ORTHOPEDICS = 'Orthopedics',
  PEDIATRICS = 'Pediatrics',
  MATERNITY = 'Maternity',
  SURGERY = 'Surgery',
  RADIOLOGY = 'Radiology',
  LABORATORY = 'Laboratory',
  PHARMACY = 'Pharmacy',
  OUTPATIENT = 'Outpatient',
  INPATIENT = 'Inpatient'
}

export interface CreateDoctorData {
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

export interface DoctorSearchFilters {
  hospitalId?: string;
  specialization?: string;
  department?: string;
  isTelemedicineEnabled?: boolean;
  experienceRange?: {
    min: number;
    max: number;
  };
  consultationFeeRange?: {
    min: number;
    max: number;
  };
  availableDay?: string;
  languageSpoken?: string;
  isActive?: boolean;
}

export interface DoctorAvailability {
  doctorId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxAppointments?: number;
  currentAppointments?: number;
}

export interface DoctorSchedule {
  doctorId: string;
  date: string;
  timeSlots: DoctorTimeSlot[];
  isHoliday: boolean;
  specialNotes?: string;
}

export interface DoctorTimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isBooked: boolean;
  appointmentId?: string;
  patientName?: string;
  appointmentType?: string;
}

export interface DoctorStats {
  totalPatients: number;
  todaysAppointments: number;
  completedAppointments: number;
  pendingAppointments: number;
  monthlyRevenue: number;
  averageRating: number;
  totalReviews: number;
  telemedicineAppointments: number;
}

export interface DoctorPerformanceMetrics {
  doctorId: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageConsultationTime: number;
  patientSatisfactionScore: number;
  revenue: number;
  monthlyTargets: {
    appointments: number;
    revenue: number;
  };
}

// Form data interfaces
export interface DoctorRegistrationForm extends CreateDoctorData {
  confirmEmail?: string;
  acceptTerms: boolean;
  profilePicture?: File;
  credentials?: File[];
}

export interface DoctorUpdateForm extends Partial<CreateDoctorData> {
  doctorId: string;
}

// Search and pagination
export interface DoctorSearchRequest {
  searchTerm?: string;
  filters?: DoctorSearchFilters;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface DoctorSearchResponse {
  content: Doctor[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// API Response types
export interface DoctorResponse {
  success: boolean;
  message: string;
  data?: Doctor;
  error?: string;
}

export interface DoctorListResponse {
  success: boolean;
  message: string;
  data?: Doctor[];
  error?: string;
}

export interface DoctorStatsResponse {
  success: boolean;
  message: string;
  data?: DoctorStats;
  error?: string;
}
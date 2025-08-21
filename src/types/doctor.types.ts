// src/types/doctor.types.ts
export interface DoctorDto {
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
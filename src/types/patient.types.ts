// src/types/patient.types.ts
export interface PatientDto {
  // Basic Information
  patientId: string;
  hospitalId: string;
  hospitalName: string;
  globalPatientId: string;
  mrn: string;

  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: PatientGender;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodGroup?: string;

  // Contact Information
  contactInfo?: string;

  // Emergency Contact
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;

  // Medical Information
  initialSymptoms?: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;

  // External Integration
  fhirPatientId?: string;

  // Security
  ssnLast4?: string;
  isEncrypted: boolean;
  encryptionKeyId?: string;

  // Status & Audit
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;

  // Computed Properties
  age?: number;
  fullName: string;
}

export interface CreatePatientRequest {
  hospitalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: PatientGender;
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

export enum PatientGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}
// src/types/patient.types.ts
export interface PatientDto {
  patientId: string;
  hospitalId: string;
  hospitalName?: string;
  globalPatientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodGroup?: string;
  contactInfo?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  initialSymptoms?: string;
  allergies?: string;
  currentMedications?: string;
  chronicConditions?: string;
  fhirPatientId?: string;
  ssnLast4?: string;
  isEncrypted: boolean;
  encryptionKeyId?: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  age?: number;
  fullName?: string;
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

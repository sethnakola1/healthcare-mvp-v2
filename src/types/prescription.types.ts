// src/types/prescription.types.ts
export interface PrescriptionDto {
  prescriptionId: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentId?: string;
  medicalRecordId?: string;
  prescriptionDate: string;
  prescriptionNumber: string;
  medications: string;
  generalInstructions?: string;
  dietaryInstructions?: string;
  followUpDate?: string;
  pdfGenerated: boolean;
  pdfFilePath?: string;
  pdfGeneratedAt?: string;
  status: string;
  dosage?: string;
  fhirResourceId?: string;
  isActive: boolean;
  medication: string;
  createdAt: string;
  createdBy?: string;
  updatedAt: string;

  // Populated fields
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
  };
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    specialization: string;
    licenseNumber: string;
  };
}

export interface PrescriptionMedication {
  id: string;
  medicationName: string;
  genericName?: string;
  strength: string;
  dosageForm: DosageForm;
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  cost: number;
  isGenericAllowed: boolean;
  drugInteractions?: string[];
  sideEffects?: string[];
}

export type DosageForm =
  | 'tablet'
  | 'capsule'
  | 'syrup'
  | 'injection'
  | 'cream'
  | 'ointment'
  | 'drops'
  | 'inhaler'
  | 'patch';

export type PrescriptionStatus =
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'expired'
  | 'partially-filled';

export interface CreatePrescriptionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  hospitalId: string;
  appointmentId?: string;
  medicalRecordId?: string;
  medications: Omit<PrescriptionMedication, 'id'>[];
  instructions: string;
  validUntil: string;
  refillsAllowed: number;
}

export interface UpdatePrescriptionRequest {
  id: string;
  status?: PrescriptionStatus;
  refillsUsed?: number;
  pharmacy?: {
    name: string;
    address: string;
    phone: string;
  };
}

export interface PrescriptionSearchParams {
  patientId?: string;
  doctorId?: string;
  hospitalId?: string;
  status?: PrescriptionStatus;
  dateFrom?: string;
  dateTo?: string;
  medicationName?: string;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'createdAt' | 'validUntil';
  sortOrder?: 'asc' | 'desc';
}
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
  updatedBy?: string;
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medications: MedicationDto[];
  instructions?: string;
  issueDate: string;
  expiryDate: string;
}

export interface MedicationDto {
  name: string;
  dosage: string;
  frequency: string;
  durationDays: number;
  route: string;
}
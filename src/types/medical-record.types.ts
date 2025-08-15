// src/types/medical-record.types.ts
export interface MedicalRecordDto {
  medicalRecordId: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  hospitalId: string;
  hospitalName: string;
  appointmentId?: string;
  recordDate: string;

  // Medical Assessment
  chiefComplaint: string;
  presentIllness?: string;
  physicalExamination?: string;
  diagnosis?: string;
  differentialDiagnosis?: string;
  treatmentPlan?: string;
  followUpInstructions?: string;

  // Vitals
  vitalSigns?: string; // JSON string

  // Doctor's Notes
  doctorNotes?: string;
  recommendations?: string;

  // Audit
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordRequest {
  patientId: string;
  hospitalId: string;
  appointmentId?: string;
  chiefComplaint: string;
  presentIllness?: string;
  physicalExamination?: string;
  diagnosis?: string;
  differentialDiagnosis?: string;
  treatmentPlan?: string;
  followUpInstructions?: string;
  vitalSigns?: string;
  doctorNotes?: string;
  recommendations?: string;
}
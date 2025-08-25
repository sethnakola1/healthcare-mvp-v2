// src/types/medical-record.types.ts
export interface MedicalRecordDto {
  medicalRecordId: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  hospitalId: string;
  hospitalName?: string;
  appointmentId?: string;
  recordDate: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface VitalSigns {
  temperature: number; // Celsius
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  heartRate: number; // BPM
  respiratoryRate: number; // per minute
  oxygenSaturation: number; // percentage
  weight: number; // kg
  height: number; // cm
  bmi?: number;
}

export interface Investigation {
  id: string;
  type: 'lab' | 'imaging' | 'diagnostic';
  name: string;
  result?: string;
  normalRange?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  orderedDate: string;
  completedDate?: string;
  reportUrl?: string;
  notes?: string;
}

export interface PrescribedMedication {
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
}

export interface MedicalAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: string;
  description?: string;
}

export interface CreateMedicalRecordRequest {
  patientId: string;
  doctorId: string;
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

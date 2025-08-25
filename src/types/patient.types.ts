// src/types/patient.types.ts

export interface Patient {
  patientId: string;
  hospitalId: string;
  hospitalName?: string;
  globalPatientId: string;
  mrn: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: Gender;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodGroup?: BloodGroup;
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
  isEncrypted?: boolean;
  encryptionKeyId?: string;
  isActive: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  version?: number;
  age?: number;
  fullName: string;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum BloodGroup {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-'
}

export interface CreatePatientData {
  hospitalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender?: Gender;
  email?: string;
  phoneNumber?: string;
  address?: string;
  bloodGroup?: BloodGroup;
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

export interface PatientSearchFilters {
  hospitalId?: string;
  searchTerm?: string;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  ageRange?: {
    min: number;
    max: number;
  };
  city?: string;
  state?: string;
  hasAllergies?: boolean;
  hasChronicConditions?: boolean;
  isActive?: boolean;
}

export interface PatientSummary {
  totalPatients: number;
  activePatients: number;
  newPatientsThisMonth: number;
  malePatients: number;
  femalePatients: number;
  averageAge: number;
  patientsWithAllergies: number;
  patientsWithChronicConditions: number;
}

export interface PatientContact {
  type: 'primary' | 'emergency';
  name?: string;
  phone?: string;
  email?: string;
  relationship?: string;
  address?: string;
}

export interface PatientMedicalInfo {
  allergies: string[];
  currentMedications: string[];
  chronicConditions: string[];
  bloodGroup?: BloodGroup;
  emergencyContact?: PatientContact;
  insuranceInfo?: PatientInsurance;
}

export interface PatientInsurance {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  subscriberId: string;
  subscriberName: string;
  relationship: string;
  effectiveDate: string;
  expirationDate?: string;
}

// Form data interfaces
export interface PatientRegistrationForm extends CreatePatientData {
  confirmEmail?: string;
  acceptTerms: boolean;
  emergencyContacts?: PatientContact[];
  insuranceInfo?: PatientInsurance;
}

export interface PatientUpdateForm extends Partial<CreatePatientData> {
  patientId: string;
}

// Search and pagination
export interface PatientSearchRequest {
  searchTerm?: string;
  filters?: PatientSearchFilters;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PatientSearchResponse {
  content: Patient[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Demographics and statistics
export interface PatientDemographics {
  ageGroups: {
    '0-18': number;
    '19-35': number;
    '36-50': number;
    '51-65': number;
    '65+': number;
  };
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
  bloodGroupDistribution: Record<BloodGroup, number>;
  topCities: Array<{ city: string; count: number }>;
  topStates: Array<{ state: string; count: number }>;
}

// API Response types
export interface PatientResponse {
  success: boolean;
  message: string;
  data?: Patient;
  error?: string;
}

export interface PatientListResponse {
  success: boolean;
  message: string;
  data?: Patient[];
  error?: string;
}

export interface PatientSummaryResponse {
  success: boolean;
  message: string;
  data?: PatientSummary;
  error?: string;
}
// src/types/hospital.types.ts
export interface HospitalDto {
  hospitalId: string;
  hospitalName: string;
  hospitalCode: string;
  licenseNumber?: string;
  taxId?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  broughtByBusinessUserName?: string;
  broughtByPartnerCode?: string;
  partnerCodeUsed?: string;
  techSupport1Name?: string;
  techSupport2Name?: string;
  subscriptionPlan: string;
  monthlyRevenue?: number;
  commissionRate?: number;
  isActive: boolean;
  contractStartDate?: string;
  contractEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type HospitalType =
  | 'general'
  | 'specialty'
  | 'emergency'
  | 'rehabilitation'
  | 'mental-health'
  | 'pediatric'
  | 'maternity';

export interface Department {
  id: string;
  name: string;
  description?: string;
  headDoctorId?: string;
  doctorCount: number;
  isActive: boolean;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // HH:mm format
  closeTime?: string; // HH:mm format
  breaks?: {
    startTime: string;
    endTime: string;
  }[];
}

export interface CreateHospitalRequest {
  hospitalName: string;
  licenseNumber?: string;
  taxId?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  partnerCodeUsed?: string;
  techSupport1Id?: string;
  techSupport2Id?: string;
  subscriptionPlan?: string;
  contractStartDate?: string;
  contractEndDate?: string;
}

export interface HospitalSearchParams {
  query?: string;
  type?: HospitalType;
  city?: string;
  state?: string;
  emergencyServices?: boolean;
  minRating?: number;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface HospitalStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  occupancyRate: number;
  revenue: number;
  averageRating: number;
}
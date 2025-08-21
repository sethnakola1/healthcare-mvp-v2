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

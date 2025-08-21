// src/types/billing.types.ts
export interface BillingDto {
  billingId: string;
  billNumber: string;
  patientId: string;
  patientName?: string;
  hospitalId: string;
  hospitalName?: string;
  appointmentId?: string;
  billDate: string;
  consultationFee: number;
  testCharges: number;
  procedureCharges: number;
  medicationCharges: number;
  otherCharges: number;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod?: string;
  insuranceProvider?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBillRequest {
  patientId: string;
  hospitalId: string;
  appointmentId?: string;
  consultationFee?: number;
  testCharges?: number;
  procedureCharges?: number;
  medicationCharges?: number;
  otherCharges?: number;
  taxPercentage?: number;
  discountPercentage?: number;
  paymentMethod?: string;
  insuranceProvider?: string;
  insuranceClaimNumber?: string;
  insuranceApprovedAmount?: number;
  notes?: string;
}
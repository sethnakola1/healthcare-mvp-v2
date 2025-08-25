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

  // Populated fields
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  hospital?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface BillItem {
  id: string;
  description: string;
  type: BillItemType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  discountPercent: number;
  taxPercent: number;
}

export type BillItemType =
  | 'consultation'
  | 'procedure'
  | 'medication'
  | 'diagnostic'
  | 'room-charges'
  | 'equipment'
  | 'other';

export type BillStatus =
  | 'draft'
  | 'sent'
  | 'paid'
  | 'partially-paid'
  | 'overdue'
  | 'cancelled';

export type PaymentMethod =
  | 'cash'
  | 'card'
  | 'upi'
  | 'net-banking'
  | 'insurance'
  | 'emi';

export interface InsuranceClaim {
  id: string;
  provider: string;
  policyNumber: string;
  claimNumber: string;
  claimedAmount: number;
  approvedAmount: number;
  status: InsuranceClaimStatus;
  submittedDate: string;
  approvedDate?: string;
  rejectionReason?: string;
}

export type InsuranceClaimStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'partially-approved';

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

export interface PaymentRequest {
  billId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId?: string;
}

export interface BillSearchParams {
  patientId?: string;
  hospitalId?: string;
  status?: BillStatus;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'totalAmount' | 'dueDate';
  sortOrder?: 'asc' | 'desc';
}
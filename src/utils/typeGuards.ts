// src/utils/typeGuards.ts

import { Patient } from '../types/patient.types';
import { Doctor } from '../types/doctor.types';
import { Hospital } from '../types/hospital.types';
import { Appointment, AppointmentStatus, AppointmentType } from '../types/appointment.types';
import { Bill, BillStatus } from '../types/billing.types';
import { Prescription, PrescriptionStatus } from '../types/prescription.types';

// Patient type guards
export const isPatient = (obj: any): obj is Patient => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.phone === 'string' &&
    typeof obj.dateOfBirth === 'string' &&
    ['male', 'female', 'other'].includes(obj.gender) &&
    obj.address &&
    typeof obj.address.street === 'string' &&
    obj.emergencyContact &&
    typeof obj.emergencyContact.name === 'string' &&
    Array.isArray(obj.allergies) &&
    Array.isArray(obj.medicalHistory);
};

// Doctor type guards
export const isDoctor = (obj: any): obj is Doctor => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.specialization === 'string' &&
    typeof obj.licenseNumber === 'string' &&
    typeof obj.experience === 'number' &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.consultationFee === 'number' &&
    Array.isArray(obj.qualifications) &&
    Array.isArray(obj.availableSlots);
};

// Hospital type guards
export const isHospital = (obj: any): obj is Hospital => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    obj.address &&
    typeof obj.address.street === 'string' &&
    typeof obj.phone === 'string' &&
    typeof obj.email === 'string' &&
    Array.isArray(obj.departments) &&
    Array.isArray(obj.facilities) &&
    obj.operatingHours &&
    typeof obj.totalBeds === 'number';
};

// Appointment type guards
export const isAppointment = (obj: any): obj is Appointment => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.patientId === 'string' &&
    typeof obj.doctorId === 'string' &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.appointmentDate === 'string' &&
    typeof obj.startTime === 'string' &&
    typeof obj.endTime === 'string' &&
    isAppointmentStatus(obj.status) &&
    isAppointmentType(obj.type) &&
    typeof obj.reason === 'string' &&
    typeof obj.consultationFee === 'number';
};

export const isAppointmentStatus = (status: any): status is AppointmentStatus => {
  return ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'].includes(status);
};

export const isAppointmentType = (type: any): type is AppointmentType => {
  return ['consultation', 'follow-up', 'emergency', 'routine-checkup', 'diagnostic', 'procedure'].includes(type);
};

// Bill type guards
export const isBill = (obj: any): obj is Bill => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.billNumber === 'string' &&
    typeof obj.patientId === 'string' &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.date === 'string' &&
    Array.isArray(obj.items) &&
    typeof obj.totalAmount === 'number' &&
    isBillStatus(obj.status);
};

export const isBillStatus = (status: any): status is BillStatus => {
  return ['draft', 'sent', 'paid', 'partially-paid', 'overdue', 'cancelled'].includes(status);
};

// Prescription type guards
export const isPrescription = (obj: any): obj is Prescription => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.patientId === 'string' &&
    typeof obj.doctorId === 'string' &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.prescriptionNumber === 'string' &&
    typeof obj.date === 'string' &&
    Array.isArray(obj.medications) &&
    isPrescriptionStatus(obj.status);
};

export const isPrescriptionStatus = (status: any): status is PrescriptionStatus => {
  return ['active', 'completed', 'cancelled', 'expired', 'partially-filled'].includes(status);
};

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

export const isValidDate = (date: string): boolean => {
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

export const isValidTime = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Array type guards
export const isPatientArray = (arr: any[]): arr is Patient[] => {
  return Array.isArray(arr) && arr.every(isPatient);
};

export const isDoctorArray = (arr: any[]): arr is Doctor[] => {
  return Array.isArray(arr) && arr.every(isDoctor);
};

export const isHospitalArray = (arr: any[]): arr is Hospital[] => {
  return Array.isArray(arr) && arr.every(isHospital);
};

export const isAppointmentArray = (arr: any[]): arr is Appointment[] => {
  return Array.isArray(arr) && arr.every(isAppointment);
};

// Utility functions for data validation
export const validatePatientData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.firstName || typeof data.firstName !== 'string') {
    errors.push('First name is required');
  }

  if (!data.lastName || typeof data.lastName !== 'string') {
    errors.push('Last name is required');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('Valid phone number is required');
  }

  if (!data.dateOfBirth || !isValidDate(data.dateOfBirth)) {
    errors.push('Valid date of birth is required');
  }

  if (!data.gender || !['male', 'female', 'other'].includes(data.gender)) {
    errors.push('Valid gender is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAppointmentData = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.patientId || typeof data.patientId !== 'string') {
    errors.push('Patient ID is required');
  }

  if (!data.doctorId || typeof data.doctorId !== 'string') {
    errors.push('Doctor ID is required');
  }

  if (!data.appointmentDate || !isValidDate(data.appointmentDate)) {
    errors.push('Valid appointment date is required');
  }

  if (!data.startTime || !isValidTime(data.startTime)) {
    errors.push('Valid start time is required');
  }

  if (!data.endTime || !isValidTime(data.endTime)) {
    errors.push('Valid end time is required');
  }

  if (!data.reason || typeof data.reason !== 'string') {
    errors.push('Appointment reason is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
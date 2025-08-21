// src/utils/typeGuards.ts

import { ApiResponse, ErrorResponse, User } from '../types/api.types';
import { AppointmentDto } from '../types/appointment.types';
import { DoctorDto } from '../types/doctor.types';
import { HospitalDto } from '../types/hospital.types';
import { PatientDto } from '../types/patient.types';

/**
 * Type guard utilities for runtime type checking
 */

export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.success === 'boolean' &&
    typeof obj.message === 'string' &&
    typeof obj.timestamp === 'string'
  );
}

export function isErrorResponse(obj: any): obj is ErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    obj.success === false &&
    typeof obj.errorCode === 'string' &&
    typeof obj.message === 'string'
  );
}

export function isUser(obj: any): obj is User {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.role === 'string'
  );
}

export function isAppointmentDto(obj: any): obj is AppointmentDto {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.appointmentId === 'string' &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.patientId === 'string' &&
    typeof obj.doctorId === 'string'
  );
}

export function isDoctorDto(obj: any): obj is DoctorDto {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.doctorId === 'string' &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string' &&
    typeof obj.email === 'string'
  );
}

export function isHospitalDto(obj: any): obj is HospitalDto {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.hospitalName === 'string' &&
    typeof obj.hospitalCode === 'string'
  );
}

export function isPatientDto(obj: any): obj is PatientDto {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.patientId === 'string' &&
    typeof obj.hospitalId === 'string' &&
    typeof obj.firstName === 'string' &&
    typeof obj.lastName === 'string'
  );
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === 'boolean';
}

export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

export function isNonEmptyString(value: any): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(value: any): value is string {
  if (!isString(value)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

export function isValidUUID(value: any): value is string {
  if (!isString(value)) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export function isValidDate(value: any): value is string {
  if (!isString(value)) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

export function hasProperty<T extends object, K extends string>(
  obj: T,
  key: K
): obj is T & Record<K, unknown> {
  return key in obj;
}

export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

// Export default for module compliance
export default {
  isApiResponse,
  isErrorResponse,
  isUser,
  isAppointmentDto,
  isDoctorDto,
  isHospitalDto,
  isPatientDto,
  isString,
  isNumber,
  isBoolean,
  isArray,
  isNonEmptyString,
  isValidEmail,
  isValidUUID,
  isValidDate,
  hasProperty,
  isNotNull,
  isNotUndefined,
  isDefined,
};
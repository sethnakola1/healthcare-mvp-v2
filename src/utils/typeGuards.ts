// Type guards for runtime type checking
import { User } from '../contexts/AuthContext';

/**
 * Check if a value is a string
 */
export const isString = (value: unknown): value is string => {
  return typeof value === 'string';
};

/**
 * Check if a value is a number
 */
export const isNumber = (value: unknown): value is number => {
  return typeof value === 'number' && !isNaN(value);
};

/**
 * Check if a value is a boolean
 */
export const isBoolean = (value: unknown): value is boolean => {
  return typeof value === 'boolean';
};

/**
 * Check if a value is an object (and not null)
 */
export const isObject = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

/**
 * Check if a value is an array
 */
export const isArray = (value: unknown): value is unknown[] => {
  return Array.isArray(value);
};

/**
 * Check if a value is a valid User object
 */
export const isUser = (value: unknown): value is User => {
  if (!isObject(value)) return false;

  const obj = value as Record<string, unknown>;

  return (
    isString(obj.userId) &&
    isString(obj.email) &&
    isString(obj.firstName) &&
    isString(obj.lastName) &&
    isString(obj.role) &&
    isBoolean(obj.isActive)
  );
};

/**
 * Check if a value is a valid email address
 */
export const isValidEmail = (value: unknown): value is string => {
  if (!isString(value)) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
};

/**
 * Check if a value is a valid UUID
 */
export const isValidUUID = (value: unknown): value is string => {
  if (!isString(value)) return false;

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
};

/**
 * Check if a value is a valid phone number
 */
export const isValidPhoneNumber = (value: unknown): value is string => {
  if (!isString(value)) return false;

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(value);
};

/**
 * Check if a date string is a valid date
 */
export const isValidDate = (value: unknown): value is string => {
  if (!isString(value)) return false;

  const date = new Date(value);
  return !isNaN(date.getTime());
};

/**
 * Check if a value is a valid business role
 */
export const isValidBusinessRole = (value: unknown): value is string => {
  if (!isString(value)) return false;

  const validRoles = [
    'SUPER_ADMIN',
    'TECH_ADVISOR',
    'HOSPITAL_ADMIN',
    'DOCTOR',
    'NURSE',
    'RECEPTIONIST',
    'PATIENT'
  ];

  return validRoles.includes(value);
};

/**
 * Check if an API response has the expected structure
 */
export const isValidApiResponse = <T>(value: unknown): value is { success: boolean; data: T; message: string } => {
  if (!isObject(value)) return false;

  const obj = value as Record<string, unknown>;

  return (
    isBoolean(obj.success) &&
    isString(obj.message) &&
    obj.data !== undefined
  );
};

/**
 * Check if a value is null or undefined
 */
export const isNullOrUndefined = (value: unknown): value is null | undefined => {
  return value === null || value === undefined;
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object)
 */
export const isEmpty = (value: unknown): boolean => {
  if (isNullOrUndefined(value)) return true;
  if (isString(value)) return value.trim().length === 0;
  if (isArray(value)) return value.length === 0;
  if (isObject(value)) return Object.keys(value).length === 0;
  return false;
};

/**
 * Type guard for appointment status
 */
export const isValidAppointmentStatus = (value: unknown): value is string => {
  if (!isString(value)) return false;

  const validStatuses = [
    'SCHEDULED',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
  ];

  return validStatuses.includes(value);
};

/**
 * Type guard for payment status
 */
export const isValidPaymentStatus = (value: unknown): value is string => {
  if (!isString(value)) return false;

  const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
  return validStatuses.includes(value);
};

// Default export for the main type guards object
const typeGuards = {
  isString,
  isNumber,
  isBoolean,
  isObject,
  isArray,
  isUser,
  isValidEmail,
  isValidUUID,
  isValidPhoneNumber,
  isValidDate,
  isValidBusinessRole,
  isValidApiResponse,
  isNullOrUndefined,
  isEmpty,
  isValidAppointmentStatus,
  isValidPaymentStatus,
};

export default typeGuards;
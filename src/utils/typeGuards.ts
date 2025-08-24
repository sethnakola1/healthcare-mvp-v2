// Type guards for runtime type checking
import  User  from '../contexts/AuthContext';

/**
 * Check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

/**
 * Check if a value is a boolean
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Check if a value is an object (and not null or array)
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Check if a value is an array
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Check if a value is a valid User object
 */
export function isUser(value: unknown): value is User {
  if (!isObject(value)) {
    return false;
  }

  const requiredFields = ['userId', 'email', 'firstName', 'lastName', 'role'];
  return requiredFields.every(field => field in value);
}

/**
 * Check if a string is a valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a string is a valid UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Check if a value is a valid date
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime());
}

/**
 * Check if a value is null or undefined
 */
export function isNullOrUndefined(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Check if a value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Check if a string is not empty
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value) && value.trim().length > 0;
}

/**
 * Check if an array is not empty
 */
export function isNonEmptyArray<T>(value: T[]): value is [T, ...T[]] {
  return isArray(value) && value.length > 0;
}

/**
 * Type guard for API response
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: string;
  timestamp: string;
}

export function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
  if (!isObject(value)) {
    return false;
  }

  return (
    'success' in value &&
    isBoolean(value.success) &&
    'message' in value &&
    isString(value.message) &&
    'timestamp' in value &&
    isString(value.timestamp)
  );
}

/**
 * Check if API response is successful
 */
export function isSuccessfulApiResponse<T>(value: unknown): value is ApiResponse<T> & { success: true; data: T } {
  return isApiResponse(value) && value.success === true && 'data' in value;
}

/**
 * Check if API response is an error
 */
export function isErrorApiResponse(value: unknown): value is ApiResponse & { success: false; error: string } {
  return isApiResponse(value) && value.success === false && 'error' in value;
}
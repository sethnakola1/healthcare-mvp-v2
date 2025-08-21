// src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[]
} => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const formatError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.response?.data?.error) {
    return error.response.data.error;
  }

  return 'An unexpected error occurred';
};


// import { z } from 'zod';
//
// export const businessUserSchema = z.object({
//   firstName: z.string()
//     .min(1, 'First name is required')
//     .max(50, 'First name must not exceed 50 characters'),
//   lastName: z.string()
//     .min(1, 'Last name is required')
//     .max(50, 'Last name must not exceed 50 characters'),
//   email: z.string()
//     .email('Invalid email format')
//     .min(1, 'Email is required'),
//   phoneNumber: z.string()
//     .min(1, 'Phone number is required')
//     .max(20, 'Phone number must not exceed 20 characters'),
//   territory: z.string()
//     .min(1, 'Territory is required')
//     .max(100, 'Territory must not exceed 100 characters'),
//   role: z.enum(['SUPER_ADMIN', 'TECH_ADVISOR'], {
//     required_error: 'Role is required'
//   })
// });
//
// export const patientSchema = z.object({
//   firstName: z.string()
//     .min(1, 'First name is required')
//     .max(100, 'First name must not exceed 100 characters'),
//   lastName: z.string()
//     .min(1, 'Last name is required')
//     .max(100, 'Last name must not exceed 100 characters'),
//   email: z.string()
//     .email('Invalid email format')
//     .optional(),
//   phoneNumber: z.string()
//     .optional(),
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
//     required_error: 'Gender is required'
//   }),
// });





// // src/utils/validators.ts
// import { z } from 'zod';
//
// // Login validation schema
// export const loginSchema = z.object({
//   email: z
//     .string()
//     .min(1, 'Email is required')
//     .email('Please enter a valid email address')
//     .max(255, 'Email must not exceed 255 characters'),
//   password: z
//     .string()
//     .min(1, 'Password is required')
//     .min(8, 'Password must be at least 8 characters')
// });
//
// // Business user registration schema
// export const businessUserRegistrationSchema = z.object({
//   firstName: z
//     .string()
//     .min(1, 'First name is required')
//     .min(2, 'First name must be at least 2 characters')
//     .max(50, 'First name must not exceed 50 characters')
//     .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
//   lastName: z
//     .string()
//     .min(1, 'Last name is required')
//     .min(2, 'Last name must be at least 2 characters')
//     .max(50, 'Last name must not exceed 50 characters')
//     .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
//   email: z
//     .string()
//     .min(1, 'Email is required')
//     .email('Please enter a valid email address')
//     .max(100, 'Email must not exceed 100 characters'),
//   username: z
//     .string()
//     .min(1, 'Username is required')
//     .min(3, 'Username must be at least 3 characters')
//     .max(50, 'Username must not exceed 50 characters')
//     .regex(/^[a-zA-Z0-9._-]+$/, 'Username can only contain letters, numbers, dots, underscores, and hyphens'),
//   password: z
//     .string()
//     .min(1, 'Password is required')
//     .min(8, 'Password must be at least 8 characters')
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//       'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
//     ),
//   confirmPassword: z
//     .string()
//     .min(1, 'Confirm password is required'),
//   phoneNumber: z
//     .string()
//     .optional()
//     .refine((val) => !val || /^[+]?[1-9]\d{1,14}$/.test(val), 'Please provide a valid phone number'),
//   territory: z
//     .string()
//     .min(1, 'Territory is required')
//     .max(100, 'Territory must not exceed 100 characters'),
//   role: z.enum(['SUPER_ADMIN', 'TECH_ADVISOR'], 'Role is required')
//   // role: z.enum(['SUPER_ADMIN', 'TECH_ADVISOR'], {
//   //   required_error: 'Role is required'
//   // })
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// });
//
//
// export const patientRegistrationSchema = z.object({
//   hospitalId: z.string().min(1, 'Hospital is required'),
//   firstName: z
//     .string()
//     .min(1, 'First name is required')
//     .min(2, 'First name must be at least 2 characters')
//     .max(100, 'First name must not exceed 100 characters')
//     .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
//   lastName: z
//     .string()
//     .min(1, 'Last name is required')
//     .min(2, 'Last name must be at least 2 characters')
//     .max(100, 'Last name must not exceed 100 characters')
//     .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
//   dateOfBirth: z
//     .string()
//     .min(1, 'Date of birth is required')
//     .refine((date) => {
//       const birthDate = new Date(date);
//       const today = new Date();
//       return birthDate < today;
//     }, 'Date of birth must be in the past'),
//
//
//   gender: z.enum(['MALE', 'FEMALE', 'OTHER'], 'Gender is required'),
//   // gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
//   //   required_error: 'Gender is required'
//   // }),
//   email: z
//     .string()
//     .email('Please enter a valid email address')
//     .max(255, 'Email must not exceed 255 characters')
//     .optional()
//     .or(z.literal('')),
//   phoneNumber: z
//     .string()
//     .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number')
//     .optional()
//     .or(z.literal('')),
//   address: z
//     .string()
//     .max(500, 'Address must not exceed 500 characters')
//     .optional(),
//   bloodGroup: z
//     .string()
//     .regex(/^(A|B|AB|O)[+-]$/, 'Please enter a valid blood group (e.g., A+, B-, AB+, O-)')
//     .optional()
//     .or(z.literal('')),
//   emergencyContactName: z
//     .string()
//     .max(1000, 'Emergency contact name must not exceed 1000 characters')
//     .optional(),
//   emergencyContactPhone: z
//     .string()
//     .regex(/^\+?[1-9]\d{1,14}$/, 'Please enter a valid emergency contact phone')
//     .optional()
//     .or(z.literal('')),
//   emergencyContactRelationship: z
//     .string()
//     .max(100, 'Emergency contact relationship must not exceed 100 characters')
//     .optional(),
//   initialSymptoms: z
//     .string()
//     .max(2000, 'Initial symptoms must not exceed 2000 characters')
//     .optional(),
//   allergies: z
//     .string()
//     .max(1000, 'Allergies must not exceed 1000 characters')
//     .optional(),
//   currentMedications: z
//     .string()
//     .max(1000, 'Current medications must not exceed 1000 characters')
//     .optional(),
//   chronicConditions: z
//     .string()
//     .max(1000, 'Chronic conditions must not exceed 1000 characters')
//     .optional(),
//   ssnLast4: z
//     .string()
//     .regex(/^\d{4}$/, 'SSN last 4 digits must be exactly 4 digits')
//     .optional()
//     .or(z.literal('')),
// });
//
// export const hospitalRegistrationSchema = z.object({
//   hospitalName: z
//     .string()
//     .min(1, 'Hospital name is required')
//     .max(200, 'Hospital name must not exceed 200 characters'),
//   licenseNumber: z
//     .string()
//     .max(100, 'License number must not exceed 100 characters')
//     .optional(),
//   taxId: z
//     .string()
//     .max(50, 'Tax ID must not exceed 50 characters')
//     .optional(),
//   address: z
//     .string()
//     .min(1, 'Address is required'),
//   city: z
//     .string()
//     .min(1, 'City is required')
//     .max(100, 'City must not exceed 100 characters'),
//   state: z
//     .string()
//     .min(1, 'State is required')
//     .max(100, 'State must not exceed 100 characters'),
//   country: z
//     .string()
//     .min(1, 'Country is required')
//     .max(100, 'Country must not exceed 100 characters'),
//   postalCode: z
//     .string()
//     .max(20, 'Postal code must not exceed 20 characters')
//     .optional(),
//   phoneNumber: z
//     .string()
//     .max(20, 'Phone number must not exceed 20 characters')
//     .optional(),
//   email: z
//     .string()
//     .email('Please enter a valid email address')
//     .optional()
//     .or(z.literal('')),
//   website: z
//     .string()
//     .url('Please enter a valid website URL')
//     .max(255, 'Website URL must not exceed 255 characters')
//     .optional()
//     .or(z.literal('')),
//   partnerCodeUsed: z
//     .string()
//     .optional(),
//   subscriptionPlan: z
//     .string()
//     .default('BASIC'),
// });
//
// export type PatientRegistrationFormData = z.infer<typeof patientRegistrationSchema>;
// export type HospitalRegistrationFormData = z.infer<typeof hospitalRegistrationSchema>;
//
//
// export type LoginFormData = z.infer<typeof loginSchema>;
// export type BusinessUserRegistrationFormData = z.infer<typeof businessUserRegistrationSchema>;
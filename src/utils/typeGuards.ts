// Additional utility: src/utils/typeGuards.ts
import { BusinessRole } from '../types/auth.types';

export const isValidBusinessRole = (role: string): role is BusinessRole => {
  return Object.values(BusinessRole).includes(role as BusinessRole);
};

export const parseBusinessRole = (role: string): BusinessRole => {
  if (isValidBusinessRole(role)) {
    return role;
  }

  // Fallback for unknown roles
  console.warn(`Unknown role received: ${role}, defaulting to PATIENT`);
  return BusinessRole.PATIENT;
};

// Type guard for user profile validation
export const isValidUserProfile = (user: any): boolean => {
  return (
    user &&
    typeof user.userId === 'string' &&
    typeof user.email === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    isValidBusinessRole(user.role)
  );
};
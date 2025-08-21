// src/utils/validators.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validation utilities for form validation and data validation
 */
class ValidationUtils {
  /**
   * Validate email format
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email || email.trim() === '') {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate phone number
   */
  static validatePhoneNumber(phoneNumber: string): ValidationResult {
    const errors: string[] = [];

    if (!phoneNumber || phoneNumber.trim() === '') {
      errors.push('Phone number is required');
    } else {
      // Basic phone number validation (adjust regex as needed)
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(phoneNumber)) {
        errors.push('Invalid phone number format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate required field
   */
  static validateRequired(value: string, fieldName: string): ValidationResult {
    const errors: string[] = [];

    if (!value || value.trim() === '') {
      errors.push(`${fieldName} is required`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate string length
   */
  static validateLength(
    value: string,
    minLength: number,
    maxLength: number,
    fieldName: string
  ): ValidationResult {
    const errors: string[] = [];

    if (value && value.length < minLength) {
      errors.push(`${fieldName} must be at least ${minLength} characters long`);
    }

    if (value && value.length > maxLength) {
      errors.push(`${fieldName} must not exceed ${maxLength} characters`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate date format (YYYY-MM-DD)
   */
  static validateDate(dateString: string): ValidationResult {
    const errors: string[] = [];

    if (!dateString) {
      errors.push('Date is required');
    } else {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate UUID format
   */
  static validateUUID(uuid: string): ValidationResult {
    const errors: string[] = [];

    if (!uuid) {
      errors.push('UUID is required');
    } else {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(uuid)) {
        errors.push('Invalid UUID format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate multiple fields and combine results
   */
  static validateMultiple(validations: ValidationResult[]): ValidationResult {
    const allErrors = validations.flatMap(validation => validation.errors);

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

export default ValidationUtils;

// Export for module compliance
export { ValidationUtils };
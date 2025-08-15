import DOMPurify from 'dompurify';

export class SecurityUtils {
  // XSS Protection
  static sanitizeInput(input: string): string {
    return DOMPurify.sanitize(input, { 
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });
  }

  // Input validation
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 255;
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push('Password must contain lowercase letter');
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push('Password must contain uppercase letter');
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push('Password must contain number');
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      errors.push('Password must contain special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Rate limiting client-side tracking
  private static attemptCounts = new Map<string, { count: number; timestamp: number }>();

  static checkRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attemptCounts.get(key);

    if (!attempts || (now - attempts.timestamp) > windowMs) {
      this.attemptCounts.set(key, { count: 1, timestamp: now });
      return true;
    }

    if (attempts.count >= maxAttempts) {
      return false;
    }

    attempts.count++;
    return true;
  }

  static resetRateLimit(key: string): void {
    this.attemptCounts.delete(key);
  }
}
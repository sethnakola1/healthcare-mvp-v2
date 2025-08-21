// src/utils/security.utils.ts

/**
 * Security utilities for safe data handling
 */
class SecurityUtils {
  /**
   * Safely set item to localStorage with error handling
   */
  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to set localStorage item:', error);
    }
  }

  /**
   * Safely get item from localStorage with error handling
   */
  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get localStorage item:', error);
      return null;
    }
  }

  /**
   * Safely remove item from localStorage
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove localStorage item:', error);
    }
  }

  /**
   * Clear all localStorage data
   */
  static clearAll(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Sanitize HTML to prevent XSS attacks
   */
  static sanitizeHtml(input: string): string {
    const element = document.createElement('div');
    element.textContent = input;
    return element.innerHTML;
  }

  /**
   * Generate a random token for CSRF protection
   */
  static generateCSRFToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate if a string is a valid UUID
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }

  /**
   * Mask sensitive data for logging
   */
  static maskSensitiveData(data: string, visibleChars = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    return data.slice(0, visibleChars) + '*'.repeat(data.length - visibleChars);
  }
}

export default SecurityUtils;

// Make it a module to fix the isolatedModules error
export { SecurityUtils };
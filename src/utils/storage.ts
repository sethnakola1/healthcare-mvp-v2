// src/utils/storage.ts
export class StorageService {
  static setItem(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to set localStorage item:', error);
    }
  }

  static getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Failed to get localStorage item:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove localStorage item:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  static setObject(key: string, value: any): void {
    try {
      const serialized = JSON.stringify(value);
      this.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to set localStorage object:', error);
    }
  }

  static getObject<T>(key: string): T | null {
    try {
      const item = this.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Failed to get localStorage object:', error);
      return null;
    }
  }
}

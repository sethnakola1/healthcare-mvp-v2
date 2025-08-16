// src/services/business.service.ts
import { apiService } from './api.service';
import { BusinessUser, CreateBusinessUserRequest } from '../types/business.types';
import { BaseResponse } from '../types/common.types';

export class BusinessService {
  private static instance: BusinessService;

  private constructor() {}

  public static getInstance(): BusinessService {
    if (!BusinessService.instance) {
      BusinessService.instance = new BusinessService();
    }
    return BusinessService.instance;
  }

  async registerBusinessUser(userData: CreateBusinessUserRequest): Promise<BusinessUser> {
    const response = await apiService.post<BusinessUser>('/auth/register', userData);
    return response.data;
  }

  async createBusinessUser(userData: CreateBusinessUserRequest): Promise<BusinessUser> {
    const response = await apiService.post<BusinessUser>('/admin/users/create', userData);
    return response.data;
  }

  async getAllTechAdvisors(): Promise<BusinessUser[]> {
    const response = await apiService.get<BusinessUser[]>('/business/super-admin/tech-advisors');
    return response.data;
  }

  async getBusinessUserById(id: string): Promise<BusinessUser> {
    const response = await apiService.get<BusinessUser>(`/business/super-admin/tech-advisors/${id}`);
    return response.data;
  }

  async updateBusinessUser(id: string, userData: CreateBusinessUserRequest): Promise<BusinessUser> {
    const response = await apiService.put<BusinessUser>(`/business/super-admin/tech-advisors/${id}`, userData);
    return response.data;
  }

  async deactivateBusinessUser(id: string): Promise<void> {
    await apiService.delete<string>(`/business/super-admin/tech-advisors/${id}`);
  }

  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await apiService.get<{ emailAvailable: boolean }>(
      `/auth/registration/check-availability?email=${encodeURIComponent(email)}`
    );
    return response.data.emailAvailable;
  }

  async checkUsernameAvailability(username: string): Promise<boolean> {
    const response = await apiService.get<{ usernameAvailable: boolean }>(
      `/auth/registration/check-availability?username=${encodeURIComponent(username)}`
    );
    return response.data.usernameAvailable;
  }

  async getAvailableRoles(): Promise<{ value: string; label: string; description: string }[]> {
    const response = await apiService.get<{ value: string; label: string; description: string }[]>(
      '/auth/registration/roles'
    );
    return response.data;
  }
}

export const businessService = BusinessService.getInstance();
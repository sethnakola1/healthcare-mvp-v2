// src/services/api.service.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getStoredToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = this.getStoredRefreshToken();
            if (refreshToken) {
              const response = await this.refreshAccessToken(refreshToken);
              const newToken = response.data.data.accessToken;
              this.setStoredToken(newToken);
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            this.clearStoredTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private getStoredToken(): string | null {
    return sessionStorage.getItem('accessToken');
  }

  private getStoredRefreshToken(): string | null {
    return sessionStorage.getItem('refreshToken');
  }

  private setStoredToken(token: string): void {
    sessionStorage.setItem('accessToken', token);
  }

  private setStoredRefreshToken(token: string): void {
    sessionStorage.setItem('refreshToken', token);
  }

  private clearStoredTokens(): void {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
  }

  private async refreshAccessToken(refreshToken: string): Promise<AxiosResponse> {
    return this.api.post('/auth/refresh', { refreshToken });
  }

  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<AxiosResponse<BaseResponse<T>>> {
    try {
      const response = await this.api.request<BaseResponse<T>>(config);
      return response;
    } catch (error: any) {
      // Handle network errors
      if (!error.response) {
        throw new Error('Network error or server unavailable');
      }
      throw error;
    }
  }

  // Convenience methods
  public get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<BaseResponse<T>>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<BaseResponse<T>>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<BaseResponse<T>>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<BaseResponse<T>>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }
}

export const apiService = new ApiService();
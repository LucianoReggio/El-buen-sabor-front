import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiError, ApiResponse } from '../types/api.types';

// Configuración base
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Agregar token de auth si existe
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Log para desarrollo
        if (import.meta.env.DEV) {
          console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }
        
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Manejo de errores global
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        if (import.meta.env.DEV) {
          console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        }
        return response;
      },
      (error) => {
        const apiError: ApiError = {
          message: 'Error desconocido',
          status: 500,
        };

        if (error.response) {
          // Error del servidor (4xx, 5xx)
          apiError.status = error.response.status;
          apiError.message = error.response.data?.message || error.response.statusText;
          apiError.details = error.response.data;

          // Manejo específico por código de error
          switch (error.response.status) {
            case 401:
              apiError.message = 'No autorizado. Por favor, inicia sesión nuevamente.';
              localStorage.removeItem('auth_token');
              window.location.href = '/login';
              break;
            case 403:
              apiError.message = 'No tienes permisos para realizar esta acción.';
              break;
            case 404:
              apiError.message = 'Recurso no encontrado.';
              break;
            case 422:
              apiError.message = 'Error de validación.';
              break;
            case 500:
              apiError.message = 'Error interno del servidor.';
              break;
          }
        } else if (error.request) {
          // Error de red
          apiError.message = 'Error de conexión. Verifica tu conexión a internet.';
          apiError.status = 0;
        }

        console.error('❌ API Error:', apiError);
        return Promise.reject(apiError);
      }
    );
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  // Método para subir archivos
  async uploadFile<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    
    return response.data;
  }
}

export const apiClient = new ApiClient();
import { apiClient } from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  token: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export class AuthService {
  private readonly basePath = "/auth";

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      `${this.basePath}/login`,
      credentials
    );

    // Guardar token en localStorage
    if (response.token) {
      localStorage.setItem("auth_token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }

    return response;
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(`${this.basePath}/register`, data);
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post(`${this.basePath}/logout`);
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      // Limpiar localStorage siempre
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
    }
  }

  async getCurrentUser(): Promise<LoginResponse["user"]> {
    return apiClient.get<LoginResponse["user"]>(`${this.basePath}/me`);
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>(
      `${this.basePath}/refresh`
    );

    if (response.token) {
      localStorage.setItem("auth_token", response.token);
    }

    return response;
  }

  // Métodos de utilidad
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  }

  getStoredUser(): LoginResponse["user"] | null {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem("auth_token");
  }
}

export const authService = new AuthService();

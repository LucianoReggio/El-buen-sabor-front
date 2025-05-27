import { apiClient } from "../../../services/api";
import type {
  CategoriaRequestDTO,
  CategoriaResponseDTO,
} from "../../../types/categoria.types";

import type { SearchParams } from "../../../types/common.types";

export class CategoriaService {
  private readonly basePath = "/categorias";

  // CRUD básico
  async getAll(): Promise<CategoriaResponseDTO[]> {
    return apiClient.get<CategoriaResponseDTO[]>(this.basePath);
  }

  async getById(id: number): Promise<CategoriaResponseDTO> {
    return apiClient.get<CategoriaResponseDTO>(`${this.basePath}/${id}`);
  }

  async create(categoria: CategoriaRequestDTO): Promise<CategoriaResponseDTO> {
    return apiClient.post<CategoriaResponseDTO>(this.basePath, categoria);
  }

  async update(
    id: number,
    categoria: CategoriaRequestDTO
  ): Promise<CategoriaResponseDTO> {
    return apiClient.put<CategoriaResponseDTO>(
      `${this.basePath}/${id}`,
      categoria
    );
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // Operaciones específicas
  async getCategoriasPrincipales(): Promise<CategoriaResponseDTO[]> {
    return apiClient.get<CategoriaResponseDTO[]>(
      `${this.basePath}/principales`
    );
  }

  async getSubcategoriasByPadre(
    idPadre: number
  ): Promise<CategoriaResponseDTO[]> {
    return apiClient.get<CategoriaResponseDTO[]>(
      `${this.basePath}/${idPadre}/subcategorias`
    );
  }

  async search(params: SearchParams): Promise<CategoriaResponseDTO[]> {
    return apiClient.get<CategoriaResponseDTO[]>(`${this.basePath}/buscar`, {
      params,
    });
  }

  // Validaciones
  async existsByDenominacion(denominacion: string): Promise<boolean> {
    const response = await apiClient.get<boolean>(`${this.basePath}/exists`, {
      params: { denominacion },
    });
    return response;
  }

  async hasSubcategorias(id: number): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${id}/has-subcategorias`);
  }

  async hasArticulos(id: number): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${id}/has-articulos`);
  }
}

export const categoriaService = new CategoriaService();

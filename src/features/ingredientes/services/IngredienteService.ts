import { apiClient } from "../../../services/api";
import type {
  ArticuloInsumoRequestDTO,
  ArticuloInsumoResponseDTO,
  CompraIngredienteFormData,
  UnidadMedida,
} from "../../../types/ingrediente.types";

export class IngredienteService {
  private readonly basePath = "/articulos-insumo";

  // CRUD básico
  async getAll(): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(this.basePath);
  }

  async getById(id: number): Promise<ArticuloInsumoResponseDTO> {
    return apiClient.get<ArticuloInsumoResponseDTO>(`${this.basePath}/${id}`);
  }

  async create(
    ingrediente: ArticuloInsumoRequestDTO
  ): Promise<ArticuloInsumoResponseDTO> {
    return apiClient.post<ArticuloInsumoResponseDTO>(
      this.basePath,
      ingrediente
    );
  }

  async update(
    id: number,
    ingrediente: ArticuloInsumoRequestDTO
  ): Promise<ArticuloInsumoResponseDTO> {
    return apiClient.put<ArticuloInsumoResponseDTO>(
      `${this.basePath}/${id}`,
      ingrediente
    );
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // Búsquedas específicas
  async getByCategoria(
    idCategoria: number
  ): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/categoria/${idCategoria}`
    );
  }

  async getByUnidadMedida(
    idUnidadMedida: number
  ): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/unidad-medida/${idUnidadMedida}`
    );
  }

  async getIngredientes(): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/ingredientes`
    );
  }

  async getProductosNoManufacturados(): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/productos-no-manufacturados`
    );
  }

  async search(denominacion: string): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/buscar`,
      {
        params: { denominacion },
      }
    );
  }

  // Control de stock
  async getStockCritico(): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/stock/critico`
    );
  }

  async getStockBajo(): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/stock/bajo`
    );
  }

  async getStockInsuficiente(
    cantidad: number
  ): Promise<ArticuloInsumoResponseDTO[]> {
    return apiClient.get<ArticuloInsumoResponseDTO[]>(
      `${this.basePath}/stock/insuficiente`,
      {
        params: { cantidad },
      }
    );
  }

  // Operaciones de stock
  async actualizarStock(
    id: number,
    nuevoStock: number
  ): Promise<ArticuloInsumoResponseDTO> {
    return apiClient.put<ArticuloInsumoResponseDTO>(
      `${this.basePath}/${id}/stock`,
      null,
      {
        params: { nuevoStock },
      }
    );
  }

  async incrementarStock(
    id: number,
    cantidad: number
  ): Promise<ArticuloInsumoResponseDTO> {
    return apiClient.put<ArticuloInsumoResponseDTO>(
      `${this.basePath}/${id}/stock/incrementar`,
      null,
      {
        params: { cantidad },
      }
    );
  }

  async decrementarStock(
    id: number,
    cantidad: number
  ): Promise<ArticuloInsumoResponseDTO> {
    return apiClient.put<ArticuloInsumoResponseDTO>(
      `${this.basePath}/${id}/stock/decrementar`,
      null,
      {
        params: { cantidad },
      }
    );
  }

  // Validaciones e información
  async existsByDenominacion(denominacion: string): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/exists`, {
      params: { denominacion },
    });
  }

  async hasStockAvailable(id: number, cantidad: number): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${id}/stock-available`, {
      params: { cantidad },
    });
  }

  async isUsedInProducts(id: number): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${id}/used-in-products`);
  }

  async getPorcentajeStock(id: number): Promise<number> {
    return apiClient.get<number>(`${this.basePath}/${id}/porcentaje-stock`);
  }

  async getEstadoStock(id: number): Promise<string> {
    return apiClient.get<string>(`${this.basePath}/${id}/estado-stock`);
  }

  // Método para registrar compras (funcionalidad adicional)
  async registrarCompra(
    compra: CompraIngredienteFormData
  ): Promise<ArticuloInsumoResponseDTO> {
    return apiClient.post<ArticuloInsumoResponseDTO>(
      `${this.basePath}/registrar-compra`,
      compra
    );
  }
}

// Servicios auxiliares
export class UnidadMedidaService {
  private readonly basePath = "/unidades-medida";

  async getAll(): Promise<UnidadMedida[]> {
    return apiClient.get<UnidadMedida[]>(this.basePath);
  }

  async getById(id: number): Promise<UnidadMedida> {
    return apiClient.get<UnidadMedida>(`${this.basePath}/${id}`);
  }

  async create(
    unidadMedida: Omit<UnidadMedida, "idUnidadMedida">
  ): Promise<UnidadMedida> {
    return apiClient.post<UnidadMedida>(this.basePath, unidadMedida);
  }

  async update(
    id: number,
    unidadMedida: Omit<UnidadMedida, "idUnidadMedida">
  ): Promise<UnidadMedida> {
    return apiClient.put<UnidadMedida>(`${this.basePath}/${id}`, unidadMedida);
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }
}

export const ingredienteService = new IngredienteService();
export const unidadMedidaService = new UnidadMedidaService();

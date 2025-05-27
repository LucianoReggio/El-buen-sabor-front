import { apiClient } from "../../../services/api";
import type {
  ArticuloManufacturadoRequestDTO,
  ArticuloManufacturadoResponseDTO,
} from "../../../types/producto.types";

export class ProductoService {
  private readonly basePath = "/articulos-manufacturados";

  // CRUD básico
  async getAll(): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(this.basePath);
  }

  async getById(id: number): Promise<ArticuloManufacturadoResponseDTO> {
    return apiClient.get<ArticuloManufacturadoResponseDTO>(
      `${this.basePath}/${id}`
    );
  }

  async create(
    producto: ArticuloManufacturadoRequestDTO
  ): Promise<ArticuloManufacturadoResponseDTO> {
    return apiClient.post<ArticuloManufacturadoResponseDTO>(
      this.basePath,
      producto
    );
  }

  async update(
    id: number,
    producto: ArticuloManufacturadoRequestDTO
  ): Promise<ArticuloManufacturadoResponseDTO> {
    return apiClient.put<ArticuloManufacturadoResponseDTO>(
      `${this.basePath}/${id}`,
      producto
    );
  }

  async delete(id: number): Promise<void> {
    return apiClient.delete<void>(`${this.basePath}/${id}`);
  }

  // Búsquedas específicas
  async getByCategoria(
    idCategoria: number
  ): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/categoria/${idCategoria}`
    );
  }

  async getByTiempoMaximo(
    tiempoMaximo: number
  ): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/tiempo-maximo/${tiempoMaximo}`
    );
  }

  async getByIngrediente(
    idInsumo: number
  ): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/ingrediente/${idInsumo}`
    );
  }

  async getByPrecioRango(
    precioMin: number,
    precioMax: number
  ): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/precio-rango`,
      {
        params: { precioMin, precioMax },
      }
    );
  }

  async getByMinimoIngredientes(
    cantidadMinima: number
  ): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/minimo-ingredientes/${cantidadMinima}`
    );
  }

  async search(
    denominacion: string
  ): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/buscar`,
      {
        params: { denominacion },
      }
    );
  }

  // Control de preparabilidad y stock
  async getPreparables(): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/preparables`
    );
  }

  async getNoPreparables(): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/no-preparables`
    );
  }

  async getMaximoPreparable(id: number): Promise<number> {
    return apiClient.get<number>(`${this.basePath}/${id}/maximo-preparable`);
  }

  async puedePrepararse(id: number, cantidad: number): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${id}/puede-prepararse`, {
      params: { cantidad },
    });
  }

  // Cálculos de costos y precios
  async getCostoTotal(id: number): Promise<number> {
    return apiClient.get<number>(`${this.basePath}/${id}/costo-total`);
  }

  async getMargenGanancia(id: number): Promise<number> {
    return apiClient.get<number>(`${this.basePath}/${id}/margen-ganancia`);
  }

  async getPrecioSugerido(id: number, margen: number): Promise<number> {
    return apiClient.get<number>(`${this.basePath}/${id}/precio-sugerido`, {
      params: { margen },
    });
  }

  // Gestión de recetas (detalles)
  async agregarIngrediente(
    id: number,
    idInsumo: number,
    cantidad: number
  ): Promise<ArticuloManufacturadoResponseDTO> {
    return apiClient.post<ArticuloManufacturadoResponseDTO>(
      `${this.basePath}/${id}/ingredientes`,
      null,
      {
        params: { idInsumo, cantidad },
      }
    );
  }

  async actualizarIngrediente(
    id: number,
    idDetalle: number,
    nuevaCantidad: number
  ): Promise<ArticuloManufacturadoResponseDTO> {
    return apiClient.put<ArticuloManufacturadoResponseDTO>(
      `${this.basePath}/${id}/ingredientes/${idDetalle}`,
      null,
      {
        params: { nuevaCantidad },
      }
    );
  }

  async eliminarIngrediente(
    id: number,
    idDetalle: number
  ): Promise<ArticuloManufacturadoResponseDTO> {
    return apiClient.delete<ArticuloManufacturadoResponseDTO>(
      `${this.basePath}/${id}/ingredientes/${idDetalle}`
    );
  }

  // Simulaciones para producción
  async simularProduccion(
    cantidadAProducir: number
  ): Promise<ArticuloManufacturadoResponseDTO[]> {
    return apiClient.get<ArticuloManufacturadoResponseDTO[]>(
      `${this.basePath}/simulacion-produccion`,
      {
        params: { cantidadAProducir },
      }
    );
  }

  async verificarStockParaProduccion(
    id: number,
    cantidadAProducir: number
  ): Promise<boolean> {
    return apiClient.get<boolean>(
      `${this.basePath}/${id}/verificar-stock-produccion`,
      {
        params: { cantidadAProducir },
      }
    );
  }

  // Validaciones e información
  async existsByDenominacion(denominacion: string): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/exists`, {
      params: { denominacion },
    });
  }

  async tieneIngredientes(id: number): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${id}/tiene-ingredientes`);
  }

  async seUsaEnPedidos(id: number): Promise<boolean> {
    return apiClient.get<boolean>(`${this.basePath}/${id}/usado-en-pedidos`);
  }
}

export const productoService = new ProductoService();

import type { CategoriaInfo } from "./categoria.types";
import type { BaseEntity } from "./common.types";
import type { ImagenDTO } from "./ingredientes.types";
import type { UnidadMedida } from "./UnidadMedida";

export interface ManufacturadoDetalleDTO {
  idDetalleManufacturado?: number;
  idArticuloInsumo: number;
  denominacionInsumo?: string;
  unidadMedida?: string;
  precioCompraUnitario?: number;
  subtotal?: number;
  cantidad: number;
}

export interface ArticuloManufacturado extends BaseEntity {
  idArticulo: number;
  denominacion: string;
  precioVenta: number;
  descripcion?: string;
  tiempoEstimadoEnMinutos: number;
  preparacion?: string;
  unidadMedida: UnidadMedida;
  categoria: CategoriaInfo;
  detalles: ManufacturadoDetalleDTO[];
  imagenes: ImagenDTO[];
  
  // Campos calculados
  costoTotal: number;
  margenGanancia: number;
  cantidadIngredientes: number;
  stockSuficiente: boolean;
  cantidadMaximaPreparable: number;
  cantidadVendida: number;
}

export interface ArticuloManufacturadoRequestDTO {
  denominacion: string;
  idUnidadMedida: number;
  idCategoria: number;
  descripcion?: string;
  tiempoEstimadoEnMinutos: number;
  preparacion?: string;
  precioVenta?: number;
  margenGanancia?: number;
  detalles: ManufacturadoDetalleDTO[];
  imagen?: ImagenDTO;
}

export interface ArticuloManufacturadoResponseDTO {
  idArticulo: number;
  denominacion: string;
  precioVenta: number;
  idUnidadMedida: number;
  denominacionUnidadMedida: string;
  categoria: CategoriaInfo;
  descripcion?: string;
  tiempoEstimadoEnMinutos: number;
  preparacion?: string;
  detalles: ManufacturadoDetalleDTO[];
  costoTotal: number;
  margenGanancia: number;
  cantidadIngredientes: number;
  stockSuficiente: boolean;
  cantidadMaximaPreparable: number;
  imagenes: ImagenDTO[];
  cantidadVendida: number;
}

// Form types
export interface ProductoFormData {
  denominacion: string;
  descripcion?: string;
  tiempoEstimadoEnMinutos: number;
  preparacion?: string;
  idUnidadMedida: number;
  idCategoria: number;
  precioVenta?: number;
  margenGanancia?: number;
  detalles: RecetaIngrediente[];
  imagen?: File | string;
}

export interface RecetaIngrediente {
  idArticuloInsumo: number;
  denominacionInsumo: string;
  unidadMedida: string;
  precioCompraUnitario: number;
  cantidad: number;
  subtotal: number;
}

// Filtros
export interface ProductoFilters {
  denominacion?: string;
  idCategoria?: number;
  tiempoMaximo?: number;
  idInsumo?: number;
  precioMin?: number;
  precioMax?: number;
  cantidadMinimaIngredientes?: number;
  preparables?: boolean;
  stockSuficiente?: boolean;
}
import type { CategoriaInfo } from "./categoria.types";
import type { BaseEntity } from "./common.types";

export interface UnidadMedida {
  idUnidadMedida: number;
  denominacion: string;
}

export interface ImagenDTO {
  id?: number;
  nombre?: string;
  url: string;
}

export interface ArticuloInsumo extends BaseEntity {
  idArticulo: number;
  denominacion: string;
  precioVenta: number;
  precioCompra: number;
  stockActual: number;
  stockMaximo: number;
  esParaElaborar: boolean;
  unidadMedida: UnidadMedida;
  categoria: CategoriaInfo;
  imagenes: ImagenDTO[];
  
  // Campos calculados
  porcentajeStock: number;
  estadoStock: StockStatus;
  stockDisponible: number;
  cantidadProductosQueLoUsan: number;
}

export type StockStatus = 'CRITICO' | 'BAJO' | 'NORMAL' | 'ALTO';

export interface ArticuloInsumoRequestDTO {
  denominacion: string;
  precioVenta: number;
  idUnidadMedida: number;
  idCategoria: number;
  precioCompra: number;
  stockActual: number;
  stockMaximo: number;
  esParaElaborar: boolean;
  imagen?: ImagenDTO;
}

export interface ArticuloInsumoResponseDTO {
  idArticulo: number;
  denominacion: string;
  precioVenta: number;
  idUnidadMedida: number;
  denominacionUnidadMedida: string;
  idCategoria: number;
  denominacionCategoria: string;
  esSubcategoria: boolean;
  denominacionCategoriaPadre?: string;
  precioCompra: number;
  stockActual: number;
  stockMaximo: number;
  esParaElaborar: boolean;
  porcentajeStock: number;
  estadoStock: StockStatus;
  stockDisponible: number;
  imagenes: ImagenDTO[];
  cantidadProductosQueLoUsan: number;
}

// Form types
export interface IngredienteFormData {
  denominacion: string;
  precioVenta: number;
  precioCompra: number;
  stockActual: number;
  stockMaximo: number;
  esParaElaborar: boolean;
  idUnidadMedida: number;
  idCategoria: number;
  imagen?: File | string;
}

export interface CompraIngredienteFormData {
  idIngrediente: number;
  precioCompra: number;
  cantidadComprada: number;
}

// Filtros
export interface IngredienteFilters {
  denominacion?: string;
  idCategoria?: number;
  idUnidadMedida?: number;
  esParaElaborar?: boolean;
  estadoStock?: StockStatus;
  stockCritico?: boolean;
  stockBajo?: boolean;
}
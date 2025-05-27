import type { ArticuloInsumoResponseDTO } from "./ingredientes.types";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiValidationResponse {
  errors: ValidationError[];
  message: string;
}

// Query params comunes
export interface SearchParams {
  denominacion?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Respuestas de endpoints especÃ­ficos
export interface StockControlResponse {
  stockCritico: ArticuloInsumoResponseDTO[];
  stockBajo: ArticuloInsumoResponseDTO[];
}

export interface CalculationResponse {
  costoTotal: number;
  margenGanancia?: number;
  precioSugerido?: number;
  maximoPreparable?: number;
}

export interface ExistenceCheckResponse {
  exists: boolean;
}
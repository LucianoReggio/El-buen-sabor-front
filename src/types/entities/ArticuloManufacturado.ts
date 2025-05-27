// src/models/ArticuloManufacturado.ts

// src/models/ArticuloManufacturado.ts
import type { Articulo } from "./Articulo";
import type { ArticuloManufacturadoDetalle } from "./ArticuloManufacturadoDetalle";

export interface ArticuloManufacturado extends Articulo {
  descripcion: string;
  tiempoEstimadoEnMinutos: number;
  preparacion: string;
  detalles?: ArticuloManufacturadoDetalle[];
}

// src/models/ArticuloManufacturadoDetalle.ts

// src/models/ArticuloManufacturadoDetalle.ts
import type { ArticuloManufacturado } from "./producto.types.ts";
import type { ArticuloInsumo } from "./ingredientes.types";

export interface ArticuloManufacturadoDetalle {
  idDetalleManufacturado: number;
  cantidad: number;
  articuloManufacturado: ArticuloManufacturado;
  articuloInsumo: ArticuloInsumo;
}

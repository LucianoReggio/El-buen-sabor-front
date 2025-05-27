import type { ArticuloInsumoResponseDTO } from "./ingrediente.types";
import type { ArticuloManufacturadoResponseDTO } from "./producto.types";

export interface DashboardMetrics {
  totalIngredientes: number;
  ingredientesStockCritico: number;
  ingredientesStockBajo: number;
  totalProductos: number;
  productosPreparables: number;
  productosNoPreparables: number;
  categoriasActivas: number;
}

export interface StockAlert {
  tipo: "critico" | "bajo" | "agotado";
  articulo: ArticuloInsumoResponseDTO;
  mensaje: string;
  prioridad: "alta" | "media" | "baja";
}

export interface ProductAlert {
  tipo: "no_preparable" | "costo_alto" | "sin_ingredientes";
  producto: ArticuloManufacturadoResponseDTO;
  mensaje: string;
  prioridad: "alta" | "media" | "baja";
}

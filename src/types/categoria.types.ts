// src/models/Categoria.ts

// src/models/Categoria.ts

import type { BaseEntity } from "./common.types";


export interface Categoria extends BaseEntity {
  idCategoria: number;
  denominacion: string;
  esSubcategoria: boolean;
  categoriaPadre?: CategoriaSimple;
  subcategorias: CategoriaSimple[];
}

export interface CategoriaSimple {
  idCategoria: number;
  denominacion: string;
  esSubcategoria: boolean;
}

export interface CategoriaInfo {
  idCategoria: number;
  denominacion: string;
  esSubcategoria: boolean;
  categoriaPadre?: string;
}

// Request/Response DTOs
export interface CategoriaRequestDTO {
  denominacion: string;
  esSubcategoria: boolean;
  idCategoriaPadre?: number;
}

export interface CategoriaResponseDTO {
  idCategoria: number;
  denominacion: string;
  esSubcategoria: boolean;
  categoriaPadre?: CategoriaSimple;
  subcategorias: CategoriaSimple[];
  cantidadArticulos?: number;
}

// Form types
export interface CategoriaFormData {
  denominacion: string;
  esSubcategoria: boolean;
  idCategoriaPadre?: number;
}

export interface CategoriaTreeNode extends CategoriaResponseDTO {
  children: CategoriaTreeNode[];
  level: number;
  expanded?: boolean;
}

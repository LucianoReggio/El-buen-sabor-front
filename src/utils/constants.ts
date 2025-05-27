export const APP_NAME = 'El Buen Sabor';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Sistema de Gestión de Restaurante';

export const ROLES = {
  ADMIN: 'Administrador',
  COCINERO: 'Cocinero',
  CAJERO: 'Cajero',
  DELIVERY: 'Delivery',
} as const;

export const STOCK_STATES = {
  CRITICO: 'CRITICO',
  BAJO: 'BAJO', 
  NORMAL: 'NORMAL',
  ALTO: 'ALTO',
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const;

export const API_ENDPOINTS = {
  CATEGORIAS: '/categorias',
  INGREDIENTES: '/articulos-insumo',
  PRODUCTOS: '/articulos-manufacturados',
  UNIDADES_MEDIDA: '/unidades-medida',
  UPLOADS: '/uploads',
} as const;

// Configuración de paginación
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// Configuración de stock
export const STOCK_CONFIG = {
  CRITICAL_THRESHOLD: 20, // Porcentaje
  LOW_THRESHOLD: 40,      // Porcentaje
  AUTO_REFRESH_INTERVAL: 5 * 60 * 1000, // 5 minutos
} as const;
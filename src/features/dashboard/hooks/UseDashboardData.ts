import { useState, useEffect, useCallback } from "react";
import { ingredienteService } from "../../ingredientes/services/IngredienteService";
import { productoService } from "../../productos/services/ProductoService";
import { categoriaService } from "../../categorias/services/CategoriaService";
import { useNotifications } from "../../../hooks/UseNotification";
import type {
  DashboardMetrics,
  StockAlert,
  ProductAlert,
} from "../../../types/dashboard.types";
import type { ArticuloInsumoResponseDTO } from "../../../types/ingrediente.types";
import type { ArticuloManufacturadoResponseDTO } from "../../../types/producto.types";

export function useDashboardData() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalIngredientes: 0,
    ingredientesStockCritico: 0,
    ingredientesStockBajo: 0,
    totalProductos: 0,
    productosPreparables: 0,
    productosNoPreparables: 0,
    categoriasActivas: 0,
  });

  const [stockAlerts, setStockAlerts] = useState<StockAlert[]>([]);
  const [productAlerts, setProductAlerts] = useState<ProductAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const notifications = useNotifications();

  // Cargar métricas del dashboard
  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        ingredientes,
        productos,
        categorias,
        stockCritico,
        stockBajo,
        productosPreparables,
        productosNoPreparables,
      ] = await Promise.all([
        ingredienteService.getAll(),
        productoService.getAll(),
        categoriaService.getCategoriasPrincipales(),
        ingredienteService.getStockCritico(),
        ingredienteService.getStockBajo(),
        productoService.getPreparables(),
        productoService.getNoPreparables(),
      ]);

      // Calcular métricas
      const newMetrics: DashboardMetrics = {
        totalIngredientes: ingredientes.length,
        ingredientesStockCritico: stockCritico.length,
        ingredientesStockBajo: stockBajo.length,
        totalProductos: productos.length,
        productosPreparables: productosPreparables.length,
        productosNoPreparables: productosNoPreparables.length,
        categoriasActivas: categorias.length,
      };

      setMetrics(newMetrics);

      // Generar alertas de stock
      const newStockAlerts: StockAlert[] = [
        ...stockCritico.map(
          (item): StockAlert => ({
            tipo: "critico" as const,
            articulo: item,
            mensaje: `${item.denominacion} tiene stock crítico (${item.stockActual}/${item.stockMaximo})`,
            prioridad: "alta" as const,
          })
        ),
        ...stockBajo.map(
          (item): StockAlert => ({
            tipo: "bajo" as const,
            articulo: item,
            mensaje: `${item.denominacion} tiene stock bajo (${item.stockActual}/${item.stockMaximo})`,
            prioridad: "media" as const,
          })
        ),
      ];

      setStockAlerts(newStockAlerts);

      // Generar alertas de productos
      const newProductAlerts: ProductAlert[] = [
        ...productosNoPreparables.map(
          (item): ProductAlert => ({
            tipo: "no_preparable" as const,
            producto: item,
            mensaje: `${item.denominacion} no se puede preparar por falta de ingredientes`,
            prioridad: "alta" as const,
          })
        ),
        ...productos
          .filter((p) => p.cantidadIngredientes === 0)
          .map(
            (item): ProductAlert => ({
              tipo: "sin_ingredientes" as const,
              producto: item,
              mensaje: `${item.denominacion} no tiene ingredientes definidos`,
              prioridad: "media" as const,
            })
          ),
        ...productos
          .filter((p) => p.margenGanancia < 1.2) // Margen menor al 20%
          .map(
            (item): ProductAlert => ({
              tipo: "costo_alto" as const,
              producto: item,
              mensaje: `${
                item.denominacion
              } tiene un margen de ganancia muy bajo (${Math.round(
                (item.margenGanancia - 1) * 100
              )}%)`,
              prioridad: "baja" as const,
            })
          ),
      ];

      setProductAlerts(newProductAlerts);
      setLastUpdate(new Date());
    } catch (error) {
      notifications.error("Error al cargar datos del dashboard");
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  // Actualizar datos específicos
  const refreshStockData = useCallback(async () => {
    try {
      const [stockCritico, stockBajo] = await Promise.all([
        ingredienteService.getStockCritico(),
        ingredienteService.getStockBajo(),
      ]);

      setMetrics((prev) => ({
        ...prev,
        ingredientesStockCritico: stockCritico.length,
        ingredientesStockBajo: stockBajo.length,
      }));

      // Actualizar alertas de stock
      const newStockAlerts: StockAlert[] = [
        ...stockCritico.map(
          (item): StockAlert => ({
            tipo: "critico" as const,
            articulo: item,
            mensaje: `${item.denominacion} tiene stock crítico (${item.stockActual}/${item.stockMaximo})`,
            prioridad: "alta" as const,
          })
        ),
        ...stockBajo.map(
          (item): StockAlert => ({
            tipo: "bajo" as const,
            articulo: item,
            mensaje: `${item.denominacion} tiene stock bajo (${item.stockActual}/${item.stockMaximo})`,
            prioridad: "media" as const,
          })
        ),
      ];

      setStockAlerts(newStockAlerts);
    } catch (error) {
      notifications.error("Error al actualizar datos de stock");
    }
  }, [notifications]);

  const refreshProductData = useCallback(async () => {
    try {
      const [preparables, noPreparables] = await Promise.all([
        productoService.getPreparables(),
        productoService.getNoPreparables(),
      ]);

      setMetrics((prev) => ({
        ...prev,
        productosPreparables: preparables.length,
        productosNoPreparables: noPreparables.length,
      }));
    } catch (error) {
      notifications.error("Error al actualizar datos de productos");
    }
  }, [notifications]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    loadDashboardData();

    const interval = setInterval(() => {
      loadDashboardData();
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [loadDashboardData]);

  // Resumen de alertas
  const alertSummary = {
    total: stockAlerts.length + productAlerts.length,
    criticas:
      stockAlerts.filter((a) => a.prioridad === "alta").length +
      productAlerts.filter((a) => a.prioridad === "alta").length,
    stock: stockAlerts.length,
    productos: productAlerts.length,
  };

  return {
    metrics,
    stockAlerts,
    productAlerts,
    alertSummary,
    loading,
    lastUpdate,

    // Acciones
    loadDashboardData,
    refreshStockData,
    refreshProductData,

    // Utilidades
    isDataStale: lastUpdate
      ? Date.now() - lastUpdate.getTime() > 10 * 60 * 1000
      : true, // 10 minutos
  };
}

import { useState, useEffect, useCallback, useMemo } from "react";
import { productoService } from "../services/productoService";
import { ingredienteService } from "../../ingredientes/services/ingredienteService";
import { useApi } from "../../../hooks/useApi";
import { useNotifications } from "../../../hooks/useNotification";
import { useDebounce } from "../../../hooks/useDebounce";
import type {
  ArticuloManufacturadoResponseDTO,
  ArticuloManufacturadoRequestDTO,
  ProductoFilters,
} from "../../../types/producto.types";
import type { ArticuloInsumoResponseDTO } from "../../../types/ingrediente.types";

export function useProductos() {
  const [productos, setProductos] = useState<
    ArticuloManufacturadoResponseDTO[]
  >([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState<
    ArticuloInsumoResponseDTO[]
  >([]);
  const [filters, setFilters] = useState<ProductoFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const notifications = useNotifications();
  const debouncedSearch = useDebounce(searchTerm, 300);

  // API hooks
  const createApi = useApi(productoService.create);
  const updateApi = useApi(productoService.update);
  const deleteApi = useApi(productoService.delete);

  // Cargar datos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [productosData, ingredientesData] = await Promise.all([
        productoService.getAll(),
        ingredienteService.getIngredientes(), // Solo ingredientes (esParaElaborar = true)
      ]);

      setProductos(productosData);
      setIngredientesDisponibles(ingredientesData);
    } catch (error) {
      notifications.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  // Filtrar productos
  const filteredProductos = useMemo(() => {
    let filtered = [...productos];

    // Filtro por búsqueda
    if (debouncedSearch) {
      filtered = filtered.filter((item) =>
        item.denominacion.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Filtros adicionales
    if (filters.idCategoria) {
      filtered = filtered.filter(
        (item) => item.categoria.idCategoria === filters.idCategoria
      );
    }

    if (filters.tiempoMaximo) {
      filtered = filtered.filter(
        (item) => item.tiempoEstimadoEnMinutos <= filters.tiempoMaximo!
      );
    }

    if (filters.precioMin !== undefined) {
      filtered = filtered.filter(
        (item) => item.precioVenta >= filters.precioMin!
      );
    }

    if (filters.precioMax !== undefined) {
      filtered = filtered.filter(
        (item) => item.precioVenta <= filters.precioMax!
      );
    }

    if (filters.preparables !== undefined) {
      filtered = filtered.filter(
        (item) => item.stockSuficiente === filters.preparables
      );
    }

    if (filters.cantidadMinimaIngredientes) {
      filtered = filtered.filter(
        (item) =>
          item.cantidadIngredientes >= filters.cantidadMinimaIngredientes!
      );
    }

    return filtered;
  }, [productos, debouncedSearch, filters]);

  // Métricas de productos
  const productMetrics = useMemo(() => {
    const total = productos.length;
    const preparables = productos.filter((p) => p.stockSuficiente).length;
    const noPreparables = total - preparables;
    const sinIngredientes = productos.filter(
      (p) => p.cantidadIngredientes === 0
    ).length;
    const costoPromedio =
      productos.length > 0
        ? productos.reduce((sum, p) => sum + p.costoTotal, 0) / productos.length
        : 0;

    return {
      total,
      preparables,
      noPreparables,
      sinIngredientes,
      costoPromedio,
    };
  }, [productos]);

  // Crear producto
  const createProducto = useCallback(
    async (producto: ArticuloManufacturadoRequestDTO) => {
      const result = await createApi.execute(producto);
      if (result) {
        notifications.success("Producto creado exitosamente");
        await loadData();
        return result;
      }
      return null;
    },
    [createApi, loadData, notifications]
  );

  // Actualizar producto
  const updateProducto = useCallback(
    async (id: number, producto: ArticuloManufacturadoRequestDTO) => {
      const result = await updateApi.execute(id, producto);
      if (result) {
        notifications.success("Producto actualizado exitosamente");
        await loadData();
        return result;
      }
      return null;
    },
    [updateApi, loadData, notifications]
  );

  // Eliminar producto
  const deleteProducto = useCallback(
    async (id: number) => {
      try {
        // Verificar si se usa en pedidos
        const isUsed = await productoService.seUsaEnPedidos(id);
        if (isUsed) {
          notifications.error(
            "No se puede eliminar un producto que tiene pedidos asociados"
          );
          return false;
        }

        await deleteApi.execute(id);
        notifications.success("Producto eliminado exitosamente");
        await loadData();
        return true;
      } catch (error) {
        notifications.error("Error al eliminar el producto");
        return false;
      }
    },
    [deleteApi, loadData, notifications]
  );

  // Calcular costo total de un producto
  const calculateCosto = useCallback(
    async (id: number) => {
      try {
        const costo = await productoService.getCostoTotal(id);
        return costo;
      } catch (error) {
        notifications.error("Error al calcular el costo");
        return 0;
      }
    },
    [notifications]
  );

  // Obtener precio sugerido
  const getPrecioSugerido = useCallback(
    async (id: number, margen: number) => {
      try {
        const precio = await productoService.getPrecioSugerido(id, margen);
        return precio;
      } catch (error) {
        notifications.error("Error al calcular el precio sugerido");
        return 0;
      }
    },
    [notifications]
  );

  // Cargar al montar
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    productos: filteredProductos,
    allProductos: productos,
    ingredientesDisponibles,
    productMetrics,
    filters,
    searchTerm,
    loading:
      loading ||
      createApi.loading === "loading" ||
      updateApi.loading === "loading" ||
      deleteApi.loading === "loading",
    error: createApi.error || updateApi.error || deleteApi.error,

    // Acciones
    loadData,
    createProducto,
    updateProducto,
    deleteProducto,
    calculateCosto,
    getPrecioSugerido,
    setFilters,
    setSearchTerm,

    // Estados de operaciones
    isCreating: createApi.loading === "loading",
    isUpdating: updateApi.loading === "loading",
    isDeleting: deleteApi.loading === "loading",
  };
}

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  ingredienteService,
  unidadMedidaService,
} from "../services/ingredienteService";
import { useApi } from "../../../hooks/useApi";
import { useNotifications } from "../../../hooks/useNotification";
import { useDebounce } from "../../../hooks/useDebounce";
import type {
  ArticuloInsumoResponseDTO,
  ArticuloInsumoRequestDTO,
  IngredienteFilters,
  UnidadMedida,
  StockStatus,
} from "../../../types/ingrediente.types";

export function useIngredientes() {
  const [ingredientes, setIngredientes] = useState<ArticuloInsumoResponseDTO[]>(
    []
  );
  const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([]);
  const [filters, setFilters] = useState<IngredienteFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const notifications = useNotifications();
  const debouncedSearch = useDebounce(searchTerm, 300);

  // API hooks
  const createApi = useApi(ingredienteService.create);
  const updateApi = useApi(ingredienteService.update);
  const deleteApi = useApi(ingredienteService.delete);
  const updateStockApi = useApi(ingredienteService.actualizarStock);

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ingredientesData, unidadesData] = await Promise.all([
        ingredienteService.getAll(),
        unidadMedidaService.getAll(),
      ]);

      setIngredientes(ingredientesData);
      setUnidadesMedida(unidadesData);
    } catch (error) {
      notifications.error("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  // Filtrar ingredientes
  const filteredIngredientes = useMemo(() => {
    let filtered = [...ingredientes];

    // Filtro por búsqueda
    if (debouncedSearch) {
      filtered = filtered.filter((item) =>
        item.denominacion.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
    }

    // Filtros adicionales
    if (filters.idCategoria) {
      filtered = filtered.filter(
        (item) => item.idCategoria === filters.idCategoria
      );
    }

    if (filters.idUnidadMedida) {
      filtered = filtered.filter(
        (item) => item.idUnidadMedida === filters.idUnidadMedida
      );
    }

    if (filters.esParaElaborar !== undefined) {
      filtered = filtered.filter(
        (item) => item.esParaElaborar === filters.esParaElaborar
      );
    }

    if (filters.estadoStock) {
      filtered = filtered.filter(
        (item) => item.estadoStock === filters.estadoStock
      );
    }

    if (filters.stockCritico) {
      filtered = filtered.filter((item) => item.estadoStock === "CRITICO");
    }

    if (filters.stockBajo) {
      filtered = filtered.filter((item) =>
        ["CRITICO", "BAJO"].includes(item.estadoStock)
      );
    }

    return filtered;
  }, [ingredientes, debouncedSearch, filters]);

  // Métricas de stock
  const stockMetrics = useMemo(() => {
    const total = ingredientes.length;
    const critico = ingredientes.filter(
      (i) => i.estadoStock === "CRITICO"
    ).length;
    const bajo = ingredientes.filter((i) => i.estadoStock === "BAJO").length;
    const normal = ingredientes.filter(
      (i) => i.estadoStock === "NORMAL"
    ).length;
    const alto = ingredientes.filter((i) => i.estadoStock === "ALTO").length;

    return { total, critico, bajo, normal, alto };
  }, [ingredientes]);

  // Crear ingrediente
  const createIngrediente = useCallback(
    async (ingrediente: ArticuloInsumoRequestDTO) => {
      const result = await createApi.execute(ingrediente);
      if (result) {
        notifications.success("Ingrediente creado exitosamente");
        await loadData();
        return result;
      }
      return null;
    },
    [createApi, loadData, notifications]
  );

  // Actualizar ingrediente
  const updateIngrediente = useCallback(
    async (id: number, ingrediente: ArticuloInsumoRequestDTO) => {
      const result = await updateApi.execute(id, ingrediente);
      if (result) {
        notifications.success("Ingrediente actualizado exitosamente");
        await loadData();
        return result;
      }
      return null;
    },
    [updateApi, loadData, notifications]
  );

  // Eliminar ingrediente
  const deleteIngrediente = useCallback(
    async (id: number) => {
      try {
        // Verificar si se usa en productos
        const isUsed = await ingredienteService.isUsedInProducts(id);
        if (isUsed) {
          notifications.error(
            "No se puede eliminar un ingrediente que se usa en productos"
          );
          return false;
        }

        await deleteApi.execute(id);
        notifications.success("Ingrediente eliminado exitosamente");
        await loadData();
        return true;
      } catch (error) {
        notifications.error("Error al eliminar el ingrediente");
        return false;
      }
    },
    [deleteApi, loadData, notifications]
  );

  // Actualizar stock
  const updateStock = useCallback(
    async (id: number, nuevoStock: number) => {
      const result = await updateStockApi.execute(id, nuevoStock);
      if (result) {
        notifications.success("Stock actualizado exitosamente");
        // Actualizar en la lista local
        setIngredientes((prev) =>
          prev.map((item) =>
            item.idArticulo === id
              ? {
                  ...item,
                  stockActual: nuevoStock,
                  porcentajeStock: (nuevoStock / item.stockMaximo) * 100,
                }
              : item
          )
        );
        return result;
      }
      return null;
    },
    [updateStockApi, notifications]
  );

  // Incrementar stock
  const incrementStock = useCallback(
    async (id: number, cantidad: number) => {
      try {
        const result = await ingredienteService.incrementarStock(id, cantidad);
        notifications.success(`Stock incrementado en ${cantidad} unidades`);
        await loadData();
        return result;
      } catch (error) {
        notifications.error("Error al incrementar el stock");
        return null;
      }
    },
    [loadData, notifications]
  );

  // Obtener ingredientes con stock crítico
  const getStockCritico = useCallback(async () => {
    try {
      const data = await ingredienteService.getStockCritico();
      return data;
    } catch (error) {
      notifications.error("Error al obtener ingredientes con stock crítico");
      return [];
    }
  }, [notifications]);

  // Cargar al montar
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    ingredientes: filteredIngredientes,
    allIngredientes: ingredientes,
    unidadesMedida,
    stockMetrics,
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
    createIngrediente,
    updateIngrediente,
    deleteIngrediente,
    updateStock,
    incrementStock,
    getStockCritico,
    setFilters,
    setSearchTerm,

    // Estados de operaciones
    isCreating: createApi.loading === "loading",
    isUpdating: updateApi.loading === "loading",
    isDeleting: deleteApi.loading === "loading",
    isUpdatingStock: updateStockApi.loading === "loading",
  };
}

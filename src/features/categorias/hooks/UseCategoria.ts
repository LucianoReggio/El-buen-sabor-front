import { useState, useEffect, useCallback } from "react";
import { categoriaService } from "../services/categoriaService";
import { useApi } from "../../../hooks/UseApi";
import { useNotifications } from "../../../hooks/UseNotification";
import type {
  CategoriaResponseDTO,
  CategoriaRequestDTO,
  CategoriaTreeNode,
} from "../../../types/categoria.types";

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaResponseDTO[]>([]);
  const [categoriasTree, setCategoriasTree] = useState<CategoriaTreeNode[]>([]);
  const [loading, setLoading] = useState(false);

  const notifications = useNotifications();

  // API hooks
  const createApi = useApi(categoriaService.create);
  const updateApi = useApi(categoriaService.update);
  const deleteApi = useApi(categoriaService.delete);

  // Cargar todas las categorías
  const loadCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoriaService.getAll();
      setCategorias(data);
      setCategoriasTree(buildCategoryTree(data));
    } catch (error) {
      notifications.error("Error al cargar las categorías");
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  // Crear categoría
  const createCategoria = useCallback(
    async (categoria: CategoriaRequestDTO) => {
      const result = await createApi.execute(categoria);
      if (result) {
        notifications.success("Categoría creada exitosamente");
        await loadCategorias();
        return result;
      }
      return null;
    },
    [createApi, loadCategorias, notifications]
  );

  // Actualizar categoría
  const updateCategoria = useCallback(
    async (id: number, categoria: CategoriaRequestDTO) => {
      const result = await updateApi.execute(id, categoria);
      if (result) {
        notifications.success("Categoría actualizada exitosamente");
        await loadCategorias();
        return result;
      }
      return null;
    },
    [updateApi, loadCategorias, notifications]
  );

  // Eliminar categoría
  const deleteCategoria = useCallback(
    async (id: number) => {
      try {
        // Verificar si tiene subcategorías o artículos
        const hasSubcategorias = await categoriaService.hasSubcategorias(id);
        const hasArticulos = await categoriaService.hasArticulos(id);

        if (hasSubcategorias) {
          notifications.error(
            "No se puede eliminar una categoría que tiene subcategorías"
          );
          return false;
        }

        if (hasArticulos) {
          notifications.error(
            "No se puede eliminar una categoría que tiene artículos asociados"
          );
          return false;
        }

        await deleteApi.execute(id);
        notifications.success("Categoría eliminada exitosamente");
        await loadCategorias();
        return true;
      } catch (error) {
        notifications.error("Error al eliminar la categoría");
        return false;
      }
    },
    [deleteApi, loadCategorias, notifications]
  );

  // Buscar categorías
  const searchCategorias = useCallback(
    async (denominacion: string) => {
      try {
        setLoading(true);
        const data = await categoriaService.search({ denominacion });
        setCategorias(data);
      } catch (error) {
        notifications.error("Error al buscar categorías");
      } finally {
        setLoading(false);
      }
    },
    [notifications]
  );

  // Construir árbol de categorías
  const buildCategoryTree = (
    categories: CategoriaResponseDTO[]
  ): CategoriaTreeNode[] => {
    const tree: CategoriaTreeNode[] = [];
    const categoryMap = new Map<number, CategoriaTreeNode>();

    // Crear nodos
    categories.forEach((cat) => {
      const node: CategoriaTreeNode = {
        ...cat,
        children: [],
        level: 0,
        expanded: false,
      };
      categoryMap.set(cat.idCategoria, node);
    });

    // Construir jerarquía
    categories.forEach((cat) => {
      const node = categoryMap.get(cat.idCategoria)!;

      if (cat.categoriaPadre) {
        const parent = categoryMap.get(cat.categoriaPadre.idCategoria);
        if (parent) {
          parent.children.push(node);
          node.level = parent.level + 1;
        }
      } else {
        tree.push(node);
      }
    });

    return tree;
  };

  // Cargar al montar
  useEffect(() => {
    loadCategorias();
  }, [loadCategorias]);

  return {
    categorias,
    categoriasTree,
    loading:
      loading ||
      createApi.loading === "loading" ||
      updateApi.loading === "loading" ||
      deleteApi.loading === "loading",
    error: createApi.error || updateApi.error || deleteApi.error,

    // Acciones
    loadCategorias,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    searchCategorias,

    // Estados de operaciones
    isCreating: createApi.loading === "loading",
    isUpdating: updateApi.loading === "loading",
    isDeleting: deleteApi.loading === "loading",
  };
}

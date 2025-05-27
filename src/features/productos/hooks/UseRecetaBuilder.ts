import { useState, useCallback, useMemo } from "react";
import { useNotifications } from "../../../hooks/UseNotification";
import type {
  RecetaIngrediente,
  ManufacturadoDetalleDTO,
} from "../../../types/producto.types";
import type { ArticuloInsumoResponseDTO } from "../../../types/ingrediente.types";

interface UseRecetaBuilderProps {
  ingredientesDisponibles: ArticuloInsumoResponseDTO[];
  initialReceta?: RecetaIngrediente[];
}

export function useRecetaBuilder({
  ingredientesDisponibles,
  initialReceta = [],
}: UseRecetaBuilderProps) {
  const [receta, setReceta] = useState<RecetaIngrediente[]>(initialReceta);
  const notifications = useNotifications();

  // Agregar ingrediente a la receta
  const addIngrediente = useCallback(
    (ingrediente: ArticuloInsumoResponseDTO, cantidad: number) => {
      // Verificar si ya existe
      const exists = receta.find(
        (item) => item.idArticuloInsumo === ingrediente.idArticulo
      );
      if (exists) {
        notifications.warning("Este ingrediente ya está en la receta");
        return false;
      }

      const nuevoIngrediente: RecetaIngrediente = {
        idArticuloInsumo: ingrediente.idArticulo,
        denominacionInsumo: ingrediente.denominacion,
        unidadMedida: ingrediente.denominacionUnidadMedida,
        precioCompraUnitario: ingrediente.precioCompra,
        cantidad,
        subtotal: cantidad * ingrediente.precioCompra,
      };

      setReceta((prev) => [...prev, nuevoIngrediente]);
      notifications.success(`${ingrediente.denominacion} agregado a la receta`);
      return true;
    },
    [receta, notifications]
  );

  // Actualizar cantidad de un ingrediente
  const updateCantidad = useCallback(
    (idIngrediente: number, nuevaCantidad: number) => {
      if (nuevaCantidad <= 0) {
        notifications.error("La cantidad debe ser mayor a 0");
        return false;
      }

      setReceta((prev) =>
        prev.map((item) =>
          item.idArticuloInsumo === idIngrediente
            ? {
                ...item,
                cantidad: nuevaCantidad,
                subtotal: nuevaCantidad * item.precioCompraUnitario,
              }
            : item
        )
      );
      return true;
    },
    [notifications]
  );

  // Eliminar ingrediente de la receta
  const removeIngrediente = useCallback(
    (idIngrediente: number) => {
      setReceta((prev) =>
        prev.filter((item) => item.idArticuloInsumo !== idIngrediente)
      );
      notifications.success("Ingrediente eliminado de la receta");
    },
    [notifications]
  );

  // Limpiar receta
  const clearReceta = useCallback(() => {
    setReceta([]);
    notifications.info("Receta limpiada");
  }, [notifications]);

  // Cálculos
  const costoTotal = useMemo(() => {
    return receta.reduce((total, item) => total + item.subtotal, 0);
  }, [receta]);

  const cantidadIngredientes = useMemo(() => {
    return receta.length;
  }, [receta]);

  // Validar receta
  const validateReceta = useCallback(() => {
    const errors: string[] = [];

    if (receta.length === 0) {
      errors.push("La receta debe tener al menos un ingrediente");
    }

    receta.forEach((item) => {
      if (item.cantidad <= 0) {
        errors.push(
          `${item.denominacionInsumo}: La cantidad debe ser mayor a 0`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [receta]);

  // Convertir a formato para envío al backend
  const toManufacturadoDetalles = useCallback((): ManufacturadoDetalleDTO[] => {
    return receta.map((item) => ({
      idArticuloInsumo: item.idArticuloInsumo,
      cantidad: item.cantidad,
    }));
  }, [receta]);

  // Calcular precio sugerido con margen
  const calcularPrecioSugerido = useCallback(
    (margenPorcentaje: number) => {
      const margenDecimal = margenPorcentaje / 100;
      return costoTotal * (1 + margenDecimal);
    },
    [costoTotal]
  );

  // Verificar stock suficiente para preparar
  const verificarStockSuficiente = useCallback(
    (cantidadAPreparar: number = 1) => {
      const ingredientesSinStock = receta.filter((item) => {
        const ingrediente = ingredientesDisponibles.find(
          (ing) => ing.idArticulo === item.idArticuloInsumo
        );
        if (!ingrediente) return true;

        const cantidadNecesaria = item.cantidad * cantidadAPreparar;
        return ingrediente.stockActual < cantidadNecesaria;
      });

      return {
        suficiente: ingredientesSinStock.length === 0,
        ingredientesFaltantes: ingredientesSinStock,
      };
    },
    [receta, ingredientesDisponibles]
  );

  // Calcular máximo preparable según stock
  const calcularMaximoPreparable = useCallback(() => {
    if (receta.length === 0) return 0;

    let minimo = Infinity;

    receta.forEach((item) => {
      const ingrediente = ingredientesDisponibles.find(
        (ing) => ing.idArticulo === item.idArticuloInsumo
      );
      if (ingrediente) {
        const posiblePreparar = Math.floor(
          ingrediente.stockActual / item.cantidad
        );
        minimo = Math.min(minimo, posiblePreparar);
      } else {
        minimo = 0;
      }
    });

    return minimo === Infinity ? 0 : minimo;
  }, [receta, ingredientesDisponibles]);

  return {
    receta,
    costoTotal,
    cantidadIngredientes,

    // Acciones
    addIngrediente,
    updateCantidad,
    removeIngrediente,
    clearReceta,
    setReceta,

    // Utilidades
    validateReceta,
    toManufacturadoDetalles,
    calcularPrecioSugerido,
    verificarStockSuficiente,
    calcularMaximoPreparable,

    // Estados calculados
    isEmpty: receta.length === 0,
    isValid: validateReceta().isValid,
    maxPreparable: calcularMaximoPreparable(),
  };
}

import { useState, useEffect, useCallback } from "react";
import { ingredienteService } from "../services/ingredienteService";
import { useNotifications } from "../../../hooks/UseNotification";
import type { ArticuloInsumoResponseDTO } from "../../../types/ingrediente.types";

export function useStockControl() {
  const [stockCritico, setStockCritico] = useState<ArticuloInsumoResponseDTO[]>(
    []
  );
  const [stockBajo, setStockBajo] = useState<ArticuloInsumoResponseDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const notifications = useNotifications();

  const loadStockData = useCallback(async () => {
    try {
      setLoading(true);
      const [critico, bajo] = await Promise.all([
        ingredienteService.getStockCritico(),
        ingredienteService.getStockBajo(),
      ]);

      setStockCritico(critico);
      setStockBajo(bajo);
    } catch (error) {
      notifications.error("Error al cargar datos de stock");
    } finally {
      setLoading(false);
    }
  }, [notifications]);

  const registrarCompra = useCallback(
    async (idIngrediente: number, cantidad: number, precioCompra?: number) => {
      try {
        if (precioCompra) {
          // Si cambió el precio, actualizar primero
          await ingredienteService.update(idIngrediente, {
            precioCompra,
          } as any);
        }

        const result = await ingredienteService.incrementarStock(
          idIngrediente,
          cantidad
        );
        notifications.success("Compra registrada exitosamente");
        await loadStockData();
        return result;
      } catch (error) {
        notifications.error("Error al registrar la compra");
        return null;
      }
    },
    [loadStockData, notifications]
  );

  useEffect(() => {
    loadStockData();
  }, [loadStockData]);

  return {
    stockCritico,
    stockBajo,
    loading,

    // Acciones
    loadStockData,
    registrarCompra,

    // Métricas
    totalAlertas: stockCritico.length + stockBajo.length,
    alertasCriticas: stockCritico.length,
    alertasBajas: stockBajo.length,
  };
}

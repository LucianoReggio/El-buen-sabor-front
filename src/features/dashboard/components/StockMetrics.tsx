import React from "react";
import { Package, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { Card } from "../../../components/layouts/Card";
import { Badge } from "../../../components/ui/Badge";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { Button } from "../../../components/ui/Button";
import type {
  DashboardMetrics,
  StockAlert,
} from "../../../types/dashboard.types";

interface StockMetricsProps {
  metrics: DashboardMetrics;
  stockAlerts: StockAlert[];
  loading: boolean;
  onViewStock?: () => void;
}

export const StockMetrics: React.FC<StockMetricsProps> = ({
  metrics,
  stockAlerts,
  loading,
  onViewStock,
}) => {
  if (loading) {
    return (
      <Card title="Control de Stock">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  const stockCriticoPercentage =
    metrics.totalIngredientes > 0
      ? Math.round(
          (metrics.ingredientesStockCritico / metrics.totalIngredientes) * 100
        )
      : 0;

  const stockBajoPercentage =
    metrics.totalIngredientes > 0
      ? Math.round(
          (metrics.ingredientesStockBajo / metrics.totalIngredientes) * 100
        )
      : 0;

  return (
    <Card
      title="Control de Stock"
      subtitle="Estado actual del inventario"
      actions={
        <Button variant="outline" size="sm" onClick={onViewStock}>
          Ver detalles
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Resumen principal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-900">
              {metrics.totalIngredientes}
            </p>
            <p className="text-sm text-blue-600">Total Ingredientes</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-900">
              {metrics.totalIngredientes -
                metrics.ingredientesStockCritico -
                metrics.ingredientesStockBajo}
            </p>
            <p className="text-sm text-green-600">Stock Normal</p>
          </div>
        </div>

        {/* Alertas de stock */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">Stock Crítico</p>
                <p className="text-sm text-red-600">
                  {stockCriticoPercentage}% del inventario
                </p>
              </div>
            </div>
            <Badge variant="danger" size="lg">
              {metrics.ingredientesStockCritico}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-900">Stock Bajo</p>
                <p className="text-sm text-yellow-600">
                  {stockBajoPercentage}% del inventario
                </p>
              </div>
            </div>
            <Badge variant="warning" size="lg">
              {metrics.ingredientesStockBajo}
            </Badge>
          </div>
        </div>

        {/* Lista de ingredientes más críticos */}
        {stockAlerts.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Ingredientes más críticos
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {stockAlerts.slice(0, 3).map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-900">
                    {alert.articulo.denominacion}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">
                      {alert.articulo.stockActual}/{alert.articulo.stockMaximo}
                    </span>
                    <Badge
                      variant={alert.tipo === "critico" ? "danger" : "warning"}
                      size="sm"
                    >
                      {alert.articulo.porcentajeStock.toFixed(0)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

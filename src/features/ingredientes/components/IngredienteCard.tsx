import React from "react";
import {
  Edit,
  Trash2,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import { formatCurrency } from "../../../utils/formatters";
import type { ArticuloInsumoResponseDTO } from "../../../types/ingrediente.types";

interface IngredienteCardProps {
  ingrediente: ArticuloInsumoResponseDTO;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onUpdateStock?: (id: number, newStock: number) => void;
  onRegisterPurchase?: (ingrediente: ArticuloInsumoResponseDTO) => void;
  showActions?: boolean;
  showStock?: boolean;
}

export const IngredienteCard: React.FC<IngredienteCardProps> = ({
  ingrediente,
  onEdit,
  onDelete,
  onUpdateStock,
  onRegisterPurchase,
  showActions = true,
  showStock = true,
}) => {
  const getStockVariant = (estado: string) => {
    switch (estado) {
      case "CRITICO":
        return "danger";
      case "BAJO":
        return "warning";
      case "NORMAL":
        return "success";
      case "ALTO":
        return "info";
      default:
        return "default";
    }
  };

  const getStockColor = (estado: string) => {
    switch (estado) {
      case "CRITICO":
        return "text-red-600";
      case "BAJO":
        return "text-yellow-600";
      case "NORMAL":
        return "text-green-600";
      case "ALTO":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const margenPorcentaje =
    ingrediente.precioCompra > 0
      ? ((ingrediente.precioVenta - ingrediente.precioCompra) /
          ingrediente.precioCompra) *
        100
      : 0;

  const handleQuickStockUpdate = () => {
    const newStock = prompt(
      `Stock actual: ${ingrediente.stockActual}. Nuevo stock:`,
      ingrediente.stockActual.toString()
    );
    if (newStock && !isNaN(Number(newStock))) {
      onUpdateStock?.(ingrediente.idArticulo, parseInt(newStock));
    }
  };

  return (
    <Card hover className="h-full">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-medium text-gray-900">
                  {ingrediente.denominacion}
                </h3>
                <Badge
                  variant={ingrediente.esParaElaborar ? "info" : "default"}
                  size="sm"
                >
                  {ingrediente.esParaElaborar ? "Ingrediente" : "Producto"}
                </Badge>
              </div>

              <p className="text-sm text-gray-600">
                {ingrediente.denominacionCategoria}
              </p>
            </div>
          </div>

          <Badge variant={getStockVariant(ingrediente.estadoStock)}>
            {ingrediente.estadoStock}
          </Badge>
        </div>

        {/* Stock Visual */}
        {showStock && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Stock</span>
              <span
                className={`text-sm font-medium ${getStockColor(
                  ingrediente.estadoStock
                )}`}
              >
                {ingrediente.stockActual}/{ingrediente.stockMaximo}{" "}
                {ingrediente.denominacionUnidadMedida}
              </span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  ingrediente.porcentajeStock < 20
                    ? "bg-red-500"
                    : ingrediente.porcentajeStock < 40
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${Math.min(ingrediente.porcentajeStock, 100)}%`,
                }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span>{Math.round(ingrediente.porcentajeStock)}%</span>
              <span>{ingrediente.stockMaximo}</span>
            </div>
          </div>
        )}

        {/* Precios */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precio compra:</span>
            <span className="text-sm font-medium">
              {formatCurrency(ingrediente.precioCompra)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precio venta:</span>
            <span className="text-sm font-medium text-green-600">
              {formatCurrency(ingrediente.precioVenta)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Margen:</span>
            <div className="flex items-center gap-1">
              {margenPorcentaje > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  margenPorcentaje < 20
                    ? "text-red-600"
                    : margenPorcentaje < 50
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {margenPorcentaje.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Alertas */}
        {ingrediente.estadoStock === "CRITICO" && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-xs text-red-800 font-medium">
              ⚠️ Stock crítico - Reabastecer urgente
            </div>
          </div>
        )}

        {ingrediente.cantidadProductosQueLoUsan > 0 && (
          <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-xs text-blue-800">
              📝 Usado en {ingrediente.cantidadProductosQueLoUsan} productos
            </div>
          </div>
        )}

        {/* Acciones */}
        {showActions && (
          <div className="space-y-2">
            {/* Acciones de stock */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleQuickStockUpdate}
                icon={<TrendingUp className="h-4 w-4" />}
                className="flex-1"
              >
                Stock
              </Button>

              {onRegisterPurchase && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onRegisterPurchase(ingrediente)}
                  icon={<ShoppingCart className="h-4 w-4" />}
                  className="flex-1"
                >
                  Comprar
                </Button>
              )}
            </div>

            {/* Acciones principales */}
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(ingrediente.idArticulo)}
                  icon={<Edit className="h-4 w-4" />}
                  className="flex-1"
                >
                  Editar
                </Button>
              )}

              {onDelete && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(ingrediente.idArticulo)}
                  icon={<Trash2 className="h-4 w-4 text-red-600" />}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

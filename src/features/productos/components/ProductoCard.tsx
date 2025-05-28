import React from "react";
import {
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  ChefHat,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import { formatCurrency } from "../../../utils/formatters";
import type { ArticuloManufacturadoResponseDTO } from "../../../types/producto.types";

interface ProductoCardProps {
  producto: ArticuloManufacturadoResponseDTO;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onView?: (id: number) => void;
  onViewRecipe?: (id: number) => void;
  showActions?: boolean;
  showMetrics?: boolean;
}

export const ProductoCard: React.FC<ProductoCardProps> = ({
  producto,
  onEdit,
  onDelete,
  onView,
  onViewRecipe,
  showActions = true,
  showMetrics = true,
}) => {
  const margenPorcentaje = Math.round((producto.margenGanancia - 1) * 100);

  return (
    <Card hover className="h-full">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg">
              <ChefHat className="h-5 w-5 text-orange-600" />
            </div>

            <div className="flex-1">
              <h3 className="font-medium text-gray-900 mb-1">
                {producto.denominacion}
              </h3>
              <p className="text-sm text-gray-600">
                {producto.categoria.denominacion}
              </p>

              {producto.descripcion && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {producto.descripcion}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={producto.stockSuficiente ? "success" : "danger"}>
              {producto.stockSuficiente ? "Preparable" : "No Preparable"}
            </Badge>
          </div>
        </div>

        {/* Métricas */}
        {showMetrics && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {producto.tiempoEstimadoEnMinutos}
                </span>
              </div>
              <div className="text-xs text-gray-500">minutos</div>
            </div>

            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">
                  {producto.cantidadIngredientes}
                </span>
              </div>
              <div className="text-xs text-gray-500">ingredientes</div>
            </div>
          </div>
        )}

        {/* Precios */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Costo:</span>
            <span className="text-sm font-medium">
              {formatCurrency(producto.costoTotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Precio:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(producto.precioVenta)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Margen:</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span
                className={`text-sm font-medium ${
                  margenPorcentaje < 20
                    ? "text-red-600"
                    : margenPorcentaje < 50
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}
              >
                {margenPorcentaje}%
              </span>
            </div>
          </div>
        </div>

        {/* Estado de preparabilidad */}
        <div className="mb-4 p-2 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Máximo preparable:</span>
            <span className="font-medium text-gray-900">
              {producto.cantidadMaximaPreparable} unidades
            </span>
          </div>
        </div>

        {/* Acciones */}
        {showActions && (
          <div className="flex gap-2">
            {onViewRecipe && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewRecipe(producto.idArticulo)}
                icon={<Eye className="h-4 w-4" />}
                className="flex-1"
              >
                Receta
              </Button>
            )}

            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(producto.idArticulo)}
                icon={<Edit className="h-4 w-4" />}
              />
            )}

            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(producto.idArticulo)}
                icon={<Trash2 className="h-4 w-4 text-red-600" />}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

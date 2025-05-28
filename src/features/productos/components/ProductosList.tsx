import React from "react";
import {
  Edit,
  Trash2,
  Utensils,
  Clock,
  DollarSign,
  Users,
  ChefHat,
} from "lucide-react";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import { formatCurrency } from "../../../utils/formatters";
import type { TableColumn } from "../../../components/ui/Table";
import type { ArticuloManufacturadoResponseDTO } from "../../../types/producto.types";

interface ProductosListProps {
  productos: ArticuloManufacturadoResponseDTO[];
  loading?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onViewRecipe?: (id: number) => void;
}

export const ProductosList: React.FC<ProductosListProps> = ({
  productos,
  loading = false,
  onEdit,
  onDelete,
  onViewRecipe,
}) => {
  const columns: TableColumn<ArticuloManufacturadoResponseDTO>[] = [
    {
      key: "denominacion",
      label: "Producto",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-2 bg-orange-100 rounded-lg">
            <Utensils className="h-4 w-4 text-orange-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">
              {row.categoria.denominacion}
            </p>
            {row.descripcion && (
              <p className="text-xs text-gray-400 mt-1 max-w-xs truncate">
                {row.descripcion}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "stockSuficiente",
      label: "Estado",
      render: (value, row) => (
        <div className="text-center">
          <Badge variant={value ? "success" : "danger"} className="mb-1">
            {value ? "Preparable" : "No Preparable"}
          </Badge>
          <div className="text-xs text-gray-500">
            Máx: {row.cantidadMaximaPreparable}
          </div>
        </div>
      ),
    },
    {
      key: "cantidadIngredientes",
      label: "Receta",
      render: (value, row) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ChefHat className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{value}</span>
          </div>
          <Badge variant="default" size="sm">
            {value} ingredientes
          </Badge>
        </div>
      ),
    },
    {
      key: "tiempoEstimadoEnMinutos",
      label: "Tiempo",
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{value}</span>
          </div>
          <div className="text-xs text-gray-500">minutos</div>
        </div>
      ),
    },
    {
      key: "costoTotal",
      label: "Costo",
      sortable: true,
      render: (value) => (
        <div className="text-right">
          <span className="text-sm text-gray-600">{formatCurrency(value)}</span>
        </div>
      ),
    },
    {
      key: "precioVenta",
      label: "Precio",
      sortable: true,
      render: (value, row) => (
        <div className="text-right">
          <div className="font-medium text-green-600">
            {formatCurrency(value)}
          </div>
          <div className="text-xs text-gray-500">
            Margen: {Math.round((row.margenGanancia - 1) * 100)}%
          </div>
        </div>
      ),
    },
    {
      key: "cantidadVendida",
      label: "Ventas",
      sortable: true,
      render: (value) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="font-medium">{value || 0}</span>
          </div>
        </div>
      ),
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onViewRecipe?.(row.idArticulo)}
            icon={<ChefHat className="h-4 w-4" />}
            title="Ver receta"
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit?.(row.idArticulo)}
            icon={<Edit className="h-4 w-4" />}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(row.idArticulo)}
            icon={<Trash2 className="h-4 w-4 text-red-600" />}
          />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Table
        data={productos}
        columns={columns}
        loading={loading}
        emptyMessage="No hay productos que coincidan con los filtros"
      />
    </Card>
  );
};

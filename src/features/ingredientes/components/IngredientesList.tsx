import React from "react";
import {
  Edit,
  Trash2,
  ShoppingCart,
  Package,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import { formatCurrency } from "../../../utils/formatters";
import type { TableColumn } from "../../../components/ui/Table";
import type {
  ArticuloInsumoResponseDTO,
  ArticuloInsumoRequestDTO,
} from "../../../types/ingrediente.types";

interface IngredientesListProps {
  ingredientes: ArticuloInsumoResponseDTO[];
  loading?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onUpdateStock?: (id: number, newStock: number) => void;
}

export const IngredientesList: React.FC<IngredientesListProps> = ({
  ingredientes,
  loading = false,
  onEdit,
  onDelete,
  onUpdateStock,
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

  const columns: TableColumn<ArticuloInsumoResponseDTO>[] = [
    {
      key: "denominacion",
      label: "Ingrediente",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
            <Package className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{row.denominacionCategoria}</p>
          </div>
        </div>
      ),
    },
    {
      key: "stockActual",
      label: "Stock",
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="font-bold text-lg">{value}</span>
            <span className="text-gray-500 text-sm">/{row.stockMaximo}</span>
          </div>
          <div className="text-xs text-gray-500">
            {row.denominacionUnidadMedida}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
            <div
              className={`h-2 rounded-full ${
                row.porcentajeStock < 20
                  ? "bg-red-500"
                  : row.porcentajeStock < 40
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(row.porcentajeStock, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "estadoStock",
      label: "Estado",
      sortable: true,
      render: (value, row) => (
        <div className="text-center">
          <Badge variant={getStockVariant(value)} className="mb-1">
            {value}
          </Badge>
          <div className="text-xs text-gray-500">
            {Math.round(row.porcentajeStock)}%
          </div>
        </div>
      ),
    },
    {
      key: "precioCompra",
      label: "Precio Compra",
      sortable: true,
      render: (value) => (
        <div className="text-right">
          <span className="font-medium">{formatCurrency(value)}</span>
        </div>
      ),
    },
    {
      key: "precioVenta",
      label: "Precio Venta",
      sortable: true,
      render: (value) => (
        <div className="text-right">
          <span className="font-medium text-green-600">
            {formatCurrency(value)}
          </span>
        </div>
      ),
    },
    {
      key: "esParaElaborar",
      label: "Tipo",
      render: (value) => (
        <Badge variant={value ? "info" : "default"}>
          {value ? "Ingrediente" : "Producto"}
        </Badge>
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
            onClick={() => {
              const newStock = prompt(
                "Nuevo stock:",
                row.stockActual.toString()
              );
              if (newStock && !isNaN(Number(newStock))) {
                onUpdateStock?.(row.idArticulo, parseInt(newStock));
              }
            }}
            icon={
              row.estadoStock === "CRITICO" ? (
                <TrendingUp className="h-4 w-4 text-red-600" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )
            }
            title="Actualizar stock"
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
        data={ingredientes}
        columns={columns}
        loading={loading}
        emptyMessage="No hay ingredientes que coincidan con los filtros"
      />
    </Card>
  );
};

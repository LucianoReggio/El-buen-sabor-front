import React from "react";
import { Edit, Trash2, ChevronRight } from "lucide-react";
import { Table } from "../../../components/ui/Table";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import type { TableColumn } from "../../../components/ui/Table";
import type { CategoriaResponseDTO } from "../../../types/categoria.types";

interface CategoriasListProps {
  categorias: CategoriaResponseDTO[];
  loading?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const CategoriasList: React.FC<CategoriasListProps> = ({
  categorias,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const columns: TableColumn<CategoriaResponseDTO>[] = [
    {
      key: "denominacion",
      label: "Nombre",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.esSubcategoria && (
            <ChevronRight className="h-4 w-4 text-gray-400" />
          )}
          <span className={row.esSubcategoria ? "ml-4" : "font-medium"}>
            {value}
          </span>
        </div>
      ),
    },
    {
      key: "esSubcategoria",
      label: "Tipo",
      render: (value) => (
        <Badge variant={value ? "info" : "default"}>
          {value ? "Subcategoría" : "Principal"}
        </Badge>
      ),
    },
    {
      key: "categoriaPadre",
      label: "Categoría Padre",
      render: (value) => value?.denominacion || "-",
    },
    {
      key: "subcategorias",
      label: "Subcategorías",
      render: (value) => <Badge variant="default">{value?.length || 0}</Badge>,
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit?.(row.idCategoria)}
            icon={<Edit className="h-4 w-4" />}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(row.idCategoria)}
            icon={<Trash2 className="h-4 w-4" />}
          />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Table
        data={categorias}
        columns={columns}
        loading={loading}
        emptyMessage="No hay categorías registradas"
      />
    </Card>
  );
};

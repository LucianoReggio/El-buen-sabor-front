import React from "react";
import { Edit, Trash2, Plus, Tag } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import type { CategoriaResponseDTO } from "../../../types/categoria.types";

interface CategoriaCardProps {
  categoria: CategoriaResponseDTO;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAddSubcategory?: (parentId: number) => void;
  onViewArticles?: (id: number) => void;
}

export const CategoriaCard: React.FC<CategoriaCardProps> = ({
  categoria,
  onEdit,
  onDelete,
  onAddSubcategory,
  onViewArticles,
}) => {
  return (
    <Card hover className="h-full">
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Tag className="h-5 w-5 text-indigo-600" />
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-medium text-gray-900">
                {categoria.denominacion}
              </h3>
              <Badge variant={categoria.esSubcategoria ? "info" : "default"}>
                {categoria.esSubcategoria ? "Subcategoría" : "Principal"}
              </Badge>
            </div>

            {categoria.categoriaPadre && (
              <p className="text-sm text-gray-600 mb-2">
                Padre: {categoria.categoriaPadre.denominacion}
              </p>
            )}

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{categoria.subcategorias?.length || 0} subcategorías</span>
              <span>• ID: {categoria.idCategoria}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!categoria.esSubcategoria && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onAddSubcategory?.(categoria.idCategoria)}
              icon={<Plus className="h-4 w-4" />}
              title="Agregar subcategoría"
            />
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit?.(categoria.idCategoria)}
            icon={<Edit className="h-4 w-4" />}
          />

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete?.(categoria.idCategoria)}
            icon={<Trash2 className="h-4 w-4 text-red-600" />}
          />
        </div>
      </div>

      {/* Subcategorías preview */}
      {categoria.subcategorias && categoria.subcategorias.length > 0 && (
        <div className="px-4 pb-4">
          <div className="pt-3 border-t border-gray-100">
            <div className="flex flex-wrap gap-1">
              {categoria.subcategorias.slice(0, 3).map((sub) => (
                <Badge key={sub.idCategoria} variant="info" size="sm">
                  {sub.denominacion}
                </Badge>
              ))}
              {categoria.subcategorias.length > 3 && (
                <Badge variant="default" size="sm">
                  +{categoria.subcategorias.length - 3} más
                </Badge>
              )}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

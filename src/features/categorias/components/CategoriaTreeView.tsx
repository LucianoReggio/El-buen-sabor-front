import React, { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import type { CategoriaTreeNode } from "../../../types/categoria.types";

interface CategoriaTreeViewProps {
  categorias: CategoriaTreeNode[];
  loading?: boolean;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  onAddSubcategory?: (parentId: number) => void;
}

export const CategoriaTreeView: React.FC<CategoriaTreeViewProps> = ({
  categorias,
  loading = false,
  onEdit,
  onDelete,
  onAddSubcategory,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());

  const toggleNode = (nodeId: number) => {
    setExpandedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node: CategoriaTreeNode) => {
    const isExpanded = expandedNodes.has(node.idCategoria);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.idCategoria} className="select-none">
        <div
          className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group"
          style={{ paddingLeft: `${node.level * 24 + 12}px` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleNode(node.idCategoria)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            ) : (
              <div className="w-6" />
            )}

            <span className="font-medium text-gray-900">
              {node.denominacion}
            </span>

            {hasChildren && (
              <Badge variant="default" size="sm">
                {node.children.length}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {!node.esSubcategoria && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddSubcategory?.(node.idCategoria)}
                icon={<Plus className="h-3 w-3" />}
                className="text-xs"
              >
                Sub
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit?.(node.idCategoria)}
              icon={<Edit className="h-4 w-4" />}
            />

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete?.(node.idCategoria)}
              icon={<Trash2 className="h-4 w-4" />}
            />
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children.map((child) => renderNode(child))}</div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </Card>
    );
  }

  return (
    <Card>
      {categorias.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🏷️</div>
          <p>No hay categorías registradas</p>
        </div>
      ) : (
        <div className="space-y-1">
          {categorias.map((node) => renderNode(node))}
        </div>
      )}
    </Card>
  );
};

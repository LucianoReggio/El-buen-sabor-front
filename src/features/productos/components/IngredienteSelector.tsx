import React, { useState, useMemo } from "react";
import { Search, Plus, Package } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Card } from "../../../components/layouts/Card";
import { EmptyState } from "../../../components/layouts/EmptyState";
import { formatCurrency } from "../../../utils/formatters";
import type { ArticuloInsumoResponseDTO } from "../../../types/ingrediente.types";

interface IngredienteSelectorProps {
  ingredientes: ArticuloInsumoResponseDTO[];
  selectedIngredientes?: number[];
  onSelect: (ingrediente: ArticuloInsumoResponseDTO) => void;
  onDeselect?: (ingredienteId: number) => void;
  multiSelect?: boolean;
  showStock?: boolean;
  filterByStock?: boolean;
  className?: string;
}

export const IngredienteSelector: React.FC<IngredienteSelectorProps> = ({
  ingredientes,
  selectedIngredientes = [],
  onSelect,
  onDeselect,
  multiSelect = true,
  showStock = true,
  filterByStock = false,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  // Filtrar ingredientes
  const filteredIngredientes = useMemo(() => {
    let filtered = ingredientes;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (ing) =>
          ing.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ing.denominacionCategoria
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (categoryFilter) {
      filtered = filtered.filter(
        (ing) => ing.denominacionCategoria === categoryFilter
      );
    }

    // Filtro por stock (solo disponibles)
    if (filterByStock) {
      filtered = filtered.filter((ing) => ing.stockActual > 0);
    }

    // Excluir ya seleccionados en modo multi-select
    if (multiSelect) {
      filtered = filtered.filter(
        (ing) => !selectedIngredientes.includes(ing.idArticulo)
      );
    }

    return filtered;
  }, [
    ingredientes,
    searchTerm,
    categoryFilter,
    filterByStock,
    selectedIngredientes,
    multiSelect,
  ]);

  // Obtener categorías únicas
  const categorias = useMemo(() => {
    const cats = [
      ...new Set(ingredientes.map((ing) => ing.denominacionCategoria)),
    ];
    return cats.sort();
  }, [ingredientes]);

  const handleSelect = (ingrediente: ArticuloInsumoResponseDTO) => {
    if (!multiSelect) {
      onSelect(ingrediente);
      return;
    }

    if (selectedIngredientes.includes(ingrediente.idArticulo)) {
      onDeselect?.(ingrediente.idArticulo);
    } else {
      onSelect(ingrediente);
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

  return (
    <Card className={className}>
      <div className="space-y-4">
        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            fullWidth
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Estadísticas */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filteredIngredientes.length} ingredientes disponibles</span>
          {multiSelect && selectedIngredientes.length > 0 && (
            <Badge variant="info">
              {selectedIngredientes.length} seleccionados
            </Badge>
          )}
        </div>

        {/* Lista de ingredientes */}
        <div className="max-h-96 overflow-y-auto">
          {filteredIngredientes.length === 0 ? (
            <EmptyState
              title="No hay ingredientes"
              description="No se encontraron ingredientes con los filtros aplicados"
              icon={<Package className="h-8 w-8" />}
            />
          ) : (
            <div className="space-y-2">
              {filteredIngredientes.map((ingrediente) => {
                const isSelected = selectedIngredientes.includes(
                  ingrediente.idArticulo
                );

                return (
                  <div
                    key={ingrediente.idArticulo}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleSelect(ingrediente)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg">
                        <Package className="h-4 w-4 text-gray-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {ingrediente.denominacion}
                          </span>
                          <Badge
                            variant={
                              ingrediente.esParaElaborar ? "info" : "default"
                            }
                            size="sm"
                          >
                            {ingrediente.esParaElaborar
                              ? "Ingrediente"
                              : "Producto"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>{ingrediente.denominacionCategoria}</span>
                          <span>
                            {formatCurrency(ingrediente.precioCompra)}/
                            {ingrediente.denominacionUnidadMedida}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {showStock && (
                        <div className="text-right text-sm">
                          <div
                            className={`font-medium ${getStockColor(
                              ingrediente.estadoStock
                            )}`}
                          >
                            {ingrediente.stockActual}{" "}
                            {ingrediente.denominacionUnidadMedida}
                          </div>
                          <div className="text-xs text-gray-500">
                            {ingrediente.estadoStock}
                          </div>
                        </div>
                      )}

                      <Button
                        size="sm"
                        variant={isSelected ? "primary" : "outline"}
                        icon={<Plus className="h-4 w-4" />}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

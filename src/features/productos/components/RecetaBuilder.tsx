import React, { useState } from "react";
import { Plus, Minus, Trash2, Search } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Card } from "../../../components/layouts/Card";
import { formatCurrency } from "../../../utils/formatters";
import type { RecetaIngrediente } from "../../../types/producto.types";
import type { ArticuloInsumoResponseDTO } from "../../../types/ingrediente.types";

interface RecetaBuilderProps {
  ingredientesDisponibles: ArticuloInsumoResponseDTO[];
  receta: RecetaIngrediente[];
  onAddIngrediente: (
    ingrediente: ArticuloInsumoResponseDTO,
    cantidad: number
  ) => boolean;
  onUpdateCantidad: (idIngrediente: number, nuevaCantidad: number) => boolean;
  onRemoveIngrediente: (idIngrediente: number) => void;
  onClearReceta: () => void;
}

export const RecetaBuilder: React.FC<RecetaBuilderProps> = ({
  ingredientesDisponibles,
  receta,
  onAddIngrediente,
  onUpdateCantidad,
  onRemoveIngrediente,
  onClearReceta,
}) => {
  const [selectedIngredienteId, setSelectedIngredienteId] = useState<
    number | null
  >(null);
  const [cantidad, setCantidad] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar ingredientes disponibles
  const ingredientesFiltrados = ingredientesDisponibles.filter(
    (ing) =>
      ing.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !receta.some((r) => r.idArticuloInsumo === ing.idArticulo)
  );

  const handleAddIngrediente = () => {
    if (!selectedIngredienteId || cantidad <= 0) return;

    const ingrediente = ingredientesDisponibles.find(
      (ing) => ing.idArticulo === selectedIngredienteId
    );
    if (ingrediente) {
      const success = onAddIngrediente(ingrediente, cantidad);
      if (success) {
        setSelectedIngredienteId(null);
        setCantidad(1);
        setSearchTerm("");
      }
    }
  };

  const ingredienteOptions = [
    { value: "", label: "Seleccionar ingrediente..." },
    ...ingredientesFiltrados.map((ing) => ({
      value: ing.idArticulo.toString(),
      label: `${ing.denominacion} (${formatCurrency(ing.precioCompra)}/${
        ing.denominacionUnidadMedida
      })`,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Agregar ingrediente */}
      <Card title="Agregar Ingrediente" padding="sm">
        <div className="space-y-4">
          <Input
            label="Buscar ingrediente"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            fullWidth
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Ingrediente"
              options={ingredienteOptions}
              value={selectedIngredienteId?.toString() || ""}
              onChange={(e) =>
                setSelectedIngredienteId(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
              fullWidth
            />

            <Input
              label="Cantidad"
              type="number"
              step="0.1"
              min="0.1"
              value={cantidad}
              onChange={(e) => setCantidad(parseFloat(e.target.value) || 1)}
              fullWidth
            />

            <div className="flex items-end">
              <Button
                type="button"
                variant="primary"
                onClick={handleAddIngrediente}
                disabled={!selectedIngredienteId || cantidad <= 0}
                icon={<Plus className="h-4 w-4" />}
                fullWidth
              >
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de ingredientes en la receta */}
      <Card
        title={`Receta (${receta.length} ingredientes)`}
        padding="sm"
        actions={
          receta.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={onClearReceta}
              icon={<Trash2 className="h-4 w-4" />}
            >
              Limpiar
            </Button>
          )
        }
      >
        {receta.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🍽️</div>
            <p>Agrega ingredientes para crear la receta</p>
          </div>
        ) : (
          <div className="space-y-3">
            {receta.map((ingrediente) => (
              <div
                key={ingrediente.idArticuloInsumo}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {ingrediente.denominacionInsumo}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(ingrediente.precioCompraUnitario)} por{" "}
                    {ingrediente.unidadMedida}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        onUpdateCantidad(
                          ingrediente.idArticuloInsumo,
                          ingrediente.cantidad + 0.5
                        )
                      }
                      icon={<Plus className="h-3 w-3" />}
                    />
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="font-medium text-green-600">
                      {formatCurrency(ingrediente.subtotal)}
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      onRemoveIngrediente(ingrediente.idArticuloInsumo)
                    }
                    icon={<Trash2 className="h-4 w-4 text-red-600" />}
                  />
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">
                  Costo Total de Ingredientes:
                </span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(
                    receta.reduce((sum, ing) => sum + ing.subtotal, 0)
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

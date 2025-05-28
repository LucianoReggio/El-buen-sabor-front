import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/layouts/Card";
import { formatCurrency } from "../../../utils/formatters";
import type {
  ArticuloInsumoResponseDTO,
  CompraIngredienteFormData,
} from "../../../types/ingrediente.types";

interface CompraIngredienteFormProps {
  ingrediente: ArticuloInsumoResponseDTO;
  onSubmit: (
    idIngrediente: number,
    cantidad: number,
    precioCompra?: number
  ) => Promise<any>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CompraIngredienteForm: React.FC<CompraIngredienteFormProps> = ({
  ingrediente,
  onSubmit,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    cantidad: Math.max(ingrediente.stockMaximo - ingrediente.stockActual, 1),
    precioCompra: ingrediente.precioCompra,
    actualizar: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stockFinal = ingrediente.stockActual + formData.cantidad;
  const costoTotal = formData.cantidad * formData.precioCompra;
  const cambioPrec = formData.precioCompra !== ingrediente.precioCompra;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(
        ingrediente.idArticulo,
        formData.cantidad,
        cambioPrec ? formData.precioCompra : undefined
      );
      onSuccess?.();
    } catch (error) {
      console.error("Error al registrar compra:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información del ingrediente */}
      <Card title="Información del Ingrediente" padding="sm">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Stock actual:</span>
            <span className="ml-2 font-medium">
              {ingrediente.stockActual} {ingrediente.denominacionUnidadMedida}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Stock máximo:</span>
            <span className="ml-2 font-medium">
              {ingrediente.stockMaximo} {ingrediente.denominacionUnidadMedida}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Precio actual:</span>
            <span className="ml-2 font-medium">
              {formatCurrency(ingrediente.precioCompra)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Estado:</span>
            <span
              className={`ml-2 font-medium ${
                ingrediente.estadoStock === "CRITICO"
                  ? "text-red-600"
                  : ingrediente.estadoStock === "BAJO"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {ingrediente.estadoStock}
            </span>
          </div>
        </div>
      </Card>

      {/* Datos de la compra */}
      <Card title="Datos de la Compra" padding="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={`Cantidad a comprar (${ingrediente.denominacionUnidadMedida})`}
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cantidad: parseInt(e.target.value) || 1,
                }))
              }
              required
              fullWidth
            />

            <Input
              label="Precio de compra unitario"
              type="number"
              step="0.01"
              min="0"
              value={formData.precioCompra}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  precioCompra: parseFloat(e.target.value) || 0,
                }))
              }
              required
              fullWidth
            />
          </div>

          {cambioPrec && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <span className="text-sm font-medium">
                  ⚠️ Cambio de precio detectado
                </span>
              </div>
              <div className="text-sm text-yellow-700 mt-1">
                El precio se actualizará de{" "}
                {formatCurrency(ingrediente.precioCompra)} a{" "}
                {formatCurrency(formData.precioCompra)}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Resumen */}
      <Card title="Resumen de la Compra" padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-lg font-bold text-blue-900">{stockFinal}</div>
            <div className="text-sm text-blue-600">Stock Final</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-lg font-bold text-green-900">
              {Math.round((stockFinal / ingrediente.stockMaximo) * 100)}%
            </div>
            <div className="text-sm text-green-600">Nivel de Stock</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(costoTotal)}
            </div>
            <div className="text-sm text-gray-600">Costo Total</div>
          </div>
        </div>

        {stockFinal > ingrediente.stockMaximo && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="text-orange-800 text-sm">
              ⚠️ El stock final ({stockFinal}) superará el máximo permitido (
              {ingrediente.stockMaximo})
            </div>
          </div>
        )}
      </Card>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          icon={<ShoppingCart className="h-4 w-4" />}
        >
          Registrar Compra
        </Button>
      </div>
    </form>
  );
};

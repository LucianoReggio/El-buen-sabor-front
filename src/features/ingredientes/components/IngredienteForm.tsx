import React, { useState, useEffect } from "react";
import { useIngredientes } from "../hooks/useIngredientes";
import { useCategorias } from "../../categorias/hooks/useCategoria";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { AlertMessage } from "../../../components/ui/AlertMessage";
import { Card } from "../../../components/layouts/Card";
import type { ArticuloInsumoRequestDTO } from "../../../types/ingrediente.types";

interface IngredienteFormProps {
  ingredienteId?: number;
  onSubmit: (data: ArticuloInsumoRequestDTO) => Promise<any>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const IngredienteForm: React.FC<IngredienteFormProps> = ({
  ingredienteId,
  onSubmit,
  onSuccess,
  onCancel,
}) => {
  const { unidadesMedida } = useIngredientes();
  const { categorias } = useCategorias();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<ArticuloInsumoRequestDTO>({
    denominacion: "",
    precioVenta: 0,
    idUnidadMedida: 0,
    idCategoria: 0,
    precioCompra: 0,
    stockActual: 0,
    stockMaximo: 0,
    esParaElaborar: true,
  });

  const isEditing = !!ingredienteId;

  useEffect(() => {
    if (ingredienteId) {
      // En un caso real, cargarías los datos del ingrediente
      // const ingrediente = await ingredienteService.getById(ingredienteId);
      // setFormData(mapToRequestDTO(ingrediente));
    }
  }, [ingredienteId]);

  const updateField = (field: keyof ArticuloInsumoRequestDTO, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.denominacion.trim()) {
      newErrors.denominacion = "La denominación es obligatoria";
    }

    if (formData.precioCompra <= 0) {
      newErrors.precioCompra = "El precio de compra debe ser mayor a 0";
    }

    if (formData.precioVenta <= 0) {
      newErrors.precioVenta = "El precio de venta debe ser mayor a 0";
    }

    if (formData.stockActual < 0) {
      newErrors.stockActual = "El stock actual no puede ser negativo";
    }

    if (formData.stockMaximo <= 0) {
      newErrors.stockMaximo = "El stock máximo debe ser mayor a 0";
    }

    if (formData.stockActual > formData.stockMaximo) {
      newErrors.stockActual = "El stock actual no puede ser mayor al máximo";
    }

    if (!formData.idUnidadMedida) {
      newErrors.idUnidadMedida = "Debe seleccionar una unidad de medida";
    }

    if (!formData.idCategoria) {
      newErrors.idCategoria = "Debe seleccionar una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onSuccess?.();
    } catch (error) {
      console.error("Error al guardar ingrediente:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const unidadMedidaOptions = [
    { value: "", label: "Seleccionar unidad" },
    ...unidadesMedida.map((um) => ({
      value: um.idUnidadMedida.toString(),
      label: um.denominacion,
    })),
  ];

  const categoriaOptions = [
    { value: "", label: "Seleccionar categoría" },
    ...categorias.map((cat) => ({
      value: cat.idCategoria.toString(),
      label: cat.denominacion,
    })),
  ];

  const margenCalculado =
    formData.precioCompra > 0
      ? ((formData.precioVenta - formData.precioCompra) /
          formData.precioCompra) *
        100
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <Card title="Información Básica" padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del ingrediente"
            placeholder="Ej: Harina 0000, Queso Mozzarella"
            value={formData.denominacion}
            onChange={(e) => updateField("denominacion", e.target.value)}
            error={errors.denominacion}
            required
            fullWidth
          />

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.esParaElaborar}
                onChange={(e) =>
                  updateField("esParaElaborar", e.target.checked)
                }
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Es para elaborar (ingrediente)
              </span>
            </label>
            <div className="text-xs text-gray-500">
              {formData.esParaElaborar
                ? "Se usa para preparar otros productos"
                : "Es un producto terminado para vender directamente"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Select
            label="Categoría"
            options={categoriaOptions}
            value={formData.idCategoria.toString()}
            onChange={(e) =>
              updateField("idCategoria", parseInt(e.target.value) || 0)
            }
            error={errors.idCategoria}
            required
            fullWidth
          />

          <Select
            label="Unidad de medida"
            options={unidadMedidaOptions}
            value={formData.idUnidadMedida.toString()}
            onChange={(e) =>
              updateField("idUnidadMedida", parseInt(e.target.value) || 0)
            }
            error={errors.idUnidadMedida}
            required
            fullWidth
          />
        </div>
      </Card>

      {/* Precios */}
      <Card title="Precios y Márgenes" padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Precio de compra"
            type="number"
            step="0.01"
            min="0"
            value={formData.precioCompra}
            onChange={(e) =>
              updateField("precioCompra", parseFloat(e.target.value) || 0)
            }
            error={errors.precioCompra}
            required
            fullWidth
          />

          <Input
            label="Precio de venta"
            type="number"
            step="0.01"
            min="0"
            value={formData.precioVenta}
            onChange={(e) =>
              updateField("precioVenta", parseFloat(e.target.value) || 0)
            }
            error={errors.precioVenta}
            required
            fullWidth
          />

          <div className="flex flex-col justify-center">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Margen de ganancia
            </label>
            <div className="p-2 bg-gray-50 rounded-md text-center">
              <span
                className={`text-lg font-bold ${
                  margenCalculado > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {margenCalculado.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {margenCalculado < 20 && formData.precioCompra > 0 && (
          <AlertMessage variant="warning" className="mt-4">
            El margen de ganancia es bajo. Considera ajustar el precio de venta.
          </AlertMessage>
        )}
      </Card>

      {/* Stock */}
      <Card title="Control de Stock" padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Stock actual"
            type="number"
            min="0"
            value={formData.stockActual}
            onChange={(e) =>
              updateField("stockActual", parseInt(e.target.value) || 0)
            }
            error={errors.stockActual}
            required
            fullWidth
          />

          <Input
            label="Stock máximo"
            type="number"
            min="1"
            value={formData.stockMaximo}
            onChange={(e) =>
              updateField("stockMaximo", parseInt(e.target.value) || 0)
            }
            error={errors.stockMaximo}
            required
            fullWidth
          />
        </div>

        {formData.stockMaximo > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex justify-between text-sm mb-2">
              <span>Porcentaje de stock actual</span>
              <span className="font-medium">
                {Math.round(
                  (formData.stockActual / formData.stockMaximo) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(
                    (formData.stockActual / formData.stockMaximo) * 100,
                    100
                  )}%`,
                }}
              />
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

        <Button type="submit" variant="primary" loading={isSubmitting}>
          {isEditing ? "Actualizar" : "Crear"} Ingrediente
        </Button>
      </div>
    </form>
  );
};

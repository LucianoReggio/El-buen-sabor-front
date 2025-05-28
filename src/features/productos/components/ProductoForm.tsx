import React, { useState, useEffect } from "react";
import { useProductos } from "../hooks/useProductos";
import { useCategorias } from "../../categorias/hooks/useCategoria";
import { useRecetaBuilder } from "../hooks/useRecetaBuilder";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { Card } from "../../../components/layouts/Card";
import { RecetaBuilder } from "./RecetaBuilder";
import { CostoCalculator } from "./CostoCalculator";
import type { ArticuloManufacturadoRequestDTO } from "../../../types/producto.types";

interface ProductoFormProps {
  productoId?: number;
  onSubmit: (data: ArticuloManufacturadoRequestDTO) => Promise<any>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  productoId,
  onSubmit,
  onSuccess,
  onCancel,
}) => {
  const { ingredientesDisponibles, loading: loadingProductos } = useProductos();
  const { categorias } = useCategorias();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    denominacion: "",
    descripcion: "",
    tiempoEstimadoEnMinutos: 30,
    preparacion: "",
    idUnidadMedida: 1, // Asumiendo que 1 = "Unidades"
    idCategoria: 0,
    precioVenta: 0,
    margenGanancia: 2.5, // 250%
    calcularPrecio: true,
  });

  const {
    receta,
    costoTotal,
    addIngrediente,
    updateCantidad,
    removeIngrediente,
    clearReceta,
    validateReceta,
    toManufacturadoDetalles,
    calcularPrecioSugerido,
  } = useRecetaBuilder({
    ingredientesDisponibles,
  });

  const isEditing = !!productoId;

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  // Calcular precio automáticamente cuando cambia el costo o margen
  useEffect(() => {
    if (
      formData.calcularPrecio &&
      costoTotal > 0 &&
      formData.margenGanancia > 1
    ) {
      const precioSugerido = calcularPrecioSugerido(formData.margenGanancia);
      setFormData((prev) => ({
        ...prev,
        precioVenta: Math.ceil(precioSugerido),
      }));
    }
  }, [
    costoTotal,
    formData.margenGanancia,
    formData.calcularPrecio,
    calcularPrecioSugerido,
  ]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.denominacion.trim()) {
      newErrors.denominacion = "La denominación es obligatoria";
    }

    if (formData.tiempoEstimadoEnMinutos <= 0) {
      newErrors.tiempoEstimadoEnMinutos = "El tiempo debe ser mayor a 0";
    }

    if (!formData.idCategoria) {
      newErrors.idCategoria = "Debe seleccionar una categoría";
    }

    if (formData.precioVenta <= 0) {
      newErrors.precioVenta = "El precio de venta debe ser mayor a 0";
    }

    const recetaValidation = validateReceta();
    if (!recetaValidation.isValid) {
      newErrors.receta = recetaValidation.errors[0];
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const requestData: ArticuloManufacturadoRequestDTO = {
        denominacion: formData.denominacion.trim(),
        idUnidadMedida: formData.idUnidadMedida,
        idCategoria: formData.idCategoria,
        descripcion: formData.descripcion.trim() || undefined,
        tiempoEstimadoEnMinutos: formData.tiempoEstimadoEnMinutos,
        preparacion: formData.preparacion.trim() || undefined,
        precioVenta: formData.precioVenta,
        detalles: toManufacturadoDetalles(),
      };

      await onSubmit(requestData);
      onSuccess?.();
    } catch (error) {
      console.error("Error al guardar producto:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoriaOptions = [
    { value: "", label: "Seleccionar categoría" },
    ...categorias.map((cat) => ({
      value: cat.idCategoria.toString(),
      label: cat.denominacion,
    })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <Card title="Información Básica" padding="sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nombre del producto"
            placeholder="Ej: Pizza Margarita, Hamburguesa Completa"
            value={formData.denominacion}
            onChange={(e) => updateField("denominacion", e.target.value)}
            error={errors.denominacion}
            required
            fullWidth
          />

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <Input
            label="Descripción"
            placeholder="Descripción del producto..."
            value={formData.descripcion}
            onChange={(e) => updateField("descripcion", e.target.value)}
            fullWidth
          />

          <Input
            label="Tiempo de preparación (minutos)"
            type="number"
            min="1"
            value={formData.tiempoEstimadoEnMinutos}
            onChange={(e) =>
              updateField(
                "tiempoEstimadoEnMinutos",
                parseInt(e.target.value) || 0
              )
            }
            error={errors.tiempoEstimadoEnMinutos}
            required
            fullWidth
          />
        </div>

        <Input
          label="Preparación / Instrucciones"
          placeholder="Pasos para preparar el producto..."
          value={formData.preparacion}
          onChange={(e) => updateField("preparacion", e.target.value)}
          fullWidth
          className="mt-4"
        />
      </Card>

      {/* Constructor de Receta */}
      <Card title="Receta e Ingredientes" padding="sm">
        <RecetaBuilder
          ingredientesDisponibles={ingredientesDisponibles}
          receta={receta}
          onAddIngrediente={addIngrediente}
          onUpdateCantidad={updateCantidad}
          onRemoveIngrediente={removeIngrediente}
          onClearReceta={clearReceta}
        />
        {errors.receta && (
          <div className="text-red-600 text-sm mt-2">{errors.receta}</div>
        )}
      </Card>

      {/* Calculadora de Precios */}
      <Card title="Precios y Costos" padding="sm">
        <CostoCalculator
          costoTotal={costoTotal}
          precioVenta={formData.precioVenta}
          margenGanancia={formData.margenGanancia}
          calcularAutomatico={formData.calcularPrecio}
          onPrecioChange={(precio) => updateField("precioVenta", precio)}
          onMargenChange={(margen) => updateField("margenGanancia", margen)}
          onCalcularToggle={(auto) => updateField("calcularPrecio", auto)}
        />
        {errors.precioVenta && (
          <div className="text-red-600 text-sm mt-2">{errors.precioVenta}</div>
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
          {isEditing ? "Actualizar" : "Crear"} Producto
        </Button>
      </div>
    </form>
  );
};

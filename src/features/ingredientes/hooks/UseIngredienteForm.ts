import { useState, useEffect, useCallback } from "react";
import { useNotifications } from "../../../hooks/useNotification";
import type { ArticuloInsumoRequestDTO } from "../../../types/ingrediente.types";

interface UseIngredienteFormProps {
  ingredienteId?: number;
  onSuccess?: () => void;
  initialData?: Partial<ArticuloInsumoRequestDTO>;
}

export function useIngredienteForm({
  ingredienteId,
  onSuccess,
  initialData,
}: UseIngredienteFormProps = {}) {
  const [formData, setFormData] = useState<ArticuloInsumoRequestDTO>({
    denominacion: "",
    precioVenta: 0,
    idUnidadMedida: 0,
    idCategoria: 0,
    precioCompra: 0,
    stockActual: 0,
    stockMaximo: 0,
    esParaElaborar: true,
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const notifications = useNotifications();

  // Marcar como dirty cuando cambian los datos
  useEffect(() => {
    if (
      ingredienteId ||
      Object.keys(formData).some(
        (key) =>
          formData[key as keyof ArticuloInsumoRequestDTO] !== "" &&
          formData[key as keyof ArticuloInsumoRequestDTO] !== 0
      )
    ) {
      setIsDirty(true);
    }
  }, [formData, ingredienteId]);

  // Validaciones
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.denominacion.trim()) {
      newErrors.denominacion = "La denominación es obligatoria";
    } else if (formData.denominacion.length < 2) {
      newErrors.denominacion =
        "La denominación debe tener al menos 2 caracteres";
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

    // Validar margen de ganancia
    if (formData.precioVenta < formData.precioCompra) {
      newErrors.precioVenta =
        "El precio de venta debe ser mayor al precio de compra";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Actualizar campo
  const updateField = useCallback(
    (field: keyof ArticuloInsumoRequestDTO, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Limpiar error del campo
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Calcular margen de ganancia
  const calcularMargen = useCallback(() => {
    if (formData.precioCompra > 0 && formData.precioVenta > 0) {
      return (
        ((formData.precioVenta - formData.precioCompra) /
          formData.precioCompra) *
        100
      );
    }
    return 0;
  }, [formData.precioCompra, formData.precioVenta]);

  // Calcular porcentaje de stock
  const calcularPorcentajeStock = useCallback(() => {
    if (formData.stockMaximo > 0) {
      return (formData.stockActual / formData.stockMaximo) * 100;
    }
    return 0;
  }, [formData.stockActual, formData.stockMaximo]);

  // Submit
  const handleSubmit = useCallback(
    async (
      onSubmit: (data: ArticuloInsumoRequestDTO) => Promise<any>
    ): Promise<boolean> => {
      setIsSubmitting(true);

      try {
        const isValid = validateForm();
        if (!isValid) {
          notifications.error(
            "Por favor, corrige los errores en el formulario"
          );
          return false;
        }

        const cleanData = {
          ...formData,
          denominacion: formData.denominacion.trim(),
        };

        await onSubmit(cleanData);
        notifications.success(
          `Ingrediente ${ingredienteId ? "actualizado" : "creado"} exitosamente`
        );
        onSuccess?.();
        return true;
      } catch (error: any) {
        notifications.error(error.message || "Error al guardar el ingrediente");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, notifications, onSuccess, ingredienteId]
  );

  // Reset
  const reset = useCallback(() => {
    setFormData({
      denominacion: "",
      precioVenta: 0,
      idUnidadMedida: 0,
      idCategoria: 0,
      precioCompra: 0,
      stockActual: 0,
      stockMaximo: 0,
      esParaElaborar: true,
      ...initialData,
    });
    setErrors({});
    setIsSubmitting(false);
    setIsDirty(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,
    isDirty,

    // Acciones
    updateField,
    handleSubmit,
    reset,
    validateForm,

    // Calculados
    margenGanancia: calcularMargen(),
    porcentajeStock: calcularPorcentajeStock(),

    // Getters para el formulario
    getFieldProps: (field: keyof ArticuloInsumoRequestDTO) => ({
      value: formData[field],
      onChange: (value: any) => updateField(field, value),
      error: errors[field],
    }),

    // Estado del formulario
    isValid: Object.keys(errors).length === 0,
    hasChanges: isDirty,
  };
}

import { useState, useEffect, useCallback } from "react";
import { useNotifications } from "../../../hooks/useNotification";
import type { ArticuloManufacturadoRequestDTO } from "../../../types/producto.types";

interface UseProductoFormProps {
  productoId?: number;
  onSuccess?: () => void;
  initialData?: Partial<ArticuloManufacturadoRequestDTO>;
}

export function useProductoForm({
  productoId,
  onSuccess,
  initialData,
}: UseProductoFormProps = {}) {
  const [formData, setFormData] = useState<ArticuloManufacturadoRequestDTO>({
    denominacion: "",
    idUnidadMedida: 1, // Default: "Unidades"
    idCategoria: 0,
    descripcion: "",
    tiempoEstimadoEnMinutos: 30,
    preparacion: "",
    precioVenta: 0,
    margenGanancia: 2.5,
    detalles: [],
    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const notifications = useNotifications();

  // Marcar como dirty cuando cambian los datos
  useEffect(() => {
    if (
      productoId ||
      Object.keys(formData).some(
        (key) => formData[key as keyof ArticuloManufacturadoRequestDTO] !== ""
      )
    ) {
      setIsDirty(true);
    }
  }, [formData, productoId]);

  // Validaciones
  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.denominacion.trim()) {
      newErrors.denominacion = "La denominación es obligatoria";
    } else if (formData.denominacion.length < 2) {
      newErrors.denominacion =
        "La denominación debe tener al menos 2 caracteres";
    }

    if (!formData.idCategoria) {
      newErrors.idCategoria = "Debe seleccionar una categoría";
    }

    if (formData.tiempoEstimadoEnMinutos <= 0) {
      newErrors.tiempoEstimadoEnMinutos = "El tiempo debe ser mayor a 0";
    }

    if (formData.precioVenta <= 0) {
      newErrors.precioVenta = "El precio de venta debe ser mayor a 0";
    }

    if (!formData.detalles || formData.detalles.length === 0) {
      newErrors.detalles = "Debe agregar al menos un ingrediente";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Actualizar campo
  const updateField = useCallback(
    (field: keyof ArticuloManufacturadoRequestDTO, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Limpiar error del campo
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Calcular precio automáticamente
  const calcularPrecioAutomatico = useCallback(
    (costoTotal: number, margen: number) => {
      if (costoTotal > 0 && margen > 1) {
        const precioSugerido = Math.ceil(costoTotal * margen);
        updateField("precioVenta", precioSugerido);
      }
    },
    [updateField]
  );

  // Submit
  const handleSubmit = useCallback(
    async (
      onSubmit: (data: ArticuloManufacturadoRequestDTO) => Promise<any>
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
          descripcion: formData.descripcion?.trim() || undefined,
          preparacion: formData.preparacion?.trim() || undefined,
        };

        await onSubmit(cleanData);
        notifications.success(
          `Producto ${productoId ? "actualizado" : "creado"} exitosamente`
        );
        onSuccess?.();
        return true;
      } catch (error: any) {
        notifications.error(error.message || "Error al guardar el producto");
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateForm, notifications, onSuccess, productoId]
  );

  // Reset
  const reset = useCallback(() => {
    setFormData({
      denominacion: "",
      idUnidadMedida: 1,
      idCategoria: 0,
      descripcion: "",
      tiempoEstimadoEnMinutos: 30,
      preparacion: "",
      precioVenta: 0,
      margenGanancia: 2.5,
      detalles: [],
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
    calcularPrecioAutomatico,

    // Getters para el formulario
    getFieldProps: (field: keyof ArticuloManufacturadoRequestDTO) => ({
      value: formData[field],
      onChange: (value: any) => updateField(field, value),
      error: errors[field],
    }),

    // Estado del formulario
    isValid: Object.keys(errors).length === 0,
    hasChanges: isDirty,
  };
}

import { useState, useCallback } from "react";
import { useNotifications } from "../../../hooks/useNotification";
import { categoriaService } from "../services/categoriaService";
import type { CategoriaFormData } from "../../../types/categoria.types";

interface UseCategoriaFormProps {
  onSuccess?: () => void;
  initialData?: CategoriaFormData;
}

export function useCategoriaForm({
  onSuccess,
  initialData,
}: UseCategoriaFormProps = {}) {
  const [formData, setFormData] = useState<CategoriaFormData>(
    initialData || {
      denominacion: "",
      esSubcategoria: false,
      idCategoriaPadre: undefined,
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const notifications = useNotifications();

  // Validaciones
  const validateForm = useCallback(
    async (data: CategoriaFormData): Promise<boolean> => {
      const newErrors: Record<string, string> = {};

      // Validar denominación
      if (!data.denominacion.trim()) {
        newErrors.denominacion = "La denominación es obligatoria";
      } else if (data.denominacion.length < 2) {
        newErrors.denominacion =
          "La denominación debe tener al menos 2 caracteres";
      } else {
        // Verificar si ya existe
        try {
          const exists = await categoriaService.existsByDenominacion(
            data.denominacion
          );
          if (exists) {
            newErrors.denominacion = "Ya existe una categoría con este nombre";
          }
        } catch (error) {
          console.error("Error al verificar existencia:", error);
        }
      }

      // Validar categoría padre si es subcategoría
      if (data.esSubcategoria && !data.idCategoriaPadre) {
        newErrors.idCategoriaPadre = "Debe seleccionar una categoría padre";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    []
  );

  // Actualizar campo
  const updateField = useCallback(
    (field: keyof CategoriaFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Limpiar error del campo
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors]
  );

  // Submit
  const handleSubmit = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      const isValid = await validateForm(formData);
      if (!isValid) {
        return false;
      }

      const requestData = {
        denominacion: formData.denominacion.trim(),
        esSubcategoria: formData.esSubcategoria,
        idCategoriaPadre: formData.esSubcategoria
          ? formData.idCategoriaPadre
          : undefined,
      };

      // Aquí se llamaría al servicio (se hace desde el componente padre)
      onSuccess?.();
      return true;
    } catch (error) {
      notifications.error("Error al procesar el formulario");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSuccess, notifications]);

  // Reset
  const reset = useCallback(() => {
    setFormData(
      initialData || {
        denominacion: "",
        esSubcategoria: false,
        idCategoriaPadre: undefined,
      }
    );
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    formData,
    errors,
    isSubmitting,

    // Acciones
    updateField,
    handleSubmit,
    reset,
    validateForm,

    // Getters para el formulario
    getFieldProps: (field: keyof CategoriaFormData) => ({
      value: formData[field],
      onChange: (value: any) => updateField(field, value),
      error: errors[field],
    }),
  };
}

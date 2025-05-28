import React, { useEffect } from "react";
import { useCategoriaForm } from "../hooks/useCategoriaForm";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";
import { AlertMessage } from "../../../components/ui/AlertMessage";
import type {
  CategoriaRequestDTO,
  CategoriaResponseDTO,
} from "../../../types/categoria.types";

interface CategoriaFormProps {
  categoriaId?: number;
  categoriasPadre?: CategoriaResponseDTO[];
  onSubmit: (data: CategoriaRequestDTO) => Promise<any>;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CategoriaForm: React.FC<CategoriaFormProps> = ({
  categoriaId,
  categoriasPadre = [],
  onSubmit,
  onSuccess,
  onCancel,
}) => {
  const isEditing = !!categoriaId;

  const { formData, errors, isSubmitting, updateField, reset } =
    useCategoriaForm({
      onSuccess,
      // En un caso real, cargarías los datos iniciales del categoriaId
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const requestData: CategoriaRequestDTO = {
        denominacion: formData.denominacion.trim(),
        esSubcategoria: formData.esSubcategoria,
        idCategoriaPadre: formData.esSubcategoria
          ? formData.idCategoriaPadre
          : undefined,
      };

      await onSubmit(requestData);
    } catch (error) {
      console.error("Error al enviar formulario:", error);
    }
  };

  const categoriasPadreOptions = [
    { value: "", label: "Seleccionar categoría padre" },
    ...categoriasPadre
      .filter((cat) => !cat.esSubcategoria && cat.idCategoria !== categoriaId)
      .map((cat) => ({
        value: cat.idCategoria.toString(),
        label: cat.denominacion,
      })),
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Nombre de la categoría"
          placeholder="Ej: Pizzas, Bebidas, Carnes"
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
              checked={formData.esSubcategoria}
              onChange={(e) => updateField("esSubcategoria", e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Es una subcategoría
            </span>
          </label>

          {formData.esSubcategoria && (
            <Select
              label="Categoría padre"
              options={categoriasPadreOptions}
              value={formData.idCategoriaPadre?.toString() || ""}
              onChange={(e) =>
                updateField(
                  "idCategoriaPadre",
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              error={errors.idCategoriaPadre}
              required
              fullWidth
            />
          )}
        </div>

        {formData.esSubcategoria && !formData.idCategoriaPadre && (
          <AlertMessage variant="info">
            Las subcategorías deben tener una categoría padre asignada.
          </AlertMessage>
        )}
      </div>

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
          {isEditing ? "Actualizar" : "Crear"} Categoría
        </Button>
      </div>
    </form>
  );
};

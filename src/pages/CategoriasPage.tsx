import React, { useState } from "react";
import { Plus, Filter, TreePine, List } from "lucide-react";
import { useCategorias } from "../features/categorias/hooks/useCategoria";
import { PageContainer } from "../components/layouts/PageContainer";
import { Card } from "../components/layouts/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import { CategoriasList } from "../features/categorias/components/CategoriaList";
import { CategoriaTreeView } from "../features/categorias/components/CategoriaTreeView";
import { CategoriaForm } from "../features/categorias/components/CategoriaForm";

type ViewMode = "list" | "tree";

export const CategoriasPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("tree");
  const [searchTerm, setSearchTerm] = useState("");

  const {
    categorias,
    categoriasTree,
    loading,
    createCategoria,
    updateCategoria,
    deleteCategoria,
    searchCategorias,
  } = useCategorias();

  const breadcrumbs = [
    { label: "Inicio", href: "/dashboard" },
    { label: "Categorías", current: true },
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchCategorias(term);
    }
  };

  const categoriasPrincipales = categorias.filter((cat) => !cat.esSubcategoria);
  const subcategorias = categorias.filter((cat) => cat.esSubcategoria);

  return (
    <PageContainer
      title="Gestión de Categorías"
      subtitle={`${categoriasPrincipales.length} categorías principales, ${subcategorias.length} subcategorías`}
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-3">
          <div className="flex border border-gray-300 rounded-md">
            <Button
              variant={viewMode === "tree" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("tree")}
              icon={<TreePine className="h-4 w-4" />}
              className="rounded-r-none border-r-0"
            >
              Árbol
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              icon={<List className="h-4 w-4" />}
              className="rounded-l-none"
            >
              Lista
            </Button>
          </div>

          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Nueva Categoría
          </Button>
        </div>
      }
    >
      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {categorias.length}
          </div>
          <div className="text-sm text-gray-600">Total Categorías</div>
        </Card>

        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {categoriasPrincipales.length}
          </div>
          <div className="text-sm text-gray-600">Principales</div>
        </Card>

        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {subcategorias.length}
          </div>
          <div className="text-sm text-gray-600">Subcategorías</div>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card className="mb-6">
        <Input
          placeholder="Buscar categorías..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          fullWidth
        />
      </Card>

      {/* Vista de Categorías */}
      {viewMode === "tree" ? (
        <CategoriaTreeView
          categorias={categoriasTree}
          loading={loading}
          onEdit={setEditingId}
          onDelete={deleteCategoria}
        />
      ) : (
        <CategoriasList
          categorias={categorias}
          loading={loading}
          onEdit={setEditingId}
          onDelete={deleteCategoria}
        />
      )}

      {/* Modal Crear Categoría */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nueva Categoría"
        size="md"
      >
        <CategoriaForm
          onSubmit={createCategoria}
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
          categoriasPadre={categoriasPrincipales}
        />
      </Modal>

      {/* Modal Editar Categoría */}
      <Modal
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        title="Editar Categoría"
        size="md"
      >
        {editingId && (
          <CategoriaForm
            categoriaId={editingId}
            onSubmit={(data) => updateCategoria(editingId, data)}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
            categoriasPadre={categoriasPrincipales}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

import React, { useState } from 'react';
import { Plus, Filter, Download, Upload } from 'lucide-react';
import { useIngredientes } from '../features/ingredientes/hooks/UseIngredientes';
import { useCategorias } from '../features/categorias/hooks/UseCategoria';
import { PageContainer } from '../components/layouts/PageContainer';
import { Card } from '../components/layouts/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { IngredientesList } from '../features/ingredientes/components/IngredientesList';
import { IngredienteForm } from '../features/ingredientes/components/IngredienteForm';
import { StockControlPanel } from '../features/ingredientes/components/StockControlPanel';
import type { IngredienteFilters } from '../types/ingrediente.types';

export const IngredientesPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    ingredientes,
    stockMetrics,
    filters,
    searchTerm,
    loading,
    createIngrediente,
    updateIngrediente,
    deleteIngrediente,
    updateStock,
    setFilters,
    setSearchTerm,
  } = useIngredientes();

  const { categorias } = useCategorias();

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Ingredientes', current: true },
  ];

  const handleFilterChange = (key: keyof IngredienteFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
  };

  const handleEditSuccess = () => {
    setEditingId(null);
  };

  const stockStatusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'CRITICO', label: 'Stock crítico' },
    { value: 'BAJO', label: 'Stock bajo' },
    { value: 'NORMAL', label: 'Stock normal' },
    { value: 'ALTO', label: 'Stock alto' },
  ];

  const categoriaOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categorias.map(cat => ({
      value: cat.idCategoria.toString(),
      label: cat.denominacion,
    })),
  ];

  return (
    <PageContainer
      title="Gestión de Ingredientes"
      subtitle={`${ingredientes.length} ingredientes registrados`}
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="h-4 w-4" />}
          >
            Filtros
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            icon={<Download className="h-4 w-4" />}
          >
            Exportar
          </Button>
          
          <Button
            variant="primary"
            onClick={() => setShowCreateModal(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Nuevo Ingrediente
          </Button>
        </div>
      }
    >
      {/* Métricas de Stock */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stockMetrics.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
        
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-red-600">{stockMetrics.critico}</div>
          <div className="text-sm text-gray-600">Crítico</div>
        </Card>
        
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{stockMetrics.bajo}</div>
          <div className="text-sm text-gray-600">Bajo</div>
        </Card>
        
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">{stockMetrics.normal}</div>
          <div className="text-sm text-gray-600">Normal</div>
        </Card>
      </div>

      {/* Búsqueda y Filtros */}
      <Card className="mb-6">
        <div className="space-y-4">
          {/* Búsqueda principal */}
          <Input
            placeholder="Buscar ingredientes por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />

          {/* Filtros expandibles */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <Select
                label="Estado de Stock"
                options={stockStatusOptions}
                value={filters.estadoStock || ''}
                onChange={(e) => handleFilterChange('estadoStock', e.target.value || undefined)}
                fullWidth
              />
              
              <Select
                label="Categoría"
                options={categoriaOptions}
                value={filters.idCategoria?.toString() || ''}
                onChange={(e) => handleFilterChange('idCategoria', e.target.value ? parseInt(e.target.value) : undefined)}
                fullWidth
              />
              
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('esParaElaborar', true)}
                  className={filters.esParaElaborar === true ? 'bg-blue-50 border-blue-300' : ''}
                >
                  Solo Ingredientes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleFilterChange('esParaElaborar', false)}
                  className={filters.esParaElaborar === false ? 'bg-blue-50 border-blue-300' : ''}
                >
                  Solo Productos
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Panel de Control de Stock */}
      {(stockMetrics.critico > 0 || stockMetrics.bajo > 0) && (
        <StockControlPanel className="mb-6" />
      )}

      {/* Lista de Ingredientes */}
      <IngredientesList
        ingredientes={ingredientes}
        loading={loading}
        onEdit={setEditingId}
        onDelete={deleteIngrediente}
        onUpdateStock={updateStock}
      />

      {/* Modal Crear Ingrediente */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nuevo Ingrediente"
        size="lg"
      >
        <IngredienteForm
          onSubmit={createIngrediente}
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Modal Editar Ingrediente */}
      <Modal
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        title="Editar Ingrediente"
        size="lg"
      >
        {editingId && (
          <IngredienteForm
            ingredienteId={editingId}
            onSubmit={(data) => updateIngrediente(editingId, data)}
            onSuccess={handleEditSuccess}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

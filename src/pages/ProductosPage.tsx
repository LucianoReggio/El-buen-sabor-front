import React, { useState } from 'react';
import { Plus, Filter, Download, Calculator } from 'lucide-react';
import { useProductos } from '../features/productos/hooks/UseProductos';
import { useCategorias } from '../features/categorias/hooks/UseCategoria';
import { PageContainer } from '../components/layouts/PageContainer';
import { Card } from '../components/layouts/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { ProductosList } from '../features/productos/components/ProductosList';
import { ProductoForm } from '../features/productos/components/ProductoForm';
import { CostoCalculator } from '../features/productos/components/CostoCalculator';
import type { ProductoFilters } from '../types/producto.types';

export const ProductosPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    productos,
    productMetrics,
    filters,
    searchTerm,
    loading,
    createProducto,
    updateProducto,
    deleteProducto,
    setFilters,
    setSearchTerm,
  } = useProductos();

  const { categorias } = useCategorias();

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Productos', current: true },
  ];

  const handleFilterChange = (key: keyof ProductoFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const categoriaOptions = [
    { value: '', label: 'Todas las categorías' },
    ...categorias.map(cat => ({
      value: cat.idCategoria.toString(),
      label: cat.denominacion,
    })),
  ];

  const preparabilidadOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'true', label: 'Solo preparables' },
    { value: 'false', label: 'Solo no preparables' },
  ];

  return (
    <PageContainer
      title="Gestión de Productos"
      subtitle={`${productos.length} productos manufacturados`}
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(true)}
            icon={<Calculator className="h-4 w-4" />}
          >
            Calculadora
          </Button>
          
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
            Nuevo Producto
          </Button>
        </div>
      }
    >
      {/* Métricas de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-purple-600">{productMetrics.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </Card>
        
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-green-600">{productMetrics.preparables}</div>
          <div className="text-sm text-gray-600">Preparables</div>
        </Card>
        
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-red-600">{productMetrics.noPreparables}</div>
          <div className="text-sm text-gray-600">No Preparables</div>
        </Card>
        
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-orange-600">{productMetrics.sinIngredientes}</div>
          <div className="text-sm text-gray-600">Sin Receta</div>
        </Card>
      </div>

      {/* Búsqueda y Filtros */}
      <Card className="mb-6">
        <div className="space-y-4">
          <Input
            placeholder="Buscar productos por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            fullWidth
          />

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
              <Select
                label="Categoría"
                options={categoriaOptions}
                value={filters.idCategoria?.toString() || ''}
                onChange={(e) => handleFilterChange('idCategoria', e.target.value ? parseInt(e.target.value) : undefined)}
                fullWidth
              />
              
              <Select
                label="Preparabilidad"
                options={preparabilidadOptions}
                value={filters.preparables?.toString() || ''}
                onChange={(e) => handleFilterChange('preparables', e.target.value ? e.target.value === 'true' : undefined)}
                fullWidth
              />
              
              <Input
                label="Tiempo máximo (min)"
                type="number"
                value={filters.tiempoMaximo || ''}
                onChange={(e) => handleFilterChange('tiempoMaximo', e.target.value ? parseInt(e.target.value) : undefined)}
                fullWidth
              />
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Precio</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Mín"
                    type="number"
                    value={filters.precioMin || ''}
                    onChange={(e) => handleFilterChange('precioMin', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                  <Input
                    placeholder="Máx"
                    type="number"
                    value={filters.precioMax || ''}
                    onChange={(e) => handleFilterChange('precioMax', e.target.value ? parseFloat(e.target.value) : undefined)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Lista de Productos */}
      <ProductosList
        productos={productos}
        loading={loading}
        onEdit={setEditingId}
        onDelete={deleteProducto}
      />

      {/* Modal Crear Producto */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Nuevo Producto"
        size="xl"
      >
        <ProductoForm
          onSubmit={createProducto}
          onSuccess={() => setShowCreateModal(false)}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Modal Editar Producto */}
      <Modal
        isOpen={editingId !== null}
        onClose={() => setEditingId(null)}
        title="Editar Producto"
        size="xl"
      >
        {editingId && (
          <ProductoForm
            productoId={editingId}
            onSubmit={(data) => updateProducto(editingId, data)}
            onSuccess={() => setEditingId(null)}
            onCancel={() => setEditingId(null)}
          />
        )}
      </Modal>

      {/* Modal Calculadora de Costos */}
      <Modal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        title="Calculadora de Costos"
        size="lg"
      >
        <CostoCalculator />
      </Modal>
    </PageContainer>
  );
};

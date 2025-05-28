import React, { useState } from "react";
import { AlertTriangle, Package, ShoppingCart, TrendingUp } from "lucide-react";
import { useStockControl } from "../features/ingredientes/hooks/useStockControl";
import { useIngredientes } from "../features/ingredientes/hooks/useIngredientes";
import { PageContainer } from "../components/layouts/PageContainer";
import { Card } from "../components/layouts/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { Table } from "../components/ui/Table";
import { CompraIngredienteForm } from "../features/ingredientes/components/CompraIngredienteForm";
import type { TableColumn } from "../components/ui/Table";
import type { ArticuloInsumoResponseDTO } from "../types/ingrediente.types";

export const StockControlPage: React.FC = () => {
  const [showCompraModal, setShowCompraModal] = useState(false);
  const [selectedIngrediente, setSelectedIngrediente] =
    useState<ArticuloInsumoResponseDTO | null>(null);

  const {
    stockCritico,
    stockBajo,
    loading,
    totalAlertas,
    alertasCriticas,
    alertasBajas,
    registrarCompra,
  } = useStockControl();

  const { updateStock } = useIngredientes();

  const breadcrumbs = [
    { label: "Inicio", href: "/dashboard" },
    { label: "Control de Stock", current: true },
  ];

  const handleRegistrarCompra = (ingrediente: ArticuloInsumoResponseDTO) => {
    setSelectedIngrediente(ingrediente);
    setShowCompraModal(true);
  };

  const handleCompraSuccess = () => {
    setShowCompraModal(false);
    setSelectedIngrediente(null);
  };

  const stockCriticoColumns: TableColumn<ArticuloInsumoResponseDTO>[] = [
    {
      key: "denominacion",
      label: "Ingrediente",
      sortable: true,
    },
    {
      key: "denominacionCategoria",
      label: "Categoría",
      sortable: true,
    },
    {
      key: "stockActual",
      label: "Stock Actual",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{value}</span>
          <span className="text-gray-500 text-sm">
            {row.denominacionUnidadMedida}
          </span>
        </div>
      ),
    },
    {
      key: "stockMaximo",
      label: "Stock Máximo",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span>{value}</span>
          <span className="text-gray-500 text-sm">
            {row.denominacionUnidadMedida}
          </span>
        </div>
      ),
    },
    {
      key: "porcentajeStock",
      label: "Porcentaje",
      sortable: true,
      render: (value) => (
        <Badge
          variant={value < 20 ? "danger" : value < 40 ? "warning" : "success"}
        >
          {Math.round(value)}%
        </Badge>
      ),
    },
    {
      key: "precioCompra",
      label: "Precio Compra",
      render: (value) => `$${value.toLocaleString()}`,
    },
    {
      key: "actions",
      label: "Acciones",
      render: (_, row) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleRegistrarCompra(row)}
            icon={<ShoppingCart className="h-4 w-4" />}
          >
            Comprar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Control de Stock"
      subtitle="Monitoreo y gestión de inventario"
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Package className="h-4 w-4" />}
          >
            Exportar Reporte
          </Button>
        </div>
      }
    >
      {/* Resumen de Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-red-600">{totalAlertas}</div>
          <div className="text-sm text-gray-600">Total Alertas</div>
        </Card>

        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-red-700">
            {alertasCriticas}
          </div>
          <div className="text-sm text-gray-600">Stock Crítico</div>
        </Card>

        <Card padding="sm" className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {alertasBajas}
          </div>
          <div className="text-sm text-gray-600">Stock Bajo</div>
        </Card>
      </div>

      {/* Stock Crítico */}
      {stockCritico.length > 0 && (
        <Card
          title="Stock Crítico"
          subtitle="Ingredientes que requieren reposición inmediata"
          className="mb-6"
          actions={
            <Badge variant="danger" size="lg">
              {stockCritico.length} ingredientes
            </Badge>
          }
        >
          <Table
            data={stockCritico}
            columns={stockCriticoColumns}
            loading={loading}
            emptyMessage="No hay ingredientes con stock crítico"
          />
        </Card>
      )}

      {/* Stock Bajo */}
      {stockBajo.length > 0 && (
        <Card
          title="Stock Bajo"
          subtitle="Ingredientes que necesitan ser reabastecidos pronto"
          actions={
            <Badge variant="warning" size="lg">
              {stockBajo.length} ingredientes
            </Badge>
          }
        >
          <Table
            data={stockBajo}
            columns={stockCriticoColumns}
            loading={loading}
            emptyMessage="No hay ingredientes con stock bajo"
          />
        </Card>
      )}

      {/* Estado sin alertas */}
      {totalAlertas === 0 && !loading && (
        <Card className="text-center py-12">
          <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            ¡Excelente! Todo el stock está en niveles normales
          </h3>
          <p className="text-gray-600">
            No hay ingredientes con stock crítico o bajo en este momento.
          </p>
        </Card>
      )}

      {/* Modal Registrar Compra */}
      <Modal
        isOpen={showCompraModal}
        onClose={() => setShowCompraModal(false)}
        title={`Registrar Compra - ${selectedIngrediente?.denominacion}`}
        size="md"
      >
        {selectedIngrediente && (
          <CompraIngredienteForm
            ingrediente={selectedIngrediente}
            onSubmit={registrarCompra}
            onSuccess={handleCompraSuccess}
            onCancel={() => setShowCompraModal(false)}
          />
        )}
      </Modal>
    </PageContainer>
  );
};

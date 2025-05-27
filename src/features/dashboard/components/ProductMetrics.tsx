import React from 'react';
import { Utensils, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card } from '../../../components/layouts/Card';
import { Badge } from '../../../components/ui/Badge';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { Button } from '../../../components/ui/Button';
import type { DashboardMetrics, ProductAlert } from '../../../types/dashboard.types';

interface ProductMetricsProps {
  metrics: DashboardMetrics;
  productAlerts: ProductAlert[];
  loading: boolean;
  onViewProducts?: () => void;
}

export const ProductMetrics: React.FC<ProductMetricsProps> = ({
  metrics,
  productAlerts,
  loading,
  onViewProducts,
}) => {
  if (loading) {
    return (
      <Card title="Estado de Productos">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  const preparablesPercentage = metrics.totalProductos > 0 
    ? Math.round((metrics.productosPreparables / metrics.totalProductos) * 100)
    : 0;

  return (
    <Card
      title="Estado de Productos"
      subtitle="Disponibilidad para preparación"
      actions={
        <Button
          variant="outline"
          size="sm"
          onClick={onViewProducts}
        >
          Ver productos
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Resumen principal */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Utensils className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-900">{metrics.totalProductos}</p>
            <p className="text-sm text-purple-600">Total Productos</p>
          </div>
          
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <Clock className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-indigo-900">{metrics.categoriasActivas}</p>
            <p className="text-sm text-indigo-600">Categorías Activas</p>
          </div>
        </div>

        {/* Estados de preparación */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Preparables</p>
                <p className="text-sm text-green-600">{preparablesPercentage}% del menú</p>
              </div>
            </div>
            <Badge variant="success" size="lg">
              {metrics.productosPreparables}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-900">No Preparables</p>
                <p className="text-sm text-red-600">Sin stock suficiente</p>
              </div>
            </div>
            <Badge variant="danger" size="lg">
              {metrics.productosNoPreparables}
            </Badge>
          </div>
        </div>

        {/* Productos con problemas */}
        {productAlerts.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Productos con problemas</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {productAlerts.slice(0, 3).map((alert, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-900">{alert.producto.denominacion}</span>
                  <Badge 
                    variant={
                      alert.tipo === 'no_preparable' ? 'danger' :
                      alert.tipo === 'sin_ingredientes' ? 'warning' : 
                      'info'
                    } 
                    size="sm"
                  >
                    {alert.tipo === 'no_preparable' ? 'Sin stock' :
                     alert.tipo === 'sin_ingredientes' ? 'Sin receta' :
                     'Margen bajo'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
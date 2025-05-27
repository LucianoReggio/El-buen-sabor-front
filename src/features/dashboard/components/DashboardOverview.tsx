import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useDashboardData } from '../hooks/UseDashboardData';
import { PageContainer } from '../../../components/layouts/PageContainer';
import { Card } from '../../../components/layouts/Card';
import { Button } from '../../../components/ui/Button';
import { StockMetrics } from './StockMetrics';
import { ProductMetrics } from './ProductMetrics';
import { AlertsPanel } from './AlertsPanel';
import { QuickActions } from './QuickActions';
import { RecentActivity } from './RecentActivity';

export const DashboardOverview: React.FC = () => {
  const {
    metrics,
    stockAlerts,
    productAlerts,
    alertSummary,
    loading,
    lastUpdate,
    loadDashboardData,
    isDataStale,
  } = useDashboardData();

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Dashboard', current: true },
  ];

  const formatLastUpdate = (date: Date | null) => {
    if (!date) return 'Nunca';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    return date.toLocaleDateString();
  };

  return (
    <PageContainer
      title="Dashboard"
      subtitle={`Última actualización: ${formatLastUpdate(lastUpdate)}`}
      breadcrumbs={breadcrumbs}
      actions={
        <div className="flex items-center gap-2">
          {isDataStale && (
            <span className="text-sm text-orange-600 font-medium">
              Datos desactualizados
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            loading={loading}
            icon={<RefreshCw className="h-4 w-4" />}
          >
            Actualizar
          </Button>
        </div>
      }
    >
      {/* Alertas críticas */}
      {alertSummary.criticas > 0 && (
        <AlertsPanel
          stockAlerts={stockAlerts.filter(a => a.prioridad === 'alta')}
          productAlerts={productAlerts.filter(a => a.prioridad === 'alta')}
          className="mb-6"
        />
      )}

      {/* Métricas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <StockMetrics
          metrics={metrics}
          stockAlerts={stockAlerts}
          loading={loading}
        />
        
        <ProductMetrics
          metrics={metrics}
          productAlerts={productAlerts}
          loading={loading}
        />
      </div>

      {/* Acciones rápidas y actividad reciente */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <QuickActions />
        </div>
        
        <div className="xl:col-span-2">
          <RecentActivity />
        </div>
      </div>
    </PageContainer>
  );
};

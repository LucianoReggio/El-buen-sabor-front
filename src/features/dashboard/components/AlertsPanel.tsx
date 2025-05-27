import React from 'react';
import { AlertTriangle, X, ExternalLink } from 'lucide-react';
import { AlertMessage } from '../../../components/ui/AlertMessage';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import type { StockAlert, ProductAlert } from '../../../types/dashboard.types';

interface AlertsPanelProps {
  stockAlerts: StockAlert[];
  productAlerts: ProductAlert[];
  onDismiss?: (type: 'stock' | 'product', index: number) => void;
  onViewDetails?: (type: 'stock' | 'product', alert: StockAlert | ProductAlert) => void;
  className?: string;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  stockAlerts,
  productAlerts,
  onDismiss,
  onViewDetails,
  className,
}) => {
  const totalAlerts = stockAlerts.length + productAlerts.length;

  if (totalAlerts === 0) return null;

  return (
    <div className={className}>
      <AlertMessage
        variant="error"
        title={`${totalAlerts} alertas críticas requieren atención inmediata`}
        dismissible={false}
      >
        <div className="mt-4 space-y-3">
          {/* Alertas de stock */}
          {stockAlerts.map((alert, index) => (
            <div key={`stock-${index}`} className="flex items-center justify-between p-3 bg-white rounded border">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.articulo.denominacion}</p>
                  <p className="text-xs text-gray-600">{alert.mensaje}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="danger" size="sm">
                  Stock: {alert.articulo.stockActual}
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.('stock', alert)}
                    icon={<ExternalLink className="h-3 w-3" />}
                  />
                  {onDismiss && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss('stock', index)}
                      icon={<X className="h-3 w-3" />}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Alertas de productos */}
          {productAlerts.map((alert, index) => (
            <div key={`product-${index}`} className="flex items-center justify-between p-3 bg-white rounded border">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.producto.denominacion}</p>
                  <p className="text-xs text-gray-600">{alert.mensaje}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge 
                  variant={alert.tipo === 'no_preparable' ? 'danger' : 'warning'} 
                  size="sm"
                >
                  {alert.tipo === 'no_preparable' ? 'No preparable' : 
                   alert.tipo === 'sin_ingredientes' ? 'Sin receta' : 'Margen bajo'}
                </Badge>
                
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails?.('product', alert)}
                    icon={<ExternalLink className="h-3 w-3" />}
                  />
                  {onDismiss && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDismiss('product', index)}
                      icon={<X className="h-3 w-3" />}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AlertMessage>
    </div>
  );
};
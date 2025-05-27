import React from 'react';
import { Clock, Package, Utensils, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '../../../components/layouts/Card';
import { Badge } from '../../../components/ui/Badge';

interface ActivityItem {
  id: string;
  type: 'stock_update' | 'product_created' | 'ingredient_created' | 'stock_critical';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'danger' | 'info';
  };
}

interface RecentActivityProps {
  activities?: ActivityItem[];
  maxItems?: number;
}

// Mock data - en producción vendría de una API
const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'stock_critical',
    title: 'Stock crítico detectado',
    description: 'Harina 0000 - Solo quedan 2kg',
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min ago
    icon: <TrendingDown className="h-4 w-4" />,
    badge: { text: 'Crítico', variant: 'danger' },
  },
  {
    id: '2',
    type: 'product_created',
    title: 'Nuevo producto creado',
    description: 'Pizza Margarita - Receta con 8 ingredientes',
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
    icon: <Utensils className="h-4 w-4" />,
    badge: { text: 'Nuevo', variant: 'success' },
  },
  {
    id: '3',
    type: 'stock_update',
    title: 'Stock actualizado',
    description: 'Queso Mozzarella - +5kg agregados',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: <TrendingUp className="h-4 w-4" />,
    badge: { text: '+5kg', variant: 'info' },
  },
  {
    id: '4',
    type: 'ingredient_created',
    title: 'Nuevo ingrediente',
    description: 'Aceitunas Negras - Categoría: Vegetales',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: <Package className="h-4 w-4" />,
    badge: { text: 'Ingrediente', variant: 'success' },
  },
  {
    id: '5',
    type: 'stock_update',
    title: 'Compra registrada',
    description: 'Tomates frescos - +10kg, $2.500',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: <TrendingUp className="h-4 w-4" />,
    badge: { text: 'Compra', variant: 'info' },
  },
];

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities = mockActivities,
  maxItems = 5,
}) => {
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Hace ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays}d`;
  };

  return (
    <Card title="Actividad Reciente" subtitle="Últimas operaciones del sistema">
      <div className="space-y-4">
        {activities.slice(0, maxItems).map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex-shrink-0 p-2 bg-gray-100 rounded-lg text-gray-600">
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                </div>
                
                {activity.badge && (
                  <Badge variant={activity.badge.variant} size="sm" className="ml-2">
                    {activity.badge.text}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                {formatRelativeTime(activity.timestamp)}
              </div>
            </div>
          </div>
        ))}
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No hay actividad reciente</p>
          </div>
        )}
      </div>
    </Card>
  );
};
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  Utensils, 
  Tags, 
  AlertTriangle,
  BarChart3 
} from 'lucide-react';
import { AppLayout } from './components/layouts/AppLayout';
import { DashboardOverview } from './features/dashboard/components/DashboardOverview';
import { IngredientesPage } from './pages/IngredientesPage';
import { ProductosPage } from './pages/ProductosPage';
import { CategoriasPage } from './pages/CategoriasPage';
import { StockControlPage } from './pages/StockControlPage';
import { useNotifications } from './hooks/UseNotification';
import { useDashboardData } from './features/dashboard/hooks/UseDashboardData';

// Mock user data
const mockUser = {
  name: 'Juan Pérez',
  role: 'Administrador',
  avatar: undefined,
};

export const App: React.FC = () => {
  const notifications = useNotifications();
  const { alertSummary } = useDashboardData();

  // Menu items con badges dinámicos
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-5 w-5" />,
      href: '/dashboard',
      active: window.location.pathname === '/dashboard',
    },
    {
      id: 'ingredientes',
      label: 'Ingredientes',
      icon: <Package className="h-5 w-5" />,
      href: '/ingredientes',
      active: window.location.pathname === '/ingredientes',
      badge: alertSummary.stock > 0 ? { 
        count: alertSummary.stock, 
        variant: 'danger' as const 
      } : undefined,
    },
    {
      id: 'productos',
      label: 'Productos',
      icon: <Utensils className="h-5 w-5" />,
      href: '/productos',
      active: window.location.pathname === '/productos',
      badge: alertSummary.productos > 0 ? { 
        count: alertSummary.productos, 
        variant: 'warning' as const 
      } : undefined,
    },
    {
      id: 'categorias',
      label: 'Categorías',
      icon: <Tags className="h-5 w-5" />,
      href: '/categorias',
      active: window.location.pathname === '/categorias',
    },
    {
      id: 'stock-control',
      label: 'Control de Stock',
      icon: <AlertTriangle className="h-5 w-5" />,
      href: '/stock-control',
      active: window.location.pathname === '/stock-control',
      badge: alertSummary.criticas > 0 ? { 
        count: alertSummary.criticas, 
        variant: 'danger' as const 
      } : undefined,
    },
    {
      id: 'reportes',
      label: 'Reportes',
      icon: <BarChart3 className="h-5 w-5" />,
      children: [
        {
          id: 'reportes-productos',
          label: 'Productos más vendidos',
          icon: <div className="w-2 h-2 rounded-full bg-gray-400" />,
          href: '/reportes/productos',
        },
        {
          id: 'reportes-clientes',
          label: 'Ranking de clientes',
          icon: <div className="w-2 h-2 rounded-full bg-gray-400" />,
          href: '/reportes/clientes',
        },
        {
          id: 'reportes-movimientos',
          label: 'Movimientos monetarios',
          icon: <div className="w-2 h-2 rounded-full bg-gray-400" />,
          href: '/reportes/movimientos',
        },
      ],
    },
  ];

  const handleMenuItemClick = (item: any) => {
    if (item.href) {
      window.location.href = item.href;
    }
  };

  const handleNotificationsClick = () => {
    notifications.info('Panel de notificaciones próximamente disponible');
  };

  const handleProfileClick = () => {
    notifications.info('Configuración de perfil próximamente disponible');
  };

  const handleSearchChange = (searchTerm: string) => {
    // TODO: Implementar búsqueda global
    console.log('Búsqueda global:', searchTerm);
  };

  return (
    <Router>
      <AppLayout
        menuItems={menuItems}
        user={mockUser}
        notifications={alertSummary.total}
        onMenuItemClick={handleMenuItemClick}
        onNotificationsClick={handleNotificationsClick}
        onProfileClick={handleProfileClick}
        onSearchChange={handleSearchChange}
      >
        <Routes>
          {/* Redirect root to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Main pages */}
          <Route path="/dashboard" element={<DashboardOverview />} />
          <Route path="/ingredientes" element={<IngredientesPage />} />
          <Route path="/productos" element={<ProductosPage />} />
          <Route path="/categorias" element={<CategoriasPage />} />
          <Route path="/stock-control" element={<StockControlPage />} />
          
          {/* Reports (placeholder routes) */}
          <Route 
            path="/reportes/productos" 
            element={
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Reportes de Productos</h2>
                <p className="text-gray-600">Funcionalidad en desarrollo</p>
              </div>
            } 
          />
          <Route 
            path="/reportes/clientes" 
            element={
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ranking de Clientes</h2>
                <p className="text-gray-600">Funcionalidad en desarrollo</p>
              </div>
            } 
          />
          <Route 
            path="/reportes/movimientos" 
            element={
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Movimientos Monetarios</h2>
                <p className="text-gray-600">Funcionalidad en desarrollo</p>
              </div>
            } 
          />
          
          {/* Catch all - 404 */}
          <Route 
            path="*" 
            element={
              <div className="p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Página no encontrada</h2>
                <p className="text-gray-600">La página que buscas no existe</p>
              </div>
            } 
          />
        </Routes>
      </AppLayout>
    </Router>
  );
};
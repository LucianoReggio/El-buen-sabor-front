import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Package,
  Utensils,
  Tags,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { AppLayout } from "../components/layouts/AppLayout";
import { DashboardOverview } from "../features/dashboard/components/DashboardOverview";
import { useDashboardData } from "../features/dashboard/hooks/useDashboardData";

// Mock user data
const mockUser = {
  name: "Juan Pérez",
  role: "Administrador",
  avatar: undefined,
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { alertSummary, loading } = useDashboardData();

  // Menu items con badges dinámicos
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      href: "/dashboard",
      active: true,
    },
    {
      id: "ingredientes",
      label: "Ingredientes",
      icon: <Package className="h-5 w-5" />,
      href: "/ingredientes",
      badge:
        alertSummary.stock > 0
          ? {
              count: alertSummary.stock,
              variant: "danger" as const,
            }
          : undefined,
    },
    {
      id: "productos",
      label: "Productos",
      icon: <Utensils className="h-5 w-5" />,
      href: "/productos",
      badge:
        alertSummary.productos > 0
          ? {
              count: alertSummary.productos,
              variant: "warning" as const,
            }
          : undefined,
    },
    {
      id: "categorias",
      label: "Categorías",
      icon: <Tags className="h-5 w-5" />,
      href: "/categorias",
    },
    {
      id: "stock-control",
      label: "Control de Stock",
      icon: <AlertTriangle className="h-5 w-5" />,
      href: "/stock-control",
      badge:
        alertSummary.criticas > 0
          ? {
              count: alertSummary.criticas,
              variant: "danger" as const,
            }
          : undefined,
    },
    {
      id: "reportes",
      label: "Reportes",
      icon: <BarChart3 className="h-5 w-5" />,
      children: [
        {
          id: "reportes-productos",
          label: "Productos más vendidos",
          icon: <div className="w-2 h-2 rounded-full bg-gray-400" />,
          href: "/reportes/productos",
        },
        {
          id: "reportes-clientes",
          label: "Ranking de clientes",
          icon: <div className="w-2 h-2 rounded-full bg-gray-400" />,
          href: "/reportes/clientes",
        },
        {
          id: "reportes-movimientos",
          label: "Movimientos monetarios",
          icon: <div className="w-2 h-2 rounded-full bg-gray-400" />,
          href: "/reportes/movimientos",
        },
      ],
    },
  ];

  const handleMenuItemClick = (item: any) => {
    if (item.href) {
      navigate(item.href);
    }
  };

  const handleNotificationsClick = () => {
    console.log("Mostrar notificaciones");
  };

  const handleProfileClick = () => {
    console.log("Mostrar perfil");
  };

  const handleSearchChange = (searchTerm: string) => {
    console.log("Búsqueda global:", searchTerm);
  };

  return (
    <AppLayout
      menuItems={menuItems}
      user={mockUser}
      notifications={alertSummary.total}
      onMenuItemClick={handleMenuItemClick}
      onNotificationsClick={handleNotificationsClick}
      onProfileClick={handleProfileClick}
      onSearchChange={handleSearchChange}
    >
      <DashboardOverview />
    </AppLayout>
  );
};

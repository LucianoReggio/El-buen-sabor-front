import React from "react";
import {
  Home,
  Package,
  Utensils,
  Tags,
  BarChart3,
  AlertTriangle,
  ChevronRight,
  X,
} from "lucide-react";
import { clsx } from "clsx";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: {
    count: number;
    variant?: "default" | "danger" | "warning";
  };
  children?: MenuItem[];
  active?: boolean;
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  menuItems: MenuItem[];
  onMenuItemClick?: (item: MenuItem) => void;
  className?: string;
}

const defaultMenuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    id: "ingredientes",
    label: "Ingredientes",
    icon: <Package className="h-5 w-5" />,
    href: "/ingredientes",
    badge: { count: 3, variant: "danger" }, // Stock crítico
  },
  {
    id: "productos",
    label: "Productos",
    icon: <Utensils className="h-5 w-5" />,
    href: "/productos",
  },
  {
    id: "categorias",
    label: "Categorías",
    icon: <Tags className="h-5 w-5" />,
    href: "/categorias",
  },
  {
    id: "stock",
    label: "Control de Stock",
    icon: <AlertTriangle className="h-5 w-5" />,
    href: "/stock-control",
    badge: { count: 8, variant: "warning" },
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
    ],
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = true,
  onClose,
  menuItems = defaultMenuItems,
  onMenuItemClick,
  className,
}) => {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item.id}>
        <div
          className={clsx(
            "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors",
            {
              "bg-blue-50 text-blue-700 border-r-2 border-blue-700":
                item.active,
              "text-gray-700 hover:bg-gray-50 hover:text-gray-900":
                !item.active,
              "pl-6": level > 0,
            }
          )}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.id);
            } else {
              onMenuItemClick?.(item);
            }
          }}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant={item.badge.variant || "default"} size="sm">
                {item.badge.count}
              </Badge>
            )}
          </div>

          {hasChildren && (
            <ChevronRight
              className={clsx("h-4 w-4 transition-transform text-gray-400", {
                "rotate-90": isExpanded,
              })}
            />
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          },
          className
        )}
      >
        {/* Mobile close button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menú</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            icon={<X className="h-5 w-5" />}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => renderMenuItem(item))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="text-xs text-gray-500 text-center">
            <p>El Buen Sabor v1.0</p>
            <p>Sistema de Gestión</p>
          </div>
        </div>
      </div>
    </>
  );
};

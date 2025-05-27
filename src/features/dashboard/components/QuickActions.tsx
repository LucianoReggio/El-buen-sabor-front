import React from "react";
import {
  Plus,
  Package,
  Utensils,
  Tags,
  ShoppingCart,
  BarChart3,
} from "lucide-react";
import { Card } from "../../../components/layouts/Card";
import { Button } from "../../../components/ui/Button";

interface QuickActionsProps {
  onCreateIngredient?: () => void;
  onCreateProduct?: () => void;
  onCreateCategory?: () => void;
  onRegisterPurchase?: () => void;
  onViewReports?: () => void;
  onViewStock?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onCreateIngredient,
  onCreateProduct,
  onCreateCategory,
  onRegisterPurchase,
  onViewReports,
  onViewStock,
}) => {
  const actions = [
    {
      label: "Nuevo Ingrediente",
      icon: <Package className="h-4 w-4" />,
      onClick: onCreateIngredient,
      variant: "primary" as const,
    },
    {
      label: "Nuevo Producto",
      icon: <Utensils className="h-4 w-4" />,
      onClick: onCreateProduct,
      variant: "primary" as const,
    },
    {
      label: "Nueva Categoría",
      icon: <Tags className="h-4 w-4" />,
      onClick: onCreateCategory,
      variant: "outline" as const,
    },
    {
      label: "Registrar Compra",
      icon: <ShoppingCart className="h-4 w-4" />,
      onClick: onRegisterPurchase,
      variant: "outline" as const,
    },
    {
      label: "Control de Stock",
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: onViewStock,
      variant: "outline" as const,
    },
    {
      label: "Ver Reportes",
      icon: <BarChart3 className="h-4 w-4" />,
      onClick: onViewReports,
      variant: "ghost" as const,
    },
  ];

  return (
    <Card title="Acciones Rápidas" subtitle="Operaciones frecuentes">
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            onClick={action.onClick}
            icon={action.icon}
            fullWidth
            className="justify-start"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
};

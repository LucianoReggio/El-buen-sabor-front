import React from "react";
import { AlertTriangle, TrendingDown, Package } from "lucide-react";
import { useStockControl } from "../hooks/useStockControl";
import { Card } from "../../../components/layouts/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { AlertMessage } from "../../../components/ui/AlertMessage";

interface StockControlPanelProps {
  className?: string;
}

export const StockControlPanel: React.FC<StockControlPanelProps> = ({
  className,
}) => {
  const { stockCritico, stockBajo, loading } = useStockControl();

  const urgentItems = [...stockCritico, ...stockBajo.slice(0, 3)];

  if (loading || urgentItems.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <AlertMessage
        variant="warning"
        title="Control de Stock - Atención Requerida"
        dismissible={false}
      >
        <div className="mt-3 space-y-2">
          {urgentItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 bg-white rounded border"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="font-medium">{item.denominacion}</span>
                <Badge
                  variant={
                    item.estadoStock === "CRITICO" ? "danger" : "warning"
                  }
                  size="sm"
                >
                  {item.stockActual} {item.denominacionUnidadMedida}
                </Badge>
              </div>
              <Button size="sm" variant="outline">
                Reabastecer
              </Button>
            </div>
          ))}
        </div>
      </AlertMessage>
    </div>
  );
};

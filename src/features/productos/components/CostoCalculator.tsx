import React from "react";
import { Calculator, TrendingUp, AlertCircle } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/layouts/Card";
import { AlertMessage } from "../../../components/ui/AlertMessage";
import { formatCurrency } from "../../../utils/formatters";

interface CostoCalculatorProps {
  costoTotal: number;
  precioVenta: number;
  margenGanancia: number;
  calcularAutomatico: boolean;
  onPrecioChange: (precio: number) => void;
  onMargenChange: (margen: number) => void;
  onCalcularToggle: (auto: boolean) => void;
}

export const CostoCalculator: React.FC<CostoCalculatorProps> = ({
  costoTotal,
  precioVenta,
  margenGanancia,
  calcularAutomatico,
  onPrecioChange,
  onMargenChange,
  onCalcularToggle,
}) => {
  const gananciaAbsoluta = precioVenta - costoTotal;
  const margenReal = costoTotal > 0 ? (gananciaAbsoluta / costoTotal) * 100 : 0;
  const precioSugerido = costoTotal * margenGanancia;

  const getMargenColor = (margen: number) => {
    if (margen < 20) return "text-red-600";
    if (margen < 50) return "text-yellow-600";
    if (margen < 100) return "text-green-600";
    return "text-blue-600";
  };

  const getMargenVariant = (margen: number) => {
    if (margen < 20) return "danger";
    if (margen < 50) return "warning";
    return "success";
  };

  return (
    <div className="space-y-6">
      {/* Resumen de costos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-600 mb-1">Costo Total</div>
          <div className="text-xl font-bold text-blue-900">
            {formatCurrency(costoTotal)}
          </div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600 mb-1">Precio Venta</div>
          <div className="text-xl font-bold text-green-900">
            {formatCurrency(precioVenta)}
          </div>
        </div>

        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-sm text-purple-600 mb-1">Ganancia</div>
          <div
            className={`text-xl font-bold ${
              gananciaAbsoluta >= 0 ? "text-purple-900" : "text-red-600"
            }`}
          >
            {formatCurrency(gananciaAbsoluta)}
          </div>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Margen</div>
          <div className={`text-xl font-bold ${getMargenColor(margenReal)}`}>
            {margenReal.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Configuración de precios */}
      <Card title="Configuración de Precios" padding="sm">
        <div className="space-y-4">
          {/* Toggle cálculo automático */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={calcularAutomatico}
              onChange={(e) => onCalcularToggle(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <div className="flex-1">
              <span className="font-medium text-gray-900">
                Calcular precio automáticamente
              </span>
              <p className="text-sm text-gray-600">
                El precio se calculará basado en el costo y el margen de
                ganancia deseado
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Margen de ganancia */}
            <div>
              <Input
                label="Margen de ganancia deseado"
                type="number"
                step="0.1"
                min="1"
                value={margenGanancia}
                onChange={(e) =>
                  onMargenChange(parseFloat(e.target.value) || 1)
                }
                helperText="Multiplicador sobre el costo (ej: 2.5 = 250% del costo)"
                fullWidth
              />
              {costoTotal > 0 && (
                <div className="mt-2 text-sm text-gray-600">
                  Precio sugerido:{" "}
                  <span className="font-medium text-green-600">
                    {formatCurrency(precioSugerido)}
                  </span>
                </div>
              )}
            </div>

            {/* Precio manual */}
            <Input
              label="Precio de venta"
              type="number"
              step="0.01"
              min="0"
              value={precioVenta}
              onChange={(e) => onPrecioChange(parseFloat(e.target.value) || 0)}
              disabled={calcularAutomatico}
              helperText={
                calcularAutomatico
                  ? "Se calcula automáticamente"
                  : "Ingrese el precio manualmente"
              }
              fullWidth
            />
          </div>
        </div>
      </Card>

      {/* Alertas y recomendaciones */}
      {costoTotal > 0 && (
        <div className="space-y-3">
          {margenReal < 20 && (
            <AlertMessage variant="warning" title="Margen de ganancia muy bajo">
              El margen actual es de {margenReal.toFixed(1)}%. Se recomienda un
              margen mínimo del 20% para cubrir gastos operativos.
            </AlertMessage>
          )}

          {margenReal > 200 && (
            <AlertMessage variant="warning" title="Margen de ganancia muy alto">
              El margen actual es de {margenReal.toFixed(1)}%. Un precio muy
              alto podría afectar las ventas.
            </AlertMessage>
          )}

          {precioVenta < costoTotal && (
            <AlertMessage variant="warning" title="Precio menor al costo">
              El precio de venta es menor al costo de producción. Esto generará
              pérdidas.
            </AlertMessage>
          )}
        </div>
      )}

      {/* Calculadora rápida */}
      <Card title="Calculadora Rápida" padding="sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          {[1.5, 2.0, 2.5, 3.0].map((factor) => (
            <Button
              key={factor}
              size="sm"
              variant="outline"
              onClick={() => {
                onMargenChange(factor);
                if (!calcularAutomatico) {
                  onPrecioChange(Math.ceil(costoTotal * factor));
                }
              }}
              disabled={costoTotal === 0}
            >
              <div className="text-center">
                <div className="font-medium">
                  {Math.round((factor - 1) * 100)}%
                </div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(costoTotal * factor)}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Card>
    </div>
  );
};

"use client";

import { TrendingDown } from "lucide-react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SliderInputField } from "@/components/calculator/SliderInputField";
import { useInflationAdjuster } from "@/hooks/useInflationAdjuster";
import { INFLATION_ADJUSTER_CONSTANTS } from "@/core/domain/calculator-constants";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

export default function InflationAdjuster() {
  const {
    futureValue,
    inflationRate,
    years,
    setFutureValue,
    setInflationRate,
    setYears,
    result,
    projection,
    chartData,
  } = useInflationAdjuster();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <CalculatorLayout
      title="Ajuste de Inflação"
      description="Calcule o poder de compra real do seu dinheiro ao longo do tempo considerando a inflação (IPCA)."
      icon={<TrendingDown className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Parâmetros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="futureValue">Valor Futuro (R$)</Label>
              <Input
                id="futureValue"
                type="number"
                value={futureValue}
                onChange={(e) => setFutureValue(e.target.value)}
                placeholder="100.000"
                className="text-center text-lg font-semibold transition-all focus:scale-[1.02] focus:shadow-md"
              />
              <p className="text-xs text-muted-foreground">
                Quanto você terá ou receberá no futuro
              </p>
            </div>

            <SliderInputField
              id="inflation-rate"
              label="Taxa de Inflação (IPCA)"
              value={inflationRate}
              onChange={setInflationRate}
              displayValue={`${inflationRate.toFixed(1)}% a.a.`}
              inputStep="0.1"
              min={INFLATION_ADJUSTER_CONSTANTS.INFLATION_RATE.MIN}
              max={INFLATION_ADJUSTER_CONSTANTS.INFLATION_RATE.MAX}
              step={INFLATION_ADJUSTER_CONSTANTS.INFLATION_RATE.STEP}
              inputClassName="font-mono text-center text-lg font-semibold transition-all focus:scale-[1.02] focus:shadow-md"
            >
              <p className="text-xs text-muted-foreground mt-2">
                Inflação média anual esperada
              </p>
            </SliderInputField>

            <SliderInputField
              id="years"
              label="Período"
              value={years}
              onChange={setYears}
              displayValue={`${years} ${years === 1 ? "ano" : "anos"}`}
              min={INFLATION_ADJUSTER_CONSTANTS.YEARS.MIN}
              max={INFLATION_ADJUSTER_CONSTANTS.YEARS.MAX}
              step={INFLATION_ADJUSTER_CONSTANTS.YEARS.STEP}
              inputClassName="font-mono text-center text-lg font-semibold transition-all focus:scale-[1.02] focus:shadow-md"
            />
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Resultado</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visual" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="visual">Visual</TabsTrigger>
                <TabsTrigger value="dados">Dados</TabsTrigger>
              </TabsList>

              <TabsContent value="visual" className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <p className="text-sm text-muted-foreground mb-1">
                      Valor Nominal
                    </p>
                    <p className="text-xl font-bold text-card-foreground">
                      {formatCurrency(Number.parseFloat(futureValue) || 0)}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <p className="text-sm text-muted-foreground mb-1">
                      Valor Real (Hoje)
                    </p>
                    <p className="text-xl font-bold text-accent">
                      {result
                        ? formatCurrency(result.presentValue.toNumber())
                        : "R$ 0,00"}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <p className="text-sm text-muted-foreground mb-1">
                      Perda de Poder de Compra
                    </p>
                    <p className="text-xl font-bold text-destructive">
                      {result
                        ? formatCurrency(result.purchasingPowerLoss.toNumber())
                        : "R$ 0,00"}
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="h-75 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis
                        dataKey="year"
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value),
                          name === "valorReal" ? "Valor Real" : "Valor Nominal",
                        ]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="valorNominal"
                        stroke="hsl(var(--primary))"
                        fill="hsl(var(--primary))"
                        fillOpacity={0.1}
                        strokeWidth={2}
                        name="valorNominal"
                      />
                      <Area
                        type="monotone"
                        dataKey="valorReal"
                        stroke="hsl(var(--accent))"
                        fill="hsl(var(--accent))"
                        fillOpacity={0.3}
                        strokeWidth={2}
                        name="valorReal"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  O gráfico mostra como o poder de compra de{" "}
                  {formatCurrency(Number.parseFloat(futureValue) || 0)} diminui
                  ao longo de {years} anos com inflação de {inflationRate}% a.a.
                </p>
              </TabsContent>

              <TabsContent value="dados">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 font-medium">Ano</th>
                        <th className="text-right py-3 px-2 font-medium">
                          Valor Nominal
                        </th>
                        <th className="text-right py-3 px-2 font-medium">
                          Valor Real
                        </th>
                        <th className="text-right py-3 px-2 font-medium">
                          Perda (%)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projection.map((p) => (
                        <tr
                          key={p.year}
                          className="border-b border-border/50 hover:bg-muted/80 transition-colors"
                        >
                          <td className="py-3 px-2">{p.year}</td>
                          <td className="text-right py-3 px-2">
                            {formatCurrency(p.nominalValue.toNumber())}
                          </td>
                          <td className="text-right py-3 px-2 text-accent font-medium">
                            {formatCurrency(p.realValue.toNumber())}
                          </td>
                          <td className="text-right py-3 px-2 text-destructive">
                            {p.lossPercentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Info Section */}
      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Como funciona?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            A inflação corrói o poder de compra do dinheiro ao longo do tempo.
            R$ 100.000 hoje não terão o mesmo valor daqui a 10 anos.
          </p>
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-mono">
              Valor Real = Valor Futuro ÷ (1 + inflação)^anos
            </p>
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
}

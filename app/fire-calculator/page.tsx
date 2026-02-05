'use client'

import { useState, useMemo } from "react";
import Decimal from "decimal.js";
import { Target, Flame } from "lucide-react";
import { motion } from "framer-motion";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { calculateFire, calculateFireRule4Percent } from "@/core/services/fireCalculator";

function formatCurrency(value: number | Decimal): string {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

function formatCompact(value: number): string {
  if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(0)}K`;
  }
  return `R$ ${value.toFixed(0)}`;
}

export default function FireCalculatorPage() {
  const [monthlyExpenses, setMonthlyExpenses] = useState(4000);
  const [monthlyRate, setMonthlyRate] = useState(1);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);

  const result = useMemo(() => {
    return calculateFire({
      monthlyExpenses: new Decimal(monthlyExpenses),
      monthlyRate: new Decimal(monthlyRate),
      currentSavings: new Decimal(currentSavings),
      monthlyContribution: new Decimal(monthlyContribution),
    });
  }, [monthlyExpenses, monthlyRate, currentSavings, monthlyContribution]);

  const rule4Percent = useMemo(() => {
    return calculateFireRule4Percent(new Decimal(monthlyExpenses));
  }, [monthlyExpenses]);

  // Chart data
  const chartData = useMemo(() => {
    return result.projectionData.map((d) => ({
      ano: d.year,
      patrimonio: d.patrimony.toNumber(),
      meta: d.target.toNumber(),
    }));
  }, [result]);

  const isFireReached = result.progressPercentage >= 100;

  return (
    <CalculatorLayout
      title="Planejador FIRE"
      description="Calcule seu número FIRE (Financial Independence, Retire Early) e descubra quanto você precisa para viver de renda passiva."
      icon={<Target className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Flame className="w-5 h-5 text-warning" />
              Seus Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Monthly Expenses */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="expenses">Custo de Vida Mensal</Label>
                <span className="text-sm text-primary font-medium">
                  {formatCurrency(monthlyExpenses)}
                </span>
              </div>
              <Input
                id="expenses"
                type="number"
                value={monthlyExpenses}
                onChange={(e) =>
                  setMonthlyExpenses(Number(e.target.value) || 0)
                }
                className="font-mono"
              />
              <Slider
                value={[monthlyExpenses]}
                onValueChange={([v]) => setMonthlyExpenses(v)}
                min={1000}
                max={50000}
                step={500}
                className="mt-2"
              />
            </div>

            {/* Monthly Rate */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="rate">Taxa de Rendimento Mensal</Label>
                <span className="text-sm text-primary font-medium">
                  {monthlyRate}%
                </span>
              </div>
              <Input
                id="rate"
                type="number"
                step="0.1"
                value={monthlyRate}
                onChange={(e) => setMonthlyRate(Number(e.target.value) || 0)}
                className="font-mono"
              />
              <Slider
                value={[monthlyRate]}
                onValueChange={([v]) => setMonthlyRate(v)}
                min={0.1}
                max={3}
                step={0.1}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground">
                Ex: 1% ao mês = investimentos bem diversificados
              </p>
            </div>

            {/* Current Savings */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="savings">Patrimônio Atual</Label>
                <span className="text-sm text-primary font-medium">
                  {formatCurrency(currentSavings)}
                </span>
              </div>
              <Input
                id="savings"
                type="number"
                value={currentSavings}
                onChange={(e) => setCurrentSavings(Number(e.target.value) || 0)}
                className="font-mono"
              />
              <Slider
                value={[currentSavings]}
                onValueChange={([v]) => setCurrentSavings(v)}
                min={0}
                max={2000000}
                step={10000}
                className="mt-2"
              />
            </div>

            {/* Monthly Contribution */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="contribution">Aporte Mensal</Label>
                <span className="text-sm text-primary font-medium">
                  {formatCurrency(monthlyContribution)}
                </span>
              </div>
              <Input
                id="contribution"
                type="number"
                value={monthlyContribution}
                onChange={(e) =>
                  setMonthlyContribution(Number(e.target.value) || 0)
                }
                className="font-mono"
              />
              <Slider
                value={[monthlyContribution]}
                onValueChange={([v]) => setMonthlyContribution(v)}
                min={0}
                max={30000}
                step={500}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* FIRE Number */}
          <motion.div
            key={result.fireNumber.toString()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="gradient-wealth text-primary-foreground overflow-hidden relative">
              <div className="absolute top-0 right-0 opacity-10">
                <Target className="w-32 h-32 -mt-8 -mr-8" />
              </div>
              <CardContent className="pt-6 relative z-10">
                <p className="text-sm opacity-90 mb-1">Seu Número FIRE</p>
                <p className="text-4xl font-bold">
                  {formatCurrency(result.fireNumber)}
                </p>
                <p className="text-sm opacity-75 mt-2">
                  Patrimônio necessário para gerar{" "}
                  {formatCurrency(monthlyExpenses)}/mês
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-3">
                  Progresso Atual
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      {formatCurrency(currentSavings)} /{" "}
                      {formatCurrency(result.fireNumber)}
                    </span>
                    <span className="font-medium text-primary">
                      {result.progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={Math.min(result.progressPercentage, 100)}
                    className="h-3"
                  />
                </div>
              </CardContent>
            </Card>

            <Card
              className={isFireReached ? "bg-success/10 border-success/30" : ""}
            >
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Tempo até FIRE
                </p>
                {isFireReached ? (
                  <p className="text-2xl font-bold text-success">
                    🎉 Você já chegou!
                  </p>
                ) : result.yearsToFire >= 100 ? (
                  <p className="text-2xl font-bold text-destructive">
                    +100 anos
                  </p>
                ) : (
                  <p className="text-2xl font-bold">
                    {result.yearsToFire} anos e {result.monthsToFire % 12} meses
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Comparison with 4% Rule */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Comparação: Regra dos 4%
                  </p>
                  <p className="text-xl font-bold">
                    {formatCurrency(rule4Percent)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Custo anual × 25) - Estratégia conservadora americana
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground mb-1">
                    Diferença
                  </p>
                  <p className="font-medium">
                    {result.fireNumber.greaterThan(rule4Percent) ? (
                      <span className="text-destructive">
                        +{formatCurrency(result.fireNumber.minus(rule4Percent))}
                      </span>
                    ) : (
                      <span className="text-success">
                        -{formatCurrency(rule4Percent.minus(result.fireNumber))}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projection Chart */}
          {chartData.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Projeção de Patrimônio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="ano"
                        tickFormatter={(v) => `${v}a`}
                        className="text-muted-foreground text-xs"
                      />
                      <YAxis
                        tickFormatter={formatCompact}
                        className="text-muted-foreground text-xs"
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value),
                          name === "patrimonio" ? "Patrimônio" : "Meta FIRE",
                        ]}
                        labelFormatter={(v) => `Ano ${v}`}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <ReferenceLine
                        y={result.fireNumber.toNumber()}
                        stroke="hsl(160, 84%, 39%)"
                        strokeDasharray="5 5"
                        label={{
                          value: "Meta FIRE",
                          position: "right",
                          fill: "hsl(160, 84%, 39%)",
                          fontSize: 12,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="patrimonio"
                        stroke="hsl(172, 66%, 50%)"
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "hsl(172, 66%, 50%)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Explanation */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Como funciona?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                O cálculo FIRE considera que você pode viver dos rendimentos do
                seu patrimônio. Com uma taxa de {monthlyRate}% ao mês, um
                patrimônio de {formatCurrency(result.fireNumber)} geraria{" "}
                {formatCurrency(monthlyExpenses)}/mês em renda passiva —
                suficiente para cobrir seus gastos sem tocar no principal.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}

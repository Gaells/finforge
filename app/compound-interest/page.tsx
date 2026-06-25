"use client";

import Decimal from "decimal.js";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SliderInputField } from "@/components/calculator/SliderInputField";
import { useCompoundInterestCalculator } from "@/hooks/useCompoundInterestCalculator";
import { COMPOUND_INTEREST_CONSTANTS } from "@/core/domain/calculator-constants";
import { InflationControls } from "@/components/calculator/InflationControls";

function formatCurrency(value: number | Decimal): string {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
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

export default function CompoundInterestPage() {
  const {
    principal,
    monthlyContribution,
    annualRate,
    years,
    inflationRate,
    isInflationAdjusted,
    setPrincipal,
    setMonthlyContribution,
    setAnnualRate,
    setYears,
    setInflationRate,
    setIsInflationAdjusted,
    result,
    chartData,
  } = useCompoundInterestCalculator();

  return (
    <CalculatorLayout
      title="Juros Compostos"
      description="Simule a evolução do seu patrimônio com aportes mensais recorrentes e visualize o poder dos juros compostos ao longo do tempo."
      icon={<TrendingUp className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Parâmetros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Principal */}
            <SliderInputField
              id="principal"
              label="Investimento Inicial"
              value={principal}
              onChange={setPrincipal}
              displayValue={formatCurrency(principal)}
              min={COMPOUND_INTEREST_CONSTANTS.PRINCIPAL.MIN}
              max={COMPOUND_INTEREST_CONSTANTS.PRINCIPAL.MAX}
              step={COMPOUND_INTEREST_CONSTANTS.PRINCIPAL.STEP}
            />

            {/* Monthly Contribution */}
            <SliderInputField
              id="monthly"
              label="Aporte Mensal"
              value={monthlyContribution}
              onChange={setMonthlyContribution}
              displayValue={formatCurrency(monthlyContribution)}
              min={COMPOUND_INTEREST_CONSTANTS.MONTHLY_CONTRIBUTION.MIN}
              max={COMPOUND_INTEREST_CONSTANTS.MONTHLY_CONTRIBUTION.MAX}
              step={COMPOUND_INTEREST_CONSTANTS.MONTHLY_CONTRIBUTION.STEP}
            />

            {/* Annual Rate */}
            <SliderInputField
              id="rate"
              label="Taxa Anual (%)"
              value={annualRate}
              onChange={setAnnualRate}
              displayValue={`${annualRate}%`}
              inputStep="0.1"
              min={COMPOUND_INTEREST_CONSTANTS.ANNUAL_RATE.MIN}
              max={COMPOUND_INTEREST_CONSTANTS.ANNUAL_RATE.MAX}
              step={COMPOUND_INTEREST_CONSTANTS.ANNUAL_RATE.STEP}
            />

            {/* Period */}
            <SliderInputField
              id="years"
              label="Período (Anos)"
              value={years}
              onChange={(v) => setYears(Math.min(50, v))}
              displayValue={`${years} anos`}
              min={COMPOUND_INTEREST_CONSTANTS.YEARS.MIN}
              max={COMPOUND_INTEREST_CONSTANTS.YEARS.MAX}
              step={COMPOUND_INTEREST_CONSTANTS.YEARS.STEP}
            />

            <InflationControls
              inflationRate={inflationRate}
              setInflationRate={setInflationRate}
              isInflationAdjusted={isInflationAdjusted}
              setIsInflationAdjusted={setIsInflationAdjusted}
            />
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              key={result.finalAmount.toString()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              <Card className="bg-gradient-to-br from-primary to-emerald-600 text-primary-foreground border-0 shadow-xl shadow-primary/25 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                <CardContent className="pt-6 relative z-10">
                  <p className="text-sm opacity-90 mb-1 font-medium">Montante Final</p>
                  <p className="text-2xl font-bold tracking-tight">
                    {formatCurrency(result.finalAmount)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              <Card className="border-2 border-[hsl(var(--border))] shadow-lg hover:shadow-xl hover:border-primary/30 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-transparent" />
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/5 rounded-full blur-xl" />
                <CardContent className="pt-6 relative z-10">
                  <p className="text-sm text-muted-foreground mb-1 font-medium">
                    Total Investido
                  </p>
                  <p className="text-2xl font-bold text-card-foreground tracking-tight">
                    {formatCurrency(result.totalInvested)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -4 }}
            >
              <Card className="border-2 border-success/30 bg-gradient-to-br from-success/10 to-emerald-500/5 shadow-lg hover:shadow-xl hover:border-success/50 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-transparent" />
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-success/20 rounded-full blur-xl" />
                <CardContent className="pt-6 relative z-10">
                  <p className="text-sm text-success mb-1 font-medium">Juros Ganhos</p>
                  <p className="text-2xl font-bold text-success tracking-tight">
                    +{formatCurrency(result.totalInterest)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Chart */}
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Evolução do Patrimônio</CardTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    Patrimônio
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/50" />
                    Investido
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient
                        id="colorPatrimonio"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorInvestido"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(220, 10%, 50%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(220, 10%, 50%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorReal"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0.6}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--accent))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border/50"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="ano"
                      tickFormatter={(v) => `${v}a`}
                      className="text-muted-foreground text-xs"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tickFormatter={formatCompact}
                      className="text-muted-foreground text-xs"
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        formatCurrency(value),
                        name === "patrimonio"
                          ? "Patrimônio Nominal"
                          : name === "patrimonioReal"
                            ? "Patrimônio Real"
                            : name === "investido"
                              ? "Investido"
                              : "Juros",
                      ]}
                      labelFormatter={(v) => `Ano ${v}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "2px solid hsl(var(--border))",
                        borderRadius: "12px",
                        color: "hsl(var(--card-foreground))",
                        boxShadow: "0 10px 40px hsl(var(--foreground) / 0.1)",
                      }}
                    />
                    <Legend
                      formatter={(value) =>
                        value === "patrimonio"
                          ? "Patrimônio Total"
                          : value === "investido"
                            ? "Total Investido"
                            : value === "patrimonioReal"
                              ? "Patrimônio Real (IPCA)"
                              : value
                      }
                      iconType="circle"
                      iconSize={8}
                    />
                    <Area
                      type="monotone"
                      dataKey="investido"
                      stroke="hsl(220, 10%, 50%)"
                      fill="url(#colorInvestido)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="patrimonio"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorPatrimonio)"
                      strokeWidth={2.5}
                      name="patrimonio"
                    />
                    {isInflationAdjusted && (
                      <Area
                        type="monotone"
                        dataKey="patrimonioReal"
                        stroke="hsl(var(--accent))"
                        fill="url(#colorReal)"
                        strokeWidth={2.5}
                        strokeDasharray="5 5"
                        name="patrimonioReal"
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Interest breakdown */}
          <Card className="overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground font-medium">
                  Proporção Juros vs Investido
                </span>
                <span className="text-sm font-bold text-primary">
                  {result.totalInterest
                    .div(result.totalInvested)
                    .mul(100)
                    .toFixed(1)}
                  % de rendimento
                </span>
              </div>
              <div className="relative h-5 bg-muted/70 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-muted-foreground/60 to-muted-foreground/40 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.totalInvested
                      .div(result.finalAmount)
                      .mul(100)
                      .toNumber()}%`,
                  }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.div
                  className="absolute inset-y-0 bg-gradient-to-r from-primary to-emerald-400 rounded-full shadow-lg shadow-primary/30"
                  style={{
                    left: `${result.totalInvested
                      .div(result.finalAmount)
                      .mul(100)
                      .toNumber()}%`,
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.totalInterest
                      .div(result.finalAmount)
                      .mul(100)
                      .toNumber()}%`,
                  }}
                  transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              <div className="flex justify-between mt-3 text-xs font-medium">
                <span className="text-muted-foreground flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/50" />
                  Investido
                </span>
                <span className="text-primary flex items-center gap-2">
                  Juros
                  <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-primary to-emerald-400" />
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}

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
    setPrincipal,
    setMonthlyContribution,
    setAnnualRate,
    setYears,
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
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <motion.div
              key={result.finalAmount.toString()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                  <p className="text-sm opacity-90 mb-1">Montante Final</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(result.finalAmount)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">
                  Total Investido
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(result.totalInvested)}
                </p>
              </CardContent>
            </Card>

            <Card className="border-success/30 bg-success/5">
              <CardContent className="pt-6">
                <p className="text-sm text-success mb-1">Juros Ganhos</p>
                <p className="text-2xl font-bold text-success">
                  +{formatCurrency(result.totalInterest)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Evolução do Patrimônio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-87.5">
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
                          stopColor="hsl(160, 84%, 39%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(160, 84%, 39%)"
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
                          stopColor="hsl(220, 14%, 46%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(220, 14%, 46%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
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
                        name === "patrimonio"
                          ? "Patrimônio"
                          : name === "investido"
                            ? "Investido"
                            : "Juros",
                      ]}
                      labelFormatter={(v) => `Ano ${v}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend
                      formatter={(value) =>
                        value === "patrimonio"
                          ? "Patrimônio Total"
                          : value === "investido"
                            ? "Total Investido"
                            : value
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="investido"
                      stroke="hsl(220, 14%, 46%)"
                      fill="url(#colorInvestido)"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="patrimonio"
                      stroke="hsl(160, 84%, 39%)"
                      fill="url(#colorPatrimonio)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Interest breakdown */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Proporção Juros vs Investido
                </span>
                <span className="text-sm font-medium">
                  {result.totalInterest
                    .div(result.totalInvested)
                    .mul(100)
                    .toFixed(1)}
                  % de rendimento
                </span>
              </div>
              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-muted-foreground/50 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${result.totalInvested
                      .div(result.finalAmount)
                      .mul(100)
                      .toNumber()}%`,
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-y-0 bg-primary rounded-full"
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
                  transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>Investido</span>
                <span className="text-primary">Juros</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}

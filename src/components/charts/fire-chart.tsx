"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
} from "recharts";
import Decimal from "decimal.js";
import { formatCurrency } from "@/core/utils/decimal-helpers";

interface FireChartProps {
  data: Array<{
    year: number;
    age: number;
    netWorth: Decimal;
    annualContribution: Decimal;
    annualReturn: Decimal;
  }>;
  fireNumber: Decimal;
}

export function FireProgressChart({ data, fireNumber }: Readonly<FireChartProps>) {
  const chartData = React.useMemo(() => {
    return data.map((item) => ({
      ano: `Ano ${item.year}`,
      idade: item.age,
      patrimonio: item.netWorth.toNumber(),
      meta: fireNumber.toNumber(),
      aportes: item.annualContribution.toNumber(),
      rendimento: item.annualReturn.toNumber(),
    }));
  }, [data, fireNumber]);

  return (
    <div className="w-full h-100">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border"
          />
          <XAxis
            dataKey="ano"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "currentColor" }}
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => [
              formatCurrency(new Decimal(value)),
              "",
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="patrimonio"
            name="Patrimônio"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="meta"
            name="Meta FIRE"
            stroke="hsl(var(--accent))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FireBreakdownChart({
  data,
}: Readonly<Omit<FireChartProps, "fireNumber">>) {
  const chartData = React.useMemo(() => {
    // Pega apenas alguns anos espaçados para visualização
    const step = Math.ceil(data.length / 10);
    return data
      .filter((_, index) => index % step === 0 || index === data.length - 1)
      .map((item) => ({
        ano: `Ano ${item.year}`,
        Aportes: item.annualContribution.toNumber(),
        Rendimentos: item.annualReturn.toNumber(),
      }));
  }, [data]);

  return (
    <div className="w-full h-75">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-border"
          />
          <XAxis
            dataKey="ano"
            className="text-xs"
            tick={{ fill: "currentColor" }}
          />
          <YAxis
            className="text-xs"
            tick={{ fill: "currentColor" }}
            tickFormatter={(value) =>
              new Intl.NumberFormat("pt-BR", {
                notation: "compact",
                compactDisplay: "short",
              }).format(value)
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "0.5rem",
            }}
            formatter={(value: number) => [
              formatCurrency(new Decimal(value)),
              "",
            ]}
          />
          <Legend />
          <Bar dataKey="Aportes" fill="hsl(var(--muted-foreground))" />
          <Bar dataKey="Rendimentos" fill="hsl(var(--primary))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

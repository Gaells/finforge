"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Decimal from "decimal.js";
import { formatCurrency } from "@/core/utils/decimal-helpers";

interface CompoundInterestChartProps {
  data: Array<{
    month: number;
    balance: Decimal;
    contribution: Decimal;
    interestEarned: Decimal;
  }>;
  showMonthly?: boolean;
}

export function CompoundInterestChart({
  data,
  showMonthly = false,
}: CompoundInterestChartProps) {
  // Agrupa por ano se houver muitos dados
  const displayData = React.useMemo(() => {
    if (showMonthly || data.length <= 24) {
      return data.map((item) => ({
        period: `Mês ${item.month}`,
        saldo: item.balance.toNumber(),
        juros: item.interestEarned.toNumber(),
      }));
    }

    // Agrupa por ano
    const yearlyData: Array<{
      period: string;
      saldo: number;
      juros: number;
    }> = [];

    for (let i = 11; i < data.length; i += 12) {
      const item = data[i];
      yearlyData.push({
        period: `Ano ${Math.floor(item.month / 12)}`,
        saldo: item.balance.toNumber(),
        juros: item.interestEarned.toNumber(),
      });
    }

    // Adiciona último mês se não for múltiplo de 12
    if (data.length % 12 !== 0) {
      const lastItem = data[data.length - 1];
      yearlyData.push({
        period: `Mês ${lastItem.month}`,
        saldo: lastItem.balance.toNumber(),
        juros: lastItem.interestEarned.toNumber(),
      });
    }

    return yearlyData;
  }, [data, showMonthly]);

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={displayData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          <XAxis
            dataKey="period"
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
          <Area
            type="monotone"
            dataKey="saldo"
            name="Saldo Total"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorSaldo)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

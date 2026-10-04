"use client";

import { useMemo, useState } from "react";
import Decimal from "decimal.js";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SliderInputField } from "@/components/calculator/SliderInputField";
import { projectPortfolio } from "@/core/services/projection.service";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatCompact(value: number) {
  if (value >= 1_000_000) return `R$ ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `R$ ${(value / 1_000).toFixed(0)}K`;
  return `R$ ${value.toFixed(0)}`;
}

interface ProjectionControlsProps {
  initialAmount: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  ipca: number;
  inflationAdjusted: boolean;
  onChange: (values: {
    initialAmount: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
    ipca: number;
    inflationAdjusted: boolean;
  }) => void;
}

export function ProjectionControls({
  initialAmount,
  monthlyContribution,
  annualRate,
  years,
  ipca,
  inflationAdjusted,
  onChange,
}: ProjectionControlsProps) {
  function update(patch: Partial<ProjectionControlsProps>) {
    onChange({
      initialAmount,
      monthlyContribution,
      annualRate,
      years,
      ipca,
      inflationAdjusted,
      ...patch,
    });
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="initial">Patrimônio inicial</Label>
          <Input
            id="initial"
            type="number"
            min={0}
            step={1000}
            value={initialAmount}
            onChange={(e) => update({ initialAmount: Number(e.target.value) })}
          />
          <p className="text-xs text-muted-foreground">
            Valor atual da carteira ou ponto de partida.
          </p>
        </div>

        <SliderInputField
          id="monthly"
          label="Aporte mensal"
          value={monthlyContribution}
          onChange={(v) => update({ monthlyContribution: v })}
          displayValue={formatBRL(monthlyContribution)}
          min={0}
          max={20000}
          step={100}
        />

        <SliderInputField
          id="rate"
          label="Taxa anual esperada (%)"
          value={annualRate}
          onChange={(v) => update({ annualRate: v })}
          displayValue={`${annualRate}%`}
          inputStep="0.1"
          min={0}
          max={30}
          step={0.5}
        />

        <SliderInputField
          id="years"
          label="Período (anos)"
          value={years}
          onChange={(v) => update({ years: Math.min(50, v) })}
          displayValue={`years} anos`.replace("years", `${years}`)}
          min={1}
          max={40}
          step={1}
        />

        <div className="space-y-3 pt-2 border-t border-[hsl(var(--border)/0.6)]">
          <div className="flex items-center justify-between">
            <div>
              <Label>Descontar inflação</Label>
              <p className="text-xs text-muted-foreground">
                Mostrar poder de compra real (IPCA).
              </p>
            </div>
            <Switch
              checked={inflationAdjusted}
              onCheckedChange={(c) => update({ inflationAdjusted: c })}
            />
          </div>
          {inflationAdjusted && (
            <div className="space-y-2">
              <Label htmlFor="ipca">IPCA anual (%)</Label>
              <Input
                id="ipca"
                type="number"
                step={0.1}
                min={0}
                max={20}
                value={ipca}
                onChange={(e) => update({ ipca: Number(e.target.value) })}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectionViewProps {
  initialAmount: number;
  monthlyContribution: number;
  annualRate: number;
  years: number;
  ipca: number;
  inflationAdjusted: boolean;
}

export function ProjectionView({
  initialAmount,
  monthlyContribution,
  annualRate,
  years,
  ipca,
  inflationAdjusted,
}: ProjectionViewProps) {
  const result = useMemo(
    () =>
      projectPortfolio({
        initialAmount: new Decimal(initialAmount),
        monthlyContribution: new Decimal(monthlyContribution),
        annualRate: new Decimal(annualRate),
        years,
        inflationRate: inflationAdjusted ? new Decimal(ipca) : undefined,
      }),
    [initialAmount, monthlyContribution, annualRate, years, inflationAdjusted, ipca],
  );

  const chartData = result.timeline.map((p) => ({
    yearLabel: p.yearLabel,
    balance: p.balance.toNumber(),
    contributed: p.totalContributed.toNumber(),
    realBalance: p.realBalance?.toNumber(),
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Patrimônio final
            </p>
            <p className="text-2xl font-bold mt-1 text-primary">
              {formatBRL(result.finalBalance.toNumber())}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Total aportado
            </p>
            <p className="text-2xl font-bold mt-1">
              {formatBRL(result.totalContributed.toNumber())}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Juros ganhos
            </p>
            <p className="text-2xl font-bold mt-1 text-emerald-600">
              {formatBRL(result.totalInterest.toNumber())}
            </p>
          </CardContent>
        </Card>
      </div>

      {inflationAdjusted && result.realFinalBalance && (
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Patrimônio real (descontando inflação)
            </p>
            <p className="text-2xl font-bold mt-1">
              {formatBRL(result.realFinalBalance.toNumber())}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Em poder de compra de hoje.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(220, 10%, 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(220, 10%, 50%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
                <XAxis dataKey="yearLabel" className="text-xs" axisLine={false} tickLine={false} />
                <YAxis tickFormatter={formatCompact} className="text-xs" axisLine={false} tickLine={false} />
                <Tooltip
                  formatter={(value: number) => formatBRL(value)}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "2px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Legend iconType="circle" iconSize={8} />
                <Area
                  type="monotone"
                  dataKey="contributed"
                  stroke="hsl(220, 10%, 50%)"
                  fill="url(#colorContrib)"
                  name="Aportado"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorBalance)"
                  name="Patrimônio"
                  strokeWidth={2.5}
                />
                {inflationAdjusted && (
                  <Area
                    type="monotone"
                    dataKey="realBalance"
                    stroke="hsl(var(--accent))"
                    fill="url(#colorReal)"
                    name="Real (IPCA)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface ProjectionPanelProps {
  defaults: {
    initialAmount: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
    ipca: number;
  };
}

export function ProjectionPanel({ defaults }: ProjectionPanelProps) {
  const [values, setValues] = useState({
    initialAmount: defaults.initialAmount,
    monthlyContribution: defaults.monthlyContribution,
    annualRate: defaults.annualRate,
    years: defaults.years,
    ipca: defaults.ipca,
    inflationAdjusted: false,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ProjectionControls {...values} onChange={setValues} />
      </div>
      <div className="lg:col-span-2">
        <ProjectionView {...values} />
      </div>
    </div>
  );
}
"use client";

import { useMemo, useState } from "react";
import Decimal from "decimal.js";
import { Sparkles } from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SliderInputField } from "@/components/calculator/SliderInputField";
// (import removido)

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

interface SimulatorProps {
  defaults: {
    initialAmount: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
  };
}

export function Simulator({ defaults }: SimulatorProps) {
  const [initial, setInitial] = useState(defaults.initialAmount);
  const [contrib, setContrib] = useState(defaults.monthlyContribution);
  const [extraAtMonth, setExtraAtMonth] = useState(0); // aporte extra no mês N
  const [extraAmount, setExtraAmount] = useState(0);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0);
  const [rate, setRate] = useState(defaults.annualRate);
  const [years, setYears] = useState(defaults.years);

  // Cenário alternativo: incluir aporte extra + retirada
  const scenario = useMemo(() => {
    // Para simular aporte extra em mês N, projetamos manualmente:
    const monthlyRate = new Decimal(1)
      .plus(new Decimal(rate).div(100))
      .pow(new Decimal(1).div(12))
      .minus(new Decimal(1));
    let balance = new Decimal(initial);
    const months = years * 12;
    const timeline: { month: number; year: number; yearLabel: string; baseline: number; scenario: number }[] = [];
    let baselineBalance = new Decimal(initial);

    timeline.push({
      month: 0,
      year: 0,
      yearLabel: "Hoje",
      baseline: baselineBalance.toNumber(),
      scenario: balance.toNumber(),
    });

    for (let m = 1; m <= months; m++) {
      // baseline (sem mudanças)
      baselineBalance = baselineBalance
        .plus(contrib)
        .times(new Decimal(1).plus(monthlyRate));

      // scenario (com mudanças)
      balance = balance.plus(contrib).minus(monthlyWithdrawal);
      if (extraAtMonth > 0 && m === extraAtMonth) {
        balance = balance.plus(extraAmount);
      }
      balance = balance.times(new Decimal(1).plus(monthlyRate));

      if (m % 12 === 0) {
        timeline.push({
          month: m,
          year: m / 12,
          yearLabel: `+${m / 12}a`,
          baseline: baselineBalance.toNumber(),
          scenario: balance.toNumber(),
        });
      }
    }

    return {
      finalBalance: balance,
      baseline: baselineBalance,
      timeline,
    };
  }, [initial, contrib, extraAmount, extraAtMonth, monthlyWithdrawal, rate, years]);

  const chartData = scenario.timeline;

  const diff = scenario.finalBalance.minus(scenario.baseline);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <Card>
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="font-semibold">Cenário base</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="initial">Patrimônio inicial</Label>
              <Input
                id="initial"
                type="number"
                min={0}
                step={1000}
                value={initial}
                onChange={(e) => setInitial(Number(e.target.value))}
              />
            </div>
            <SliderInputField
              id="contrib"
              label="Aporte mensal"
              value={contrib}
              onChange={setContrib}
              displayValue={formatBRL(contrib)}
              min={0}
              max={20000}
              step={100}
            />
            <SliderInputField
              id="rate"
              label="Taxa anual (%)"
              value={rate}
              onChange={setRate}
              displayValue={`${rate}%`}
              inputStep="0.1"
              min={0}
              max={30}
              step={0.5}
            />
            <SliderInputField
              id="years"
              label="Período (anos)"
              value={years}
              onChange={(v) => setYears(Math.min(50, v))}
              displayValue={`${years} anos`}
              min={1}
              max={40}
              step={1}
            />
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/30 bg-primary/5">
          <CardContent className="pt-6 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="font-semibold">E se...</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="extraMonth">Aporte extra no mês (opcional)</Label>
              <Input
                id="extraMonth"
                type="number"
                min={1}
                max={years * 12}
                value={extraAtMonth || ""}
                onChange={(e) => setExtraAtMonth(Number(e.target.value) || 0)}
                placeholder="Ex: 12 (1 ano)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="extraAmount">Valor do aporte extra</Label>
              <Input
                id="extraAmount"
                type="number"
                min={0}
                step={1000}
                value={extraAmount || ""}
                onChange={(e) => setExtraAmount(Number(e.target.value) || 0)}
                placeholder="10000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="withdrawal">Retirada mensal</Label>
              <Input
                id="withdrawal"
                type="number"
                min={0}
                step={100}
                value={monthlyWithdrawal || ""}
                onChange={(e) => setMonthlyWithdrawal(Number(e.target.value) || 0)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Simula quanto você tiraria por mês (renda passiva).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase font-medium">
                Cenário base
              </p>
              <p className="text-2xl font-bold mt-1 text-muted-foreground">
                {formatBRL(scenario.baseline.toNumber())}
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 border-primary">
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase font-medium">
                Com mudanças
              </p>
              <p className="text-2xl font-bold mt-1 text-primary">
                {formatBRL(scenario.finalBalance.toNumber())}
              </p>
            </CardContent>
          </Card>
          <Card
            className={
              diff.greaterThan(0)
                ? "border-2 border-emerald-500/30 bg-emerald-500/5"
                : diff.lessThan(0)
                  ? "border-2 border-red-500/30 bg-red-500/5"
                  : ""
            }
          >
            <CardContent className="pt-5">
              <p className="text-xs text-muted-foreground uppercase font-medium">
                Diferença
              </p>
              <p
                className={`text-2xl font-bold mt-1 ${
                  diff.greaterThan(0)
                    ? "text-emerald-600"
                    : diff.lessThan(0)
                      ? "text-red-600"
                      : ""
                }`}
              >
                {diff.greaterThanOrEqualTo(0) ? "+" : ""}
                {formatBRL(diff.toNumber())}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Comparação mês a mês</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
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
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="hsl(220, 10%, 50%)"
                    strokeWidth={2}
                    dot={false}
                    name="Cenário base"
                  />
                  <Line
                    type="monotone"
                    dataKey="scenario"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    dot={false}
                    name="Com mudanças"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
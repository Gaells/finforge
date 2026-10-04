"use client";

import { AlertTriangle, PieChart } from "lucide-react";
import {
  Pie,
  PieChart as RechartsPie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { ASSET_CLASS_META } from "@/core/domain/asset-classes";
import { Card, CardContent } from "@/components/ui/card";
import type { AllocationResult } from "@/core/services/allocation.service";

interface AllocationViewProps {
  allocation: AllocationResult;
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
  }).format(value);
}

export function AllocationView({ allocation }: AllocationViewProps) {
  const { byClass, byAsset, concentrationWarnings, total } = allocation;

  if (total.toNumber() === 0) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <PieChart className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-lg">Sem dados de alocação</p>
            <p className="text-sm text-muted-foreground mt-1">
              Adicione ativos com cotações atualizadas para visualizar a diversificação.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const pieData = byClass.map((c) => ({
    name: ASSET_CLASS_META[c.type].labelPlural,
    value: c.value.toNumber(),
    pct: c.percentage.toNumber(),
    color: ASSET_CLASS_META[c.type].color,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pizza */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Distribuição por classe</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    paddingAngle={2}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatBRL(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "2px solid hsl(var(--border))",
                      borderRadius: "12px",
                    }}
                  />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lista */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">% por classe</h3>
            <div className="space-y-3">
              {byClass.map((c) => {
                const meta = ASSET_CLASS_META[c.type];
                const pct = c.percentage.toNumber();
                return (
                  <div key={c.type}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ background: meta.color }}
                        />
                        <span className="font-medium">{meta.labelPlural}</span>
                        <span className="text-xs text-muted-foreground">
                          ({c.positionCount} {c.positionCount === 1 ? "ativo" : "ativos"})
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">{pct.toFixed(1)}%</span>
                        <span className="text-muted-foreground ml-2">
                          {formatBRL(c.value.toNumber())}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          background: meta.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {concentrationWarnings.length > 0 && (
        <Card className="border-2 border-yellow-500/40 bg-yellow-500/5">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-700 dark:text-yellow-400">
                  Alerta de concentração
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Os seguintes ativos ultrapassam 20% da posição:
                </p>
                <ul className="mt-2 space-y-1">
                  {concentrationWarnings.map((w) => (
                    <li key={w.ticker} className="text-sm">
                      <span className="font-medium">{w.ticker}</span>:{" "}
                      <span className="font-semibold text-yellow-700 dark:text-yellow-400">
                        {w.percentage.toFixed(1)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Todos os ativos</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[hsl(var(--border)/0.6)] text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left py-2">Ticker</th>
                  <th className="text-right py-2">Valor</th>
                  <th className="text-right py-2">%</th>
                </tr>
              </thead>
              <tbody>
                {byAsset
                  .sort((a, b) => b.percentage.minus(a.percentage).toNumber())
                  .map((a) => (
                    <tr
                      key={a.assetId}
                      className="border-b border-[hsl(var(--border)/0.4)] last:border-0"
                    >
                      <td className="py-2 font-semibold">{a.ticker}</td>
                      <td className="py-2 text-right font-mono">
                        {formatBRL(a.value.toNumber())}
                      </td>
                      <td className="py-2 text-right font-mono font-semibold">
                        {a.percentage.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
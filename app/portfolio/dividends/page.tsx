import { TrendingUp, DollarSign, Calendar } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { summarizeDividends } from "@/core/services/dividends.service";
import { calculatePortfolio } from "@/core/services/portfolio.service";
import { Card, CardContent } from "@/components/ui/card";
import { DividendsChart } from "@/components/portfolio/DividendsChart";
import {
  fetchAssetsWithPrices,
  fetchTransactions,
} from "@/core/data/portfolio-data";
import type { Asset, Transaction } from "@/core/domain/portfolio.types";
import type { AssetType, Currency } from "@/lib/supabase/types";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value);
}

export default async function DividendsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [assets, transactions] = await Promise.all([
    fetchAssetsWithPrices(user.id),
    fetchTransactions(user.id),
  ]);

  const typedAssets: Asset[] = assets.map((a) => ({
    id: a.id,
    ticker: a.ticker,
    name: a.name,
    type: a.type as AssetType,
    currency: a.currency as Currency,
    exchange: a.exchange,
    sector: a.sector,
    metadata: (a.metadata as Record<string, unknown>) ?? {},
  }));

  const typedTxs: Transaction[] = transactions.map((t) => ({
    id: t.id,
    assetId: t.asset_id,
    type: t.type,
    quantity: Number(t.quantity),
    unitPrice: Number(t.unit_price),
    total: Number(t.total),
    fees: Number(t.fees),
    currency: t.currency as Currency,
    date: t.date,
    notes: t.notes,
  }));

  const prices: Record<string, number | null> = {};
  for (const a of assets) prices[a.id] = a.price ? Number(a.price.price) : null;
  const positions = calculatePortfolio(typedAssets, typedTxs, prices);

  const assetCosts: Record<string, number> = {};
  for (const p of positions) {
    assetCosts[p.asset.id] = p.totalCost.toNumber();
  }

  const summary = summarizeDividends(typedAssets, typedTxs, assetCosts);

  const chartData = summary.byMonth.map((m) => ({
    month: m.label,
    total: m.total.toNumber(),
  }));

  const hasDividends = summary.totalReceived.toNumber() > 0;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Proventos</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dividendos, JCP e rendimentos recebidos.
        </p>
      </div>

      {!hasDividends ? (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg">Nenhum provento registrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Registre dividendos ou rendimentos para acompanhar seu yield on cost.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">
                    Total recebido
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {formatBRL(summary.totalReceived.toNumber())}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">
                    Últimos 12 meses
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {formatBRL(summary.last12Months.toNumber())}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-medium">
                    Ativos pagantes
                  </p>
                  <p className="text-2xl font-bold mt-1">{summary.byAsset.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {chartData.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Proventos por mês</h3>
                <DividendsChart data={chartData} />
              </CardContent>
            </Card>
          )}

          <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Por ativo</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[hsl(var(--border)/0.6)] text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left py-2">Ativo</th>
                        <th className="text-right py-2">Total recebido</th>
                        <th className="text-right py-2">Yield on cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary.byAsset.map((a) => (
                        <tr
                          key={a.assetId}
                          className="border-b border-[hsl(var(--border)/0.4)] last:border-0"
                        >
                          <td className="py-3 font-semibold">{a.ticker}</td>
                          <td className="py-3 text-right font-mono">
                            {formatBRL(a.total.toNumber())}
                          </td>
                          <td className="py-3 text-right font-mono font-semibold text-emerald-600">
                            {a.yieldOnCost.toNumber().toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </>
  );
}
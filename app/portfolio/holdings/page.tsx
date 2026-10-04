import Link from "next/link";
import { Coins } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  fetchAssetsWithPrices,
  fetchTransactions,
  fetchFixedIncomeDetails,
} from "@/core/data/portfolio-data";
import {
  calculatePortfolio,
  summarizePortfolio,
} from "@/core/services/portfolio.service";
import { ASSET_CLASS_META } from "@/core/domain/asset-classes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshPricesButton } from "@/components/portfolio/RefreshPricesButton";
import { toBRL } from "@/core/services/currency.service";
import type { Asset, Transaction } from "@/core/domain/portfolio.types";
import type { AssetType, Currency } from "@/lib/supabase/types";

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export default async function HoldingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [assetsWithPrices, transactions, fiDetails] = await Promise.all([
    fetchAssetsWithPrices(user.id),
    fetchTransactions(user.id),
    fetchAssetsWithPrices(user.id).then((arr) =>
      fetchFixedIncomeDetails(arr.filter((a) => a.type === "FIXED_INCOME").map((a) => a.id)),
    ),
  ]);

  const assets: Asset[] = assetsWithPrices.map((a) => ({
    id: a.id,
    ticker: a.ticker,
    name: a.name,
    type: a.type as AssetType,
    currency: a.currency as Currency,
    exchange: a.exchange,
    sector: a.sector,
    metadata: (a.metadata as Record<string, unknown>) ?? {},
  }));

  const txs: Transaction[] = transactions.map((t) => ({
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

  const currentPrices: Record<string, number | null> = {};
  for (const a of assetsWithPrices) {
    currentPrices[a.id] = a.price ? Number(a.price.price) : null;
  }

  const positions = calculatePortfolio(assets, txs, currentPrices);
  const summary = summarizePortfolio(positions);

  // Calcular totais em BRL para agregação
  let totalValueBRL = 0;
  let totalCostBRL = 0;
  let totalUnrealizedBRL = 0;
  let totalRealizedBRL = 0;
  let totalDividendsBRL = 0;
  for (const p of positions) {
    const c = p.asset.currency;
    totalCostBRL += (await toBRL(p.totalCost, c)).toNumber();
    totalRealizedBRL += (await toBRL(p.realizedPnL, c)).toNumber();
    totalDividendsBRL += (await toBRL(p.dividendsReceived, c)).toNumber();
    if (p.currentValue !== null) {
      totalValueBRL += (await toBRL(p.currentValue, c)).toNumber();
      totalUnrealizedBRL += (await toBRL(p.unrealizedPnL ?? new (await import("decimal.js")).default(0), c)).toNumber();
    }
  }
  const totalReturnBRL = totalUnrealizedBRL + totalRealizedBRL + totalDividendsBRL;
  const totalReturnPercent = totalCostBRL > 0 ? (totalReturnBRL / totalCostBRL) * 100 : 0;

  const fiMap = new Map(fiDetails.map((f) => [f.asset_id, f]));
  const sorted = [...positions].sort((a, b) => {
    const av = a.currentValue?.toNumber() ?? 0;
    const bv = b.currentValue?.toNumber() ?? 0;
    return bv - av;
  });

  const hasAnyPosition = sorted.some((p) => !p.quantity.isZero());

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Posições</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {summary.positionCount} {summary.positionCount === 1 ? "ativo" : "ativos"}
          </p>
        </div>
        <RefreshPricesButton />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Patrimônio atual
            </p>
            <p className="text-2xl font-bold mt-1">
              {totalValueBRL > 0 ? formatCurrency(totalValueBRL, "BRL") : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">em BRL</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Custo total (BRL)
            </p>
            <p className="text-2xl font-bold mt-1">
              {formatCurrency(totalCostBRL, "BRL")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
              Retorno total
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                totalReturnBRL >= 0 ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {totalCostBRL > 0 ? formatCurrency(totalReturnBRL, "BRL") : "—"}
              {totalCostBRL > 0 && (
                <span className="text-sm ml-2 font-normal">
                  ({formatPercent(totalReturnPercent)})
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              inclui dividendos
            </p>
          </CardContent>
        </Card>
      </div>

      {!hasAnyPosition ? (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Coins className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg">Nenhuma posição aberta</p>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastre ativos e registre transações para começar.
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/assets/new">Cadastrar ativo</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/transactions/new">Nova transação</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-4">
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--border)/0.6)] text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left py-3 px-2">Ativo</th>
                    <th className="text-right py-3 px-2">Qtd</th>
                    <th className="text-right py-3 px-2">Preço médio</th>
                    <th className="text-right py-3 px-2">Custo total</th>
                    <th className="text-right py-3 px-2">Preço atual</th>
                    <th className="text-right py-3 px-2">Valor atual</th>
                    <th className="text-right py-3 px-2">P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((p) => {
                    const meta = ASSET_CLASS_META[p.asset.type];
                    const fi = fiMap.get(p.asset.id);
                    const hasPosition = !p.quantity.isZero();
                    const isPositive =
                      p.unrealizedPnL && p.unrealizedPnL.greaterThanOrEqualTo(0);
                    const cur = p.asset.currency;
                    return (
                      <tr
                        key={p.asset.id}
                        className="border-b border-[hsl(var(--border)/0.4)] last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-2">
                          <Link
                            href={`/assets/${p.asset.id}`}
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            <span className="font-semibold">{p.asset.ticker}</span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${meta.bgColor} ${meta.textColor}`}
                            >
                              {meta.label}
                            </Badge>
                          </Link>
                          {fi && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {fi.kind} • {fi.indexer} {fi.rate}
                              {fi.indexer === "PRE" ? "% a.a." : ""}
                            </p>
                          )}
                        </td>
                        <td className="py-3 px-2 text-right font-mono">
                          {hasPosition
                            ? p.quantity.toNumber().toLocaleString("pt-BR", {
                                maximumFractionDigits: 8,
                              })
                            : "—"}
                        </td>
                        <td className="py-3 px-2 text-right font-mono">
                          {hasPosition
                            ? formatCurrency(p.avgPrice.toNumber(), cur)
                            : "—"}
                        </td>
                        <td className="py-3 px-2 text-right font-mono">
                          {p.totalCost.toNumber() > 0
                            ? formatCurrency(p.totalCost.toNumber(), cur)
                            : "—"}
                        </td>
                        <td className="py-3 px-2 text-right font-mono text-muted-foreground">
                          {p.currentPrice
                            ? formatCurrency(p.currentPrice.toNumber(), cur)
                            : "—"}
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-semibold">
                          {p.currentValue ? formatCurrency(p.currentValue.toNumber(), cur) : "—"}
                        </td>
                        <td className="py-3 px-2 text-right">
                          {p.unrealizedPnL ? (
                            <div>
                              <div
                                className={`font-mono font-semibold ${
                                  isPositive ? "text-emerald-600" : "text-red-600"
                                }`}
                              >
                                {formatCurrency(p.unrealizedPnL.toNumber(), cur)}
                              </div>
                              {p.totalReturnPercent && p.totalCost.toNumber() > 0 && p.totalReturn && (
                                <div
                                  className={`text-xs font-mono ${
                                    p.totalReturn.greaterThanOrEqualTo(0)
                                      ? "text-emerald-600/80"
                                      : "text-red-600/80"
                                  }`}
                                >
                                  {formatPercent(p.totalReturnPercent.toNumber())}
                                </div>
                              )}
                            </div>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
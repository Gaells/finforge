import Link from "next/link";
import { ArrowRight, TrendingUp, Wallet } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  fetchAssetsWithPrices,
  fetchTransactions,
} from "@/core/data/portfolio-data";
import {
  calculatePortfolio,
  summarizePortfolio,
} from "@/core/services/portfolio.service";
import { summarizeInBRL } from "@/core/services/portfolio-aggregator.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Asset, Transaction } from "@/core/domain/portfolio.types";
import type { AssetType, Currency } from "@/lib/supabase/types";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

interface PortfolioSummaryCardProps {
  userId: string;
}

async function PortfolioSummaryCard({ userId }: PortfolioSummaryCardProps) {
  const [assets, txs] = await Promise.all([
    fetchAssetsWithPrices(userId),
    fetchTransactions(userId),
  ]);

  if (assets.length === 0) return null;

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
  const typedTxs: Transaction[] = txs.map((t) => ({
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
  const summary = summarizePortfolio(positions);
  const inBRL = await summarizeInBRL(positions);

  return (
    <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold">Sua carteira</p>
              <p className="text-xs text-muted-foreground">
                {summary.positionCount} {summary.positionCount === 1 ? "ativo" : "ativos"}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/portfolio/holdings">
              Ver posições
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Patrimônio
            </p>
            <p className="text-2xl font-bold mt-1">
              {inBRL.totalValueBRL.toNumber() > 0
                ? formatBRL(inBRL.totalValueBRL.toNumber())
                : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Custo total
            </p>
            <p className="text-2xl font-bold mt-1">
              {formatBRL(inBRL.totalCostBRL.toNumber())}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase font-medium">
              Retorno
            </p>
            <p
              className={`text-2xl font-bold mt-1 ${
                inBRL.totalReturnBRL.toNumber() >= 0
                  ? "text-emerald-600"
                  : "text-red-600"
              }`}
            >
              {inBRL.totalCostBRL.toNumber() > 0
                ? formatBRL(inBRL.totalReturnBRL.toNumber())
                : "—"}
              {inBRL.totalCostBRL.toNumber() > 0 && (
                <span className="text-sm ml-2 font-normal">
                  ({formatPercent(inBRL.totalReturnPercent.toNumber())})
                </span>
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function PortfolioCTACard() {
  return (
    <Card className="mb-8 border-2 border-dashed border-primary/40 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center">
          <TrendingUp className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="font-semibold text-lg">Sua carteira está esperando por você</p>
          <p className="text-sm text-muted-foreground mt-1">
            Comece cadastrando seus primeiros ativos e transações.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          <Button asChild>
            <Link href="/portfolio">
              Abrir carteira
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export async function PortfolioTeaser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { count } = await supabase
    .from("assets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  if (!count || count === 0) {
    return <PortfolioCTACard />;
  }
  return <PortfolioSummaryCard userId={user.id} />;
}
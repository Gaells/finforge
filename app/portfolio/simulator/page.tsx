import { createClient } from "@/lib/supabase/server";
import { Simulator } from "@/components/portfolio/Simulator";
import type { Asset, Transaction } from "@/core/domain/portfolio.types";
import type { AssetType, Currency } from "@/lib/supabase/types";
import {
  fetchAssetsWithPrices,
  fetchTransactions,
} from "@/core/data/portfolio-data";

export default async function SimulatorPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const defaults = {
    initialAmount: 0,
    monthlyContribution: 1000,
    annualRate: 10,
    years: 20,
  };

  if (user) {
    // Patrimônio inicial = valor atual da carteira
    const [assets, txs] = await Promise.all([
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

    const { summarizePortfolio, calculatePortfolio } = await import(
      "@/core/services/portfolio.service"
    );
    const positions = calculatePortfolio(typedAssets, typedTxs, prices);
    const summary = summarizePortfolio(positions);
    defaults.initialAmount = summary.totalValue.toNumber();

    const { data: profile } = await supabase
      .from("profiles")
      .select("expected_rates")
      .eq("id", user.id)
      .single();
    if (profile) {
      const rates = profile.expected_rates as unknown as Record<string, number>;
      const avg =
        Object.values(rates).reduce((s, v) => s + v, 0) / Object.values(rates).length;
      defaults.annualRate = Number((avg * 100).toFixed(1));
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Simulador &ldquo;E se...?&rdquo;</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Compare o cenário atual e simule mudanças no aporte, retiradas ou aplicações extras.
        </p>
      </div>
      <Simulator defaults={defaults} />
    </>
  );
}
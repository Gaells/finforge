import { createClient } from "@/lib/supabase/server";
import {
  fetchAssetsWithPrices,
  fetchTransactions,
} from "@/core/data/portfolio-data";
import {
  calculatePortfolio,
} from "@/core/services/portfolio.service";
import { calculateAllocation } from "@/core/services/allocation.service";
import { AllocationView } from "@/components/portfolio/AllocationView";
import { RefreshPricesButton } from "@/components/portfolio/RefreshPricesButton";
import type { Asset, Transaction } from "@/core/domain/portfolio.types";
import type { AssetType, Currency } from "@/lib/supabase/types";

export default async function AllocationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [assetsWithPrices, transactions] = await Promise.all([
    fetchAssetsWithPrices(user.id),
    fetchTransactions(user.id),
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
  const allocation = calculateAllocation(positions);

  return (
    <>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Alocação</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Diversificação da carteira por classe de ativo.
          </p>
        </div>
        <RefreshPricesButton />
      </div>
      <AllocationView allocation={allocation} />
    </>
  );
}
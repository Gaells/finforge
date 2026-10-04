import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type DbAsset = Database["public"]["Tables"]["assets"]["Row"];
type DbTransaction = Database["public"]["Tables"]["transactions"]["Row"];

export interface PriceRow {
  symbol: string;
  currency: string;
  price: number;
  source: string;
  updated_at: string;
}

export interface AssetWithPrice extends DbAsset {
  price: PriceRow | null;
}

export async function fetchAssetsWithPrices(userId: string): Promise<AssetWithPrice[]> {
  const supabase = await createClient();

  const [{ data: assets }, { data: prices }] = await Promise.all([
    supabase.from("assets").select("*").eq("user_id", userId).order("ticker"),
    supabase.from("price_cache").select("*"),
  ]);

  const priceBySymbol = new Map<string, PriceRow>();
  for (const p of (prices ?? []) as PriceRow[]) {
    priceBySymbol.set(`${p.symbol}:${p.currency}`, p);
  }

  return ((assets ?? []) as DbAsset[]).map((a) => ({
    ...a,
    price: priceBySymbol.get(`${a.ticker}:${a.currency}`) ?? null,
  }));
}

export async function fetchTransactions(userId: string): Promise<DbTransaction[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });
  return (data ?? []) as DbTransaction[];
}

export async function fetchFixedIncomeDetails(assetIds: string[]) {
  if (assetIds.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("fixed_income_details")
    .select("*")
    .in("asset_id", assetIds);
  return (data ?? []) as Array<{
    asset_id: string;
    kind: string;
    indexer: string;
    rate: number;
    maturity_date: string | null;
    issuer: string | null;
    current_value: number | null;
  }>;
}
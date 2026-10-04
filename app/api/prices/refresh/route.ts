import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  fetchPrice,
  saveCachedPrice,
  fetchUsdBrl,
} from "@/core/services/priceFetcher.service";
import type { AssetType, Currency } from "@/lib/supabase/types";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { data: assets } = await supabase
    .from("assets")
    .select("ticker, type, currency")
    .eq("user_id", user.id);

  if (!assets || assets.length === 0) {
    return NextResponse.json({ updated: 0, failed: 0, results: [] });
  }

  const results: Array<{
    symbol: string;
    status: "ok" | "failed";
    price?: number;
    error?: string;
  }> = [];

  let updated = 0;
  let failed = 0;

  for (const a of assets as Array<{ ticker: string; type: AssetType; currency: Currency }>) {
    if (a.type === "FIXED_INCOME" || a.type === "CASH") continue;
    try {
      const r = await fetchPrice(a.type, a.ticker, a.currency);
      if (r) {
        await saveCachedPrice(r);
        results.push({ symbol: a.ticker, status: "ok", price: r.price });
        updated++;
      } else {
        results.push({ symbol: a.ticker, status: "failed", error: "no_data" });
        failed++;
      }
    } catch (e) {
      results.push({
        symbol: a.ticker,
        status: "failed",
        error: e instanceof Error ? e.message : "unknown",
      });
      failed++;
    }
  }

  // Atualizar USD/BRL também
  const usdBrl = await fetchUsdBrl();
  if (usdBrl) {
    await supabase.from("price_cache").upsert(
      {
        symbol: "USDBRL",
        currency: "BRL",
        price: usdBrl,
        source: "awesomeapi",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "symbol,currency" },
    );
  }

  return NextResponse.json({ updated, failed, results, usdBrl });
}
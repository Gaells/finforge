import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { AssetType, Currency } from "@/lib/supabase/types";

export interface PriceFetchResult {
  symbol: string;
  currency: Currency;
  price: number;
  source: string;
}

const CACHE_TTL_MS = 1000 * 60 * 15; // 15 min

// =============================================================================
// CoinGecko (cripto)
// =============================================================================
const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
  DOGE: "dogecoin",
  AVAX: "avalanche-2",
  DOT: "polkadot",
  MATIC: "matic-network",
  LINK: "chainlink",
  UNI: "uniswap",
  LTC: "litecoin",
};

async function fetchCrypto(symbol: string): Promise<number | null> {
  const id = COINGECKO_IDS[symbol.toUpperCase()];
  if (!id) return null;
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=brl`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.[id]?.brl;
    return typeof price === "number" ? price : null;
  } catch {
    return null;
  }
}

// =============================================================================
// Brapi (ações/FIIs/ETFs BR em BRL)
// =============================================================================
async function fetchBrapi(ticker: string): Promise<number | null> {
  try {
    const url = `https://brapi.dev/api/quote/${encodeURIComponent(ticker)}?range=1d`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    const price = data?.results?.[0]?.regularMarketPrice;
    return typeof price === "number" ? price : null;
  } catch {
    return null;
  }
}

// =============================================================================
// Yahoo Finance (US stocks/ETFs em USD) — endpoint unofficial
// =============================================================================
async function fetchYahoo(ticker: string): Promise<number | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=1d`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        "User-Agent": "Mozilla/5.0 FinForge/1.0",
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const meta = data?.chart?.result?.[0]?.meta;
    const price = meta?.regularMarketPrice;
    return typeof price === "number" ? price : null;
  } catch {
    return null;
  }
}

// =============================================================================
// USD/BRL (AwesomeAPI)
// =============================================================================
export async function fetchUsdBrl(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://economia.awesomeapi.com.br/json/last/USD-BRL",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    const bid = data?.USDBRL?.bid;
    const rate = typeof bid === "string" ? parseFloat(bid) : bid;
    return typeof rate === "number" ? rate : null;
  } catch {
    return null;
  }
}

// =============================================================================
// Roteador
// =============================================================================
export async function fetchPrice(
  type: AssetType,
  ticker: string,
  currency: Currency,
): Promise<PriceFetchResult | null> {
  let price: number | null = null;
  let source = "unknown";

  switch (type) {
    case "CRYPTO":
      price = await fetchCrypto(ticker);
      source = "coingecko";
      break;
    case "STOCK":
    case "ETF":
    case "CASH":
      if (currency === "USD") {
        price = await fetchYahoo(ticker);
        source = "yahoo";
      } else {
        price = await fetchBrapi(ticker);
        source = "brapi";
      }
      break;
    case "FII":
      price = await fetchBrapi(ticker);
      source = "brapi";
      break;
    case "FIXED_INCOME":
      // Não tem cotação automática
      return null;
  }

  if (price === null || price === undefined || price <= 0) return null;
  return { symbol: ticker.toUpperCase(), currency, price, source };
}

// =============================================================================
// Cache layer
// =============================================================================
export async function getCachedPrice(
  symbol: string,
  currency: Currency,
): Promise<number | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("price_cache")
    .select("price, updated_at")
    .eq("symbol", symbol.toUpperCase())
    .eq("currency", currency)
    .single();
  if (!data) return null;
  const updatedAt = new Date(data.updated_at).getTime();
  if (Date.now() - updatedAt > CACHE_TTL_MS) return null;
  return Number(data.price);
}

export async function saveCachedPrice(result: PriceFetchResult) {
  const supabase = await createClient();
  await supabase.from("price_cache").upsert(
    {
      symbol: result.symbol,
      currency: result.currency,
      price: result.price,
      source: result.source,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "symbol,currency" },
  );
}

export async function getOrFetchPrice(
  type: AssetType,
  ticker: string,
  currency: Currency,
): Promise<number | null> {
  if (type === "FIXED_INCOME" || type === "CASH") return null;

  const cached = await getCachedPrice(ticker, currency);
  if (cached !== null) return cached;

  const result = await fetchPrice(type, ticker, currency);
  if (!result) return null;

  await saveCachedPrice(result);
  return result.price;
}
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const exportSchema = z.object({
  version: z.literal(1),
  exportedAt: z.string(),
  assets: z.array(
    z.object({
      ticker: z.string(),
      name: z.string(),
      type: z.enum(["STOCK", "ETF", "FII", "CRYPTO", "FIXED_INCOME", "CASH"]),
      currency: z.enum(["BRL", "USD"]),
      exchange: z.string().nullable().optional(),
      sector: z.string().nullable().optional(),
      fixedIncome: z
        .object({
          kind: z.enum([
            "CDB",
            "LCI",
            "LCA",
            "TESOURO",
            "DEBENTURE",
            "CRI",
            "CRA",
            "LC",
            "OTHER",
          ]),
          indexer: z.enum(["PRE", "CDI", "IPCA", "SELIC", "OTHER"]),
          rate: z.number(),
          maturity_date: z.string().nullable().optional(),
          issuer: z.string().nullable().optional(),
        })
        .optional()
        .nullable(),
      transactions: z.array(
        z.object({
          type: z.enum([
            "BUY",
            "SELL",
            "DIVIDEND",
            "INCOME",
            "SPLIT",
            "BONUS",
          ]),
          quantity: z.number(),
          unit_price: z.number(),
          fees: z.number().default(0),
          currency: z.enum(["BRL", "USD"]),
          date: z.string(),
          notes: z.string().nullable().optional(),
        }),
      ),
    }),
  ),
});

export async function exportPortfolioAction(): Promise<{
  ok: boolean;
  data?: unknown;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Não autenticado." };

  const assetsResult = await supabase
    .from("assets")
    .select("*")
    .eq("user_id", user.id);
  const userAssets = assetsResult.data ?? [];

  const [{ data: transactions }, { data: fiDetails }] = await Promise.all([
    supabase.from("transactions").select("*").eq("user_id", user.id),
    supabase
      .from("fixed_income_details")
      .select("*")
      .in(
        "asset_id",
        userAssets.map((a: { id: string }) => a.id),
      ),
  ]);

  const fiMap = new Map((fiDetails ?? []).map((f) => [f.asset_id, f]));

  const payload = {
    version: 1 as const,
    exportedAt: new Date().toISOString(),
    assets: (userAssets ?? []).map((a: { id: string; ticker: string; name: string; type: string; currency: string; exchange: string | null; sector: string | null }) => {
      const txs = (transactions ?? []).filter((t: { asset_id: string }) => t.asset_id === a.id);
      return {
        ticker: a.ticker,
        name: a.name,
        type: a.type,
        currency: a.currency,
        exchange: a.exchange,
        sector: a.sector,
        fixedIncome: a.type === "FIXED_INCOME" && fiMap.has(a.id) ? fiMap.get(a.id) : null,
        transactions: txs.map((t) => ({
          type: t.type,
          quantity: Number(t.quantity),
          unit_price: Number(t.unit_price),
          fees: Number(t.fees),
          currency: t.currency,
          date: t.date,
          notes: t.notes,
        })),
      };
    }),
  };

  return { ok: true, data: payload };
}

export async function importPortfolioAction(
  _prev: { error?: string; imported?: number } | undefined,
  formData: FormData,
): Promise<{ error?: string; imported?: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "Arquivo inválido." };

  let raw: unknown;
  try {
    raw = JSON.parse(await file.text());
  } catch {
    return { error: "JSON inválido." };
  }

  const parsed = exportSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Formato do arquivo não reconhecido." };
  }

  let imported = 0;
  for (const assetEntry of parsed.data.assets) {
    const { data: asset, error: aErr } = await supabase
      .from("assets")
      .insert({
        user_id: user.id,
        ticker: assetEntry.ticker,
        name: assetEntry.name,
        type: assetEntry.type,
        currency: assetEntry.currency,
        exchange: assetEntry.exchange ?? null,
        sector: assetEntry.sector ?? null,
      })
      .select()
      .single();

    if (aErr || !asset) continue;

    if (assetEntry.type === "FIXED_INCOME" && assetEntry.fixedIncome) {
      await supabase.from("fixed_income_details").insert({
        asset_id: asset.id,
        kind: assetEntry.fixedIncome.kind,
        indexer: assetEntry.fixedIncome.indexer,
        rate: assetEntry.fixedIncome.rate,
        maturity_date: assetEntry.fixedIncome.maturity_date ?? null,
        issuer: assetEntry.fixedIncome.issuer ?? null,
      });
    }

    if (assetEntry.transactions.length > 0) {
      await supabase.from("transactions").insert(
        assetEntry.transactions.map((t) => ({
          user_id: user.id,
          asset_id: asset.id,
          type: t.type,
          quantity: t.quantity,
          unit_price: t.unit_price,
          total: t.quantity * t.unit_price + (t.fees ?? 0),
          fees: t.fees ?? 0,
          currency: t.currency,
          date: t.date,
          notes: t.notes ?? null,
        })),
      );
    }
    imported++;
  }

  revalidatePath("/portfolio");
  revalidatePath("/portfolio/holdings");
  revalidatePath("/transactions");
  revalidatePath("/assets");

  return { imported };
}
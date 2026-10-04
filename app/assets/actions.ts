"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { AssetType, Currency, FixedIncomeIndexer, FixedIncomeKind } from "@/lib/supabase/types";

const assetBaseSchema = z.object({
  ticker: z.string().trim().min(1, "Ticker obrigatório").max(20),
  name: z.string().trim().min(1, "Nome obrigatório").max(100),
  type: z.enum(["STOCK", "ETF", "FII", "CRYPTO", "FIXED_INCOME", "CASH"]),
  currency: z.enum(["BRL", "USD"]),
  exchange: z.string().trim().max(50).optional().nullable(),
  sector: z.string().trim().max(50).optional().nullable(),
});

const fixedIncomeSchema = z
  .object({
    kind: z.enum(["CDB", "LCI", "LCA", "TESOURO", "DEBENTURE", "CRI", "CRA", "LC", "OTHER"]),
    indexer: z.enum(["PRE", "CDI", "IPCA", "SELIC", "OTHER"]),
    rate: z.coerce.number().min(0, "Taxa deve ser ≥ 0"),
    maturityDate: z.string().optional().nullable(),
    issuer: z.string().trim().max(100).optional().nullable(),
  })
  .optional();

const createAssetSchema = assetBaseSchema.extend({
  fixedIncome: fixedIncomeSchema,
});

const updateAssetSchema = assetBaseSchema.extend({
  id: z.string().uuid(),
  fixedIncome: fixedIncomeSchema,
});

export type AssetActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

function parseForm(formData: FormData) {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) {
    if (k === "fixedIncome" || k.startsWith("fixedIncome.")) continue;
    obj[k] = typeof v === "string" ? v : v.name;
  }
  // Fixed income aninhado
  const fi: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) {
    if (k.startsWith("fixedIncome.")) {
      const key = k.replace("fixedIncome.", "");
      fi[key] = typeof v === "string" ? v : v.name;
    }
  }
  if (Object.keys(fi).length > 0) obj.fixedIncome = fi;
  return obj;
}

export async function createAssetAction(
  _prev: AssetActionResult,
  formData: FormData,
): Promise<AssetActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const parsed = createAssetSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;
  const { data: asset, error } = await supabase
    .from("assets")
    .insert({
      user_id: user.id,
      ticker: data.ticker.toUpperCase(),
      name: data.name,
      type: data.type,
      currency: data.currency,
      exchange: data.exchange || null,
      sector: data.sector || null,
    })
    .select()
    .single();

  if (error || !asset) {
    if (error?.code === "23505") {
      return { error: "Você já tem um ativo com este ticker e tipo." };
    }
    return { error: error?.message ?? "Erro ao criar ativo." };
  }

  // Renda fixa: inserir detalhes
  if (data.type === "FIXED_INCOME" && data.fixedIncome) {
    const { error: fiError } = await supabase.from("fixed_income_details").insert({
      asset_id: asset.id,
      kind: data.fixedIncome.kind as FixedIncomeKind,
      indexer: data.fixedIncome.indexer as FixedIncomeIndexer,
      rate: data.fixedIncome.rate,
      maturity_date: data.fixedIncome.maturityDate || null,
      issuer: data.fixedIncome.issuer || null,
    });
    if (fiError) {
      // rollback
      await supabase.from("assets").delete().eq("id", asset.id);
      return { error: `Erro ao salvar detalhes de renda fixa: ${fiError.message}` };
    }
  }

  revalidatePath("/assets");
  revalidatePath("/portfolio");
  redirect("/assets");
}

export async function updateAssetAction(
  _prev: AssetActionResult,
  formData: FormData,
): Promise<AssetActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const parsed = updateAssetSchema.safeParse(parseForm(formData));
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;
  const { error } = await supabase
    .from("assets")
    .update({
      ticker: data.ticker.toUpperCase(),
      name: data.name,
      type: data.type,
      currency: data.currency,
      exchange: data.exchange || null,
      sector: data.sector || null,
    })
    .eq("id", data.id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  if (data.type === "FIXED_INCOME" && data.fixedIncome) {
    await supabase.from("fixed_income_details").upsert({
      asset_id: data.id,
      kind: data.fixedIncome.kind as FixedIncomeKind,
      indexer: data.fixedIncome.indexer as FixedIncomeIndexer,
      rate: data.fixedIncome.rate,
      maturity_date: data.fixedIncome.maturityDate || null,
      issuer: data.fixedIncome.issuer || null,
    });
  } else if (data.type !== "FIXED_INCOME") {
    await supabase.from("fixed_income_details").delete().eq("asset_id", data.id);
  }

  revalidatePath("/assets");
  revalidatePath(`/assets/${data.id}`);
  revalidatePath("/portfolio");
  redirect(`/assets/${data.id}`);
}

export async function deleteAssetAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("assets").delete().eq("id", id).eq("user_id", user.id);
  revalidatePath("/assets");
  revalidatePath("/portfolio");
  redirect("/assets");
}

export type AssetFormValues = {
  id?: string;
  ticker: string;
  name: string;
  type: AssetType;
  currency: Currency;
  exchange: string | null;
  sector: string | null;
  fixedIncome?: {
    kind: FixedIncomeKind;
    indexer: FixedIncomeIndexer;
    rate: number;
    maturityDate: string | null;
    issuer: string | null;
  };
};
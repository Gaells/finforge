"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { TransactionType, Currency } from "@/lib/supabase/types";

const transactionSchema = z.object({
  assetId: z.string().uuid("Selecione um ativo válido"),
  type: z.enum(["BUY", "SELL", "DIVIDEND", "INCOME", "SPLIT", "BONUS"]),
  quantity: z.coerce.number().min(0, "Quantidade deve ser ≥ 0"),
  unitPrice: z.coerce.number().min(0, "Preço unitário deve ser ≥ 0"),
  fees: z.coerce.number().min(0, "Taxas devem ser ≥ 0").default(0),
  currency: z.enum(["BRL", "USD"]),
  date: z.string().min(1, "Data obrigatória"),
  notes: z.string().trim().max(500).optional().nullable(),
});

export type TransactionActionResult = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function createTransactionAction(
  _prev: TransactionActionResult,
  formData: FormData,
): Promise<TransactionActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Não autenticado." };

  const raw: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) {
    raw[k] = typeof v === "string" ? v : v.name;
  }

  const parsed = transactionSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path.join(".")] = issue.message;
    }
    return { fieldErrors };
  }

  const data = parsed.data;
  const qty = data.quantity;
  const total = qty * data.unitPrice + data.fees;

  const { error } = await supabase
    .from("transactions")
    .insert({
      user_id: user.id,
      asset_id: data.assetId,
      type: data.type,
      quantity: qty,
      unit_price: data.unitPrice,
      total,
      fees: data.fees,
      currency: data.currency,
      date: data.date,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/transactions");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/holdings");
  redirect("/transactions");
}

export async function deleteTransactionAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/transactions");
  revalidatePath("/portfolio");
  revalidatePath("/portfolio/holdings");
}

export type TransactionFormValues = {
  assetId: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  fees: number;
  currency: Currency;
  date: string;
  notes: string | null;
};
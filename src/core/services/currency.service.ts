import "server-only";
import { createClient } from "@/lib/supabase/server";
import { Decimal } from "../domain/financial-types";
import type { Currency } from "@/lib/supabase/types";

const FALLBACK_USD_BRL = 5.0; // fallback caso API falhe

/**
 * Cotação USD/BRL (1 USD = X BRL).
 * Lê de price_cache (chave USDBRL), com fallback para 5.0.
 */
export async function getUsdBrlRate(): Promise<Decimal> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("price_cache")
    .select("price")
    .eq("symbol", "USDBRL")
    .eq("currency", "BRL")
    .single();
  const rate = data?.price ? Number(data.price) : FALLBACK_USD_BRL;
  return new Decimal(rate);
}

/**
 * Converte um valor entre moedas.
 */
export async function convertCurrency(
  amount: Decimal | number,
  from: Currency,
  to: Currency,
): Promise<Decimal> {
  const value = amount instanceof Decimal ? amount : new Decimal(amount);
  if (from === to) return value;
  if (from === "USD" && to === "BRL") {
    const rate = await getUsdBrlRate();
    return value.times(rate);
  }
  if (from === "BRL" && to === "USD") {
    const rate = await getUsdBrlRate();
    return value.dividedBy(rate);
  }
  return value;
}

/**
 * Converte um valor para BRL.
 */
export async function toBRL(amount: Decimal | number, from: Currency): Promise<Decimal> {
  return convertCurrency(amount, from, "BRL");
}
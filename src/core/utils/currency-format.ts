import "server-only";
import { Decimal } from "decimal.js";

/**
 * Helpers de formatação para múltiplas moedas.
 */

export function formatCurrency(value: number | Decimal, currency: Currency): string {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(num);
}

export type Currency = "BRL" | "USD";

export async function formatBRL(value: number | Decimal): Promise<string> {
  return formatCurrency(value, "BRL");
}

/**
 * Formata um valor mostrando também a conversão para BRL quando aplicável.
 * Ex: "US$ 100.00 (≈ R$ 500.00)"
 */
export function formatDualCurrency(
  value: number | Decimal,
  currency: Currency,
  brlEquivalent: number | Decimal | null,
): string {
  const main = formatCurrency(value, currency);
  if (currency === "BRL" || brlEquivalent === null) return main;
  const eq = formatCurrency(brlEquivalent, "BRL");
  return `${main} (≈ ${eq})`;
}
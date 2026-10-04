import { Decimal } from "../domain/financial-types";
import { toBRL } from "./currency.service";
import type { Position, PortfolioSummary } from "../domain/portfolio.types";
import type { Currency } from "@/lib/supabase/types";

/**
 * Soma o valor em BRL de uma lista de posições,
 * convertendo USD → BRL quando preciso.
 *
 * Posições sem currentValue são ignoradas.
 */
export async function totalValueInBRL(positions: Position[]): Promise<Decimal> {
  let total = new Decimal(0);
  for (const p of positions) {
    if (p.currentValue === null) continue;
    const brl = await toBRL(p.currentValue, p.asset.currency as Currency);
    total = total.plus(brl);
  }
  return total;
}

/**
 * Resumo agregando em BRL — usado no dashboard.
 */
export async function summarizeInBRL(
  positions: Position[],
): Promise<{
  totalCostBRL: Decimal;
  totalValueBRL: Decimal;
  totalReturnBRL: Decimal;
  totalReturnPercent: Decimal;
}> {
  let totalCostBRL = new Decimal(0);
  let totalValueBRL = new Decimal(0);
  let totalReturnBRL = new Decimal(0);

  for (const p of positions) {
    const cost = await toBRL(p.totalCost, p.asset.currency as Currency);
    totalCostBRL = totalCostBRL.plus(cost);
    if (p.currentValue !== null) {
      const value = await toBRL(p.currentValue, p.asset.currency as Currency);
      totalValueBRL = totalValueBRL.plus(value);
    }
    if (p.totalReturn !== null) {
      const ret = await toBRL(p.totalReturn, p.asset.currency as Currency);
      totalReturnBRL = totalReturnBRL.plus(ret);
    }
  }

  const totalReturnPercent = totalCostBRL.isZero()
    ? new Decimal(0)
    : totalReturnBRL.dividedBy(totalCostBRL).times(100);

  return {
    totalCostBRL,
    totalValueBRL,
    totalReturnBRL,
    totalReturnPercent,
  };
}

export type { PortfolioSummary };
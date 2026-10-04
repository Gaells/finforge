import { Decimal } from "../domain/financial-types";
import type { Position } from "../domain/portfolio.types";
import type { AssetType } from "@/lib/supabase/types";

export interface AllocationSlice {
  type: AssetType;
  value: Decimal;
  percentage: Decimal;
  positionCount: number;
}

export interface AllocationByAsset {
  assetId: string;
  ticker: string;
  value: Decimal;
  percentage: Decimal;
}

export interface AllocationResult {
  total: Decimal;
  byClass: AllocationSlice[];
  byAsset: AllocationByAsset[];
  concentrationWarnings: Array<{ ticker: string; percentage: Decimal }>;
}

const DEFAULT_CONCENTRATION_THRESHOLD = 20; // %

/**
 * Calcula diversificação da carteira:
 * - % por classe de ativo
 * - % por ativo
 * - alertas de concentração (ativo > threshold%)
 */
export function calculateAllocation(
  positions: Position[],
  concentrationThreshold = DEFAULT_CONCENTRATION_THRESHOLD,
): AllocationResult {
  const valuedPositions = positions.filter(
    (p) => p.currentValue !== null && !p.currentValue.isZero(),
  );

  const total = valuedPositions.reduce(
    (acc, p) => acc.plus(p.currentValue!),
    new Decimal(0),
  );

  const classMap = new Map<AssetType, { value: Decimal; count: number }>();
  const assetList: AllocationByAsset[] = [];

  for (const p of valuedPositions) {
    const type = p.asset.type;
    const cur = classMap.get(type) ?? { value: new Decimal(0), count: 0 };
    cur.value = cur.value.plus(p.currentValue!);
    cur.count += 1;
    classMap.set(type, cur);

    assetList.push({
      assetId: p.asset.id,
      ticker: p.asset.ticker,
      value: p.currentValue!,
      percentage: total.isZero()
        ? new Decimal(0)
        : p.currentValue!.dividedBy(total).times(100),
    });
  }

  const byClass: AllocationSlice[] = Array.from(classMap.entries())
    .map(([type, { value, count }]) => ({
      type,
      value,
      count,
      percentage: total.isZero()
        ? new Decimal(0)
        : value.dividedBy(total).times(100),
      positionCount: count,
    }))
    .sort((a, b) => b.value.minus(a.value).toNumber());

  const concentrationWarnings = assetList
    .filter((a) => a.percentage.greaterThan(concentrationThreshold))
    .sort((a, b) => b.percentage.minus(a.percentage).toNumber())
    .map((a) => ({ ticker: a.ticker, percentage: a.percentage }));

  return { total, byClass, byAsset: assetList, concentrationWarnings };
}
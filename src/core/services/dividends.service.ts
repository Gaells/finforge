import { Decimal } from "../domain/financial-types";
import type { Asset, Transaction } from "../domain/portfolio.types";

export interface DividendEntry {
  assetId: string;
  ticker: string;
  date: string;
  total: Decimal;
  type: "DIVIDEND" | "INCOME";
}

export interface DividendByMonth {
  yearMonth: string; // "2024-03"
  label: string; // "Mar/2024"
  total: Decimal;
}

export interface DividendSummary {
  totalReceived: Decimal;
  byAsset: Array<{
    ticker: string;
    assetId: string;
    total: Decimal;
    yieldOnCost: Decimal; // % sobre custo total
  }>;
  byMonth: DividendByMonth[];
  last12Months: Decimal;
}

/**
 * Consolida dividendos e rendimentos recebidos por ativo e por mês.
 */
export function summarizeDividends(
  assets: Asset[],
  transactions: Transaction[],
  assetCosts: Record<string, Decimal | number> = {},
  referenceDate: Date = new Date(),
): DividendSummary {
  const assetMap = new Map(assets.map((a) => [a.id, a]));

  const provEntries: DividendEntry[] = transactions
    .filter((t) => t.type === "DIVIDEND" || t.type === "INCOME")
    .map((t) => {
      const asset = assetMap.get(t.assetId);
      return {
        assetId: t.assetId,
        ticker: asset?.ticker ?? "?",
        date: t.date,
        total: new Decimal(t.total),
        type: t.type as "DIVIDEND" | "INCOME",
      };
    });

  const totalReceived = provEntries.reduce(
    (acc, e) => acc.plus(e.total),
    new Decimal(0),
  );

  // Por ativo
  const perAsset = new Map<string, Decimal>();
  for (const e of provEntries) {
    perAsset.set(e.assetId, (perAsset.get(e.assetId) ?? new Decimal(0)).plus(e.total));
  }

  const byAsset = Array.from(perAsset.entries()).map(([assetId, total]) => {
    const asset = assetMap.get(assetId);
    const cost = assetCosts[assetId]
      ? assetCosts[assetId] instanceof Decimal
        ? assetCosts[assetId]
        : new Decimal(assetCosts[assetId])
      : new Decimal(0);
    const yieldOnCost = cost.isZero()
      ? new Decimal(0)
      : total.dividedBy(cost).times(100);
    return {
      ticker: asset?.ticker ?? "?",
      assetId,
      total,
      yieldOnCost,
    };
  }).sort((a, b) => b.total.minus(a.total).toNumber());

  // Por mês
  const perMonth = new Map<string, Decimal>();
  for (const e of provEntries) {
    const ym = e.date.substring(0, 7); // YYYY-MM
    perMonth.set(ym, (perMonth.get(ym) ?? new Decimal(0)).plus(e.total));
  }

  const byMonth: DividendByMonth[] = Array.from(perMonth.entries())
    .sort(([a], [c]) => a.localeCompare(c))
    .map(([ym, total]) => ({
      yearMonth: ym,
      label: formatMonth(ym),
      total,
    }));

  // Últimos 12 meses
  const cutoff = new Date(referenceDate);
  cutoff.setMonth(cutoff.getMonth() - 12);
  const cutoffStr = cutoff.toISOString().substring(0, 10);

  const last12Months = provEntries
    .filter((e) => e.date >= cutoffStr)
    .reduce((acc, e) => acc.plus(e.total), new Decimal(0));

  return {
    totalReceived,
    byAsset,
    byMonth,
    last12Months,
  };
}

const MONTHS_PT = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  const monthName = MONTHS_PT[Number(m) - 1] ?? m;
  return `${monthName}/${y.slice(2)}`;
}
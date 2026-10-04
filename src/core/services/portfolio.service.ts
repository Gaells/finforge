import { Decimal } from "../domain/financial-types";
import type {
  Asset,
  Position,
  PortfolioSummary,
  Transaction,
} from "../domain/portfolio.types";

const sortByDate = (a: Transaction, b: Transaction) =>
  a.date.localeCompare(b.date);

/**
 * Calcula posição consolidada de um ativo a partir de suas transações.
 *
 * Regras:
 *  - BUY: soma na quantidade e custo total
 *  - SELL: realiza lucro/prejuízo com base no preço médio ATUAL
 *  - DIVIDEND / INCOME: acumula em dividendos recebidos (não altera posição)
 *  - SPLIT / BONUS: tratados como informação (não implementado aqui — aplicar via metadata)
 */
export function calculatePosition(
  asset: Asset,
  transactions: Transaction[],
  currentPrice: Decimal | number | null = null,
): Position {
  const sorted = [...transactions].sort(sortByDate);

  let quantity = new Decimal(0);
  let totalCost = new Decimal(0);
  let realizedPnL = new Decimal(0);
  let dividendsReceived = new Decimal(0);

  for (const tx of sorted) {
    const qty = new Decimal(tx.quantity);
    const total = new Decimal(tx.total);
    const unitPrice = new Decimal(tx.unitPrice);

    switch (tx.type) {
      case "BUY": {
        quantity = quantity.plus(qty);
        totalCost = totalCost.plus(total);
        break;
      }
      case "SELL": {
        if (quantity.isZero()) break; // nada para vender
        const sellQty = Decimal.min(qty, quantity);
        const avgPrice = totalCost.dividedBy(quantity);
        realizedPnL = realizedPnL.plus(
          unitPrice.minus(avgPrice).times(sellQty),
        );
        const costReduction = avgPrice.times(sellQty);
        totalCost = totalCost.minus(costReduction);
        quantity = quantity.minus(sellQty);
        break;
      }
      case "DIVIDEND":
      case "INCOME": {
        dividendsReceived = dividendsReceived.plus(total);
        break;
      }
      case "SPLIT":
      case "BONUS": {
        // Ignorado no cálculo padrão. Aplicação real requer tratamento especial
        // baseado em metadata (ratio). Será suportado em versão futura.
        break;
      }
    }
  }

  const avgPrice = quantity.isZero()
    ? new Decimal(0)
    : totalCost.dividedBy(quantity);

  const priceDecimal =
    currentPrice === null || currentPrice === undefined
      ? null
      : currentPrice instanceof Decimal
        ? currentPrice
        : new Decimal(currentPrice);

  const currentValue =
    priceDecimal && !quantity.isZero() ? quantity.times(priceDecimal) : null;
  const unrealizedPnL =
    currentValue && !quantity.isZero()
      ? currentValue.minus(totalCost)
      : null;
  const totalReturn = unrealizedPnL
    ? unrealizedPnL.plus(realizedPnL).plus(dividendsReceived)
    : realizedPnL.plus(dividendsReceived);

  const totalReturnPercent =
    !totalCost.isZero() && totalReturn
      ? totalReturn.dividedBy(totalCost).times(100)
      : null;

  return {
    asset,
    quantity,
    avgPrice,
    totalCost,
    realizedPnL,
    currentPrice: priceDecimal,
    currentValue,
    unrealizedPnL,
    totalReturn,
    totalReturnPercent,
    dividendsReceived,
  };
}

/**
 * Agrupa transações por assetId e calcula a posição de cada ativo.
 */
export function calculatePortfolio(
  assets: Asset[],
  transactions: Transaction[],
  currentPrices: Record<string, Decimal | number | null> = {},
): Position[] {
  const txByAsset = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const list = txByAsset.get(tx.assetId) ?? [];
    list.push(tx);
    txByAsset.set(tx.assetId, list);
  }

  return assets.map((asset) =>
    calculatePosition(
      asset,
      txByAsset.get(asset.id) ?? [],
      currentPrices[asset.id] ?? null,
    ),
  );
}

/**
 * Resume a carteira agregando todas as posições.
 * Considera apenas posições com currentValue definido para valor total.
 */
export function summarizePortfolio(positions: Position[]): PortfolioSummary {
  let totalCost = new Decimal(0);
  let totalValue = new Decimal(0);
  let totalUnrealized = new Decimal(0);
  let totalRealized = new Decimal(0);
  let totalDividends = new Decimal(0);

  for (const p of positions) {
    totalCost = totalCost.plus(p.totalCost);
    totalRealized = totalRealized.plus(p.realizedPnL);
    totalDividends = totalDividends.plus(p.dividendsReceived);
    if (p.currentValue !== null) {
      totalValue = totalValue.plus(p.currentValue);
      totalUnrealized = totalUnrealized.plus(
        p.unrealizedPnL ?? new Decimal(0),
      );
    }
  }

  const totalReturn = totalUnrealized.plus(totalRealized).plus(totalDividends);
  const totalReturnPercent = totalCost.isZero()
    ? new Decimal(0)
    : totalReturn.dividedBy(totalCost).times(100);

  return {
    totalCost,
    totalValue,
    totalUnrealized,
    totalRealized,
    totalDividends,
    totalReturn,
    totalReturnPercent,
    positionCount: positions.length,
  };
}
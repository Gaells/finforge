import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  calculatePosition,
  calculatePortfolio,
  summarizePortfolio,
} from "@/core/services/portfolio.service";
import type { Asset, Transaction } from "@/core/domain/portfolio.types";

const asset: Asset = {
  id: "a1",
  ticker: "PETR4",
  name: "Petrobras PN",
  type: "STOCK",
  currency: "BRL",
  exchange: "B3",
  sector: "Energia",
  metadata: {},
};

function tx(partial: Partial<Transaction>): Transaction {
  return {
    id: partial.id ?? Math.random().toString(),
    assetId: partial.assetId ?? "a1",
    type: partial.type ?? "BUY",
    quantity: partial.quantity ?? 0,
    unitPrice: partial.unitPrice ?? 0,
    total: partial.total ?? 0,
    fees: partial.fees ?? 0,
    currency: partial.currency ?? "BRL",
    date: partial.date ?? "2024-01-01",
    notes: partial.notes ?? null,
  };
}

describe("calculatePosition", () => {
  it("retorna zeros sem transações", () => {
    const p = calculatePosition(asset, []);
    expect(p.quantity.toNumber()).toBe(0);
    expect(p.totalCost.toNumber()).toBe(0);
    expect(p.avgPrice.toNumber()).toBe(0);
    expect(p.realizedPnL.toNumber()).toBe(0);
  });

  it("compra simples: qty=100 @ R$30", () => {
    const p = calculatePosition(asset, [
      tx({ quantity: 100, unitPrice: 30, total: 3000 }),
    ]);
    expect(p.quantity.toNumber()).toBe(100);
    expect(p.avgPrice.toNumber()).toBe(30);
    expect(p.totalCost.toNumber()).toBe(3000);
    expect(p.realizedPnL.toNumber()).toBe(0);
  });

  it("duas compras: preço médio ponderado", () => {
    const p = calculatePosition(asset, [
      tx({ id: "1", date: "2024-01-01", quantity: 100, unitPrice: 20, total: 2000 }),
      tx({ id: "2", date: "2024-02-01", quantity: 100, unitPrice: 40, total: 4000 }),
    ]);
    expect(p.quantity.toNumber()).toBe(200);
    expect(p.totalCost.toNumber()).toBe(6000);
    expect(p.avgPrice.toNumber()).toBe(30); // (2000+4000)/200
  });

  it("venda parcial com lucro", () => {
    const p = calculatePosition(asset, [
      tx({ id: "1", date: "2024-01-01", quantity: 100, unitPrice: 30, total: 3000 }),
      tx({ id: "2", date: "2024-03-01", type: "SELL", quantity: 50, unitPrice: 50, total: 2500 }),
    ]);
    expect(p.quantity.toNumber()).toBe(50);
    expect(p.totalCost.toNumber()).toBe(1500); // avg 30 * 50
    expect(p.avgPrice.toNumber()).toBe(30);
    expect(p.realizedPnL.toNumber()).toBe(1000); // (50-30)*50
  });

  it("venda parcial com prejuízo", () => {
    const p = calculatePosition(asset, [
      tx({ id: "1", date: "2024-01-01", quantity: 100, unitPrice: 30, total: 3000 }),
      tx({ id: "2", date: "2024-03-01", type: "SELL", quantity: 50, unitPrice: 20, total: 1000 }),
    ]);
    expect(p.quantity.toNumber()).toBe(50);
    expect(p.realizedPnL.toNumber()).toBe(-500); // (20-30)*50
  });

  it("venda total zera posição", () => {
    const p = calculatePosition(asset, [
      tx({ id: "1", date: "2024-01-01", quantity: 100, unitPrice: 30, total: 3000 }),
      tx({ id: "2", date: "2024-03-01", type: "SELL", quantity: 100, unitPrice: 40, total: 4000 }),
    ]);
    expect(p.quantity.toNumber()).toBe(0);
    expect(p.totalCost.toNumber()).toBe(0);
    expect(p.realizedPnL.toNumber()).toBe(1000);
  });

  it("venda sem posição é ignorada (não dá short)", () => {
    const p = calculatePosition(asset, [
      tx({ id: "1", date: "2024-03-01", type: "SELL", quantity: 50, unitPrice: 40, total: 2000 }),
    ]);
    expect(p.quantity.toNumber()).toBe(0);
    expect(p.realizedPnL.toNumber()).toBe(0);
  });

  it("dividendos não alteram posição mas são acumulados", () => {
    const p = calculatePosition(asset, [
      tx({ id: "1", date: "2024-01-01", quantity: 100, unitPrice: 30, total: 3000 }),
      tx({ id: "2", date: "2024-04-01", type: "DIVIDEND", quantity: 0, unitPrice: 0, total: 150 }),
    ]);
    expect(p.quantity.toNumber()).toBe(100);
    expect(p.dividendsReceived.toNumber()).toBe(150);
  });

  it("calcula P&L não realizado dado preço de mercado", () => {
    const p = calculatePosition(
      asset,
      [tx({ id: "1", date: "2024-01-01", quantity: 100, unitPrice: 30, total: 3000 })],
      new Decimal(35),
    );
    expect(p.currentValue?.toNumber()).toBe(3500);
    expect(p.unrealizedPnL?.toNumber()).toBe(500);
    expect(p.totalReturn?.toNumber()).toBe(500);
  });

  it("calcula retorno total incluindo dividendos", () => {
    const p = calculatePosition(
      asset,
      [
        tx({ id: "1", date: "2024-01-01", quantity: 100, unitPrice: 30, total: 3000 }),
        tx({ id: "2", date: "2024-04-01", type: "DIVIDEND", total: 200 }),
      ],
      new Decimal(40),
    );
    // valor atual 4000 - custo 3000 = 1000 unrealized
    // + realized 0
    // + dividends 200
    // total = 1200
    expect(p.totalReturn?.toNumber()).toBe(1200);
    expect(p.totalReturnPercent?.toNumber()).toBe(40); // 1200/3000 * 100
  });
});

describe("calculatePortfolio", () => {
  it("agrupa transações por assetId", () => {
    const assets: Asset[] = [
      asset,
      { ...asset, id: "a2", ticker: "VALE3", name: "Vale" },
    ];
    const txs: Transaction[] = [
      tx({ id: "1", assetId: "a1", quantity: 100, unitPrice: 30, total: 3000 }),
      tx({ id: "2", assetId: "a2", quantity: 50, unitPrice: 70, total: 3500 }),
    ];
    const positions = calculatePortfolio(assets, txs, {
      a1: new Decimal(35),
      a2: new Decimal(80),
    });
    expect(positions).toHaveLength(2);
    const petr = positions.find((p) => p.asset.id === "a1");
    const vale = positions.find((p) => p.asset.id === "a2");
    expect(petr?.currentValue?.toNumber()).toBe(3500);
    expect(vale?.currentValue?.toNumber()).toBe(4000);
  });

  it("retorna posições mesmo sem transações", () => {
    const positions = calculatePortfolio([asset], []);
    expect(positions).toHaveLength(1);
    expect(positions[0].quantity.toNumber()).toBe(0);
  });
});

describe("summarizePortfolio", () => {
  it("agrega totais corretamente", () => {
    const positions = calculatePortfolio(
      [
        asset,
        { ...asset, id: "a2", ticker: "VALE3", name: "Vale" },
      ],
      [
        tx({ id: "1", assetId: "a1", quantity: 100, unitPrice: 30, total: 3000 }),
        tx({ id: "2", assetId: "a2", quantity: 50, unitPrice: 70, total: 3500 }),
      ],
      { a1: new Decimal(35), a2: new Decimal(80) },
    );
    const summary = summarizePortfolio(positions);
    expect(summary.totalCost.toNumber()).toBe(6500);
    expect(summary.totalValue.toNumber()).toBe(7500);
    expect(summary.totalUnrealized.toNumber()).toBe(1000);
    expect(summary.positionCount).toBe(2);
  });

  it("ignora posições sem preço atual no valor total", () => {
    const positions = calculatePortfolio([asset], [
      tx({ quantity: 100, unitPrice: 30, total: 3000 }),
    ]);
    const summary = summarizePortfolio(positions);
    expect(summary.totalCost.toNumber()).toBe(3000);
    expect(summary.totalValue.toNumber()).toBe(0);
  });
});
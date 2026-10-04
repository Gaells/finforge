import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { summarizeDividends } from "@/core/services/dividends.service";
import type { Asset, Transaction } from "@/core/domain/portfolio.types";

const petr: Asset = { id: "a1", ticker: "PETR4", name: "Petrobras", type: "STOCK", currency: "BRL", exchange: null, sector: null, metadata: {} };
const vale: Asset = { id: "a2", ticker: "VALE3", name: "Vale", type: "STOCK", currency: "BRL", exchange: null, sector: null, metadata: {} };

function tx(p: Partial<Transaction>): Transaction {
  return {
    id: p.id ?? Math.random().toString(),
    assetId: p.assetId ?? "a1",
    type: p.type ?? "DIVIDEND",
    quantity: p.quantity ?? 0,
    unitPrice: p.unitPrice ?? 0,
    total: p.total ?? 0,
    fees: p.fees ?? 0,
    currency: p.currency ?? "BRL",
    date: p.date ?? "2024-01-01",
    notes: p.notes ?? null,
  };
}

describe("summarizeDividends", () => {
  it("soma dividendos por ativo", () => {
    const result = summarizeDividends(
      [petr, vale],
      [
        tx({ assetId: "a1", date: "2024-03-15", total: 100 }),
        tx({ assetId: "a1", date: "2024-09-15", total: 150 }),
        tx({ assetId: "a2", date: "2024-06-10", total: 80 }),
      ],
    );
    expect(result.totalReceived.toNumber()).toBe(330);
    const petrEntry = result.byAsset.find((b) => b.ticker === "PETR4")!;
    expect(petrEntry.total.toNumber()).toBe(250);
    const valeEntry = result.byAsset.find((b) => b.ticker === "VALE3")!;
    expect(valeEntry.total.toNumber()).toBe(80);
  });

  it("calcula yield on cost", () => {
    const result = summarizeDividends(
      [petr],
      [tx({ assetId: "a1", total: 100 })],
      { a1: new Decimal(2000) },
    );
    expect(result.byAsset[0].yieldOnCost.toNumber()).toBe(5); // 100/2000*100
  });

  it("yield on cost = 0 quando custo é 0", () => {
    const result = summarizeDividends([petr], [tx({ assetId: "a1", total: 100 })]);
    expect(result.byAsset[0].yieldOnCost.toNumber()).toBe(0);
  });

  it("agrupa por mês", () => {
    const result = summarizeDividends(
      [petr],
      [
        tx({ id: "1", date: "2024-03-15", total: 100 }),
        tx({ id: "2", date: "2024-03-30", total: 50 }),
        tx({ id: "3", date: "2024-06-10", total: 80 }),
      ],
    );
    expect(result.byMonth).toHaveLength(2);
    expect(result.byMonth[0].total.toNumber()).toBe(150); // Mar
    expect(result.byMonth[1].total.toNumber()).toBe(80);  // Jun
  });

  it("sem dividendos retorna totais zerados", () => {
    const result = summarizeDividends([petr], []);
    expect(result.totalReceived.toNumber()).toBe(0);
    expect(result.byMonth).toHaveLength(0);
    expect(result.byAsset).toHaveLength(0);
  });
});
import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { calculatePortfolio } from "@/core/services/portfolio.service";
import { calculateAllocation } from "@/core/services/allocation.service";
import type { Asset } from "@/core/domain/portfolio.types";

const stockA: Asset = { id: "1", ticker: "PETR4", name: "", type: "STOCK", currency: "BRL", exchange: null, sector: null, metadata: {} };
const stockB: Asset = { id: "2", ticker: "VALE3", name: "", type: "STOCK", currency: "BRL", exchange: null, sector: null, metadata: {} };
const fii: Asset = { id: "3", ticker: "MXRF11", name: "", type: "FII", currency: "BRL", exchange: null, sector: null, metadata: {} };

describe("calculateAllocation", () => {
  it("calcula % por classe e por ativo", () => {
    const positions = calculatePortfolio(
      [stockA, stockB, fii],
      [
        { id: "t1", assetId: "1", type: "BUY", quantity: 100, unitPrice: 30, total: 3000, fees: 0, currency: "BRL", date: "2024-01-01", notes: null },
        { id: "t2", assetId: "2", type: "BUY", quantity: 50, unitPrice: 70, total: 3500, fees: 0, currency: "BRL", date: "2024-01-01", notes: null },
        { id: "t3", assetId: "3", type: "BUY", quantity: 100, unitPrice: 10, total: 1000, fees: 0, currency: "BRL", date: "2024-01-01", notes: null },
      ],
      {
        "1": new Decimal(40),  // PETR4: 4000
        "2": new Decimal(60),  // VALE3: 3000
        "3": new Decimal(11),  // MXRF11: 1100
      },
    );
    const alloc = calculateAllocation(positions);
    expect(alloc.total.toNumber()).toBe(8100);
    // STOCK: PETR4+VALE3 = 7000 / 8100 = 86.42%
    const stock = alloc.byClass.find((c) => c.type === "STOCK")!;
    expect(stock.value.toNumber()).toBe(7000);
    expect(stock.percentage.toNumber()).toBeCloseTo(86.42, 1);
    expect(stock.positionCount).toBe(2);

    const fiiSlice = alloc.byClass.find((c) => c.type === "FII")!;
    expect(fiiSlice.value.toNumber()).toBe(1100);
    expect(fiiSlice.percentage.toNumber()).toBeCloseTo(13.58, 1);
  });

  it("emite alerta de concentração quando ativo > 20%", () => {
    const positions = calculatePortfolio(
      [stockA, fii],
      [
        { id: "t1", assetId: "1", type: "BUY", quantity: 100, unitPrice: 30, total: 3000, fees: 0, currency: "BRL", date: "2024-01-01", notes: null },
        { id: "t2", assetId: "3", type: "BUY", quantity: 10, unitPrice: 100, total: 1000, fees: 0, currency: "BRL", date: "2024-01-01", notes: null },
      ],
      {
        "1": new Decimal(30), // 3000 (27.3%)
        "3": new Decimal(800), // 8000 (72.7%)
      },
    );
    const alloc = calculateAllocation(positions, 20);
    // Ambos > 20%, então 2 warnings ordenados por % desc
    expect(alloc.concentrationWarnings).toHaveLength(2);
    expect(alloc.concentrationWarnings[0].ticker).toBe("MXRF11");
    expect(alloc.concentrationWarnings[1].ticker).toBe("PETR4");
    expect(alloc.concentrationWarnings[0].percentage.toNumber()).toBeGreaterThan(70);
  });

  it("carteira vazia retorna zeros", () => {
    const alloc = calculateAllocation([]);
    expect(alloc.total.toNumber()).toBe(0);
    expect(alloc.byClass).toHaveLength(0);
    expect(alloc.concentrationWarnings).toHaveLength(0);
  });
});
import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  calculateFixedIncomeValue,
  daysToMaturity,
} from "@/core/services/fixedIncome.service";

describe("calculateFixedIncomeValue", () => {
  it("CDI 110% por 1 ano", () => {
    const v = calculateFixedIncomeValue(
      { assetId: "x", kind: "CDB", indexer: "CDI", rate: 110, maturityDate: null, issuer: null, currentValue: null },
      new Decimal(10000),
      new Decimal(1),
      new Decimal(13.65),
    );
    // 10000 * (1 + 0.1365 * 1.10)^1 = 10000 * 1.15015 = 11501.50
    expect(v.toNumber()).toBe(11501.5);
  });

  it("IPCA+ 6% por 1 ano (IPCA=4.5%)", () => {
    const v = calculateFixedIncomeValue(
      { assetId: "x", kind: "TESOURO", indexer: "IPCA", rate: 6, maturityDate: null, issuer: null, currentValue: null },
      new Decimal(10000),
      new Decimal(1),
      new Decimal(13.65),
      new Decimal(4.5),
    );
    // 10000 * 1.06 * 1.045 = 11077
    expect(v.toNumber()).toBe(11077);
  });

  it("Prefixado 12% por 2 anos", () => {
    const v = calculateFixedIncomeValue(
      { assetId: "x", kind: "CDB", indexer: "PRE", rate: 12, maturityDate: null, issuer: null, currentValue: null },
      new Decimal(10000),
      new Decimal(2),
    );
    // 10000 * 1.12^2 = 12544
    expect(v.toNumber()).toBe(12544);
  });

  it("Prefixado 0% retorna principal", () => {
    const v = calculateFixedIncomeValue(
      { assetId: "x", kind: "CDB", indexer: "PRE", rate: 0, maturityDate: null, issuer: null, currentValue: null },
      new Decimal(10000),
      new Decimal(5),
    );
    expect(v.toNumber()).toBe(10000);
  });
});

describe("daysToMaturity", () => {
  it("futuro: retorna positivo", () => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    const iso = future.toISOString().substring(0, 10);
    const days = daysToMaturity(iso);
    expect(days).toBeGreaterThan(28);
    expect(days).toBeLessThanOrEqual(31);
  });

  it("passado: retorna negativo", () => {
    const past = new Date();
    past.setDate(past.getDate() - 10);
    const iso = past.toISOString().substring(0, 10);
    const days = daysToMaturity(iso);
    expect(days).toBeLessThan(0);
  });

  it("null: retorna null", () => {
    expect(daysToMaturity(null)).toBeNull();
  });
});
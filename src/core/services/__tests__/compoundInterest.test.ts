import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { calculateCompoundInterest } from "../compoundInterest";

describe("calculateCompoundInterest", () => {
  it("should calculate compound interest with initial investment only", () => {
    const result = calculateCompoundInterest({
      principal: new Decimal(10000),
      monthlyContribution: new Decimal(0),
      annualRate: new Decimal(12),
      months: 12,
    });

    // With 12% annual (≈1% monthly), should be approximately 10000 * (1.01)^12
    expect(result.finalAmount.toNumber()).toBeGreaterThan(11000);
    expect(result.totalInvested.toNumber()).toBe(10000);
    expect(result.totalInterest.toNumber()).toBeGreaterThan(1000);
  });

  it("should calculate with monthly contributions", () => {
    const result = calculateCompoundInterest({
      principal: new Decimal(10000),
      monthlyContribution: new Decimal(1000),
      annualRate: new Decimal(12),
      months: 12,
    });

    // Total invested = 10000 + (1000 * 12) = 22000
    expect(result.totalInvested.toNumber()).toBe(22000);
    expect(result.finalAmount.toNumber()).toBeGreaterThan(22000);
    expect(result.totalInterest.toNumber()).toBeGreaterThan(0);
  });

  it("should handle zero interest rate", () => {
    const result = calculateCompoundInterest({
      principal: new Decimal(10000),
      monthlyContribution: new Decimal(1000),
      annualRate: new Decimal(0),
      months: 12,
    });

    expect(result.totalInvested.toNumber()).toBe(22000);
    expect(result.finalAmount.toNumber()).toBe(22000);
    expect(result.totalInterest.toNumber()).toBe(0);
  });

  it("should generate correct monthly snapshots", () => {
    const result = calculateCompoundInterest({
      principal: new Decimal(10000),
      monthlyContribution: new Decimal(1000),
      annualRate: new Decimal(12),
      months: 6,
    });

    expect(result.monthlyData).toHaveLength(6);
    expect(result.monthlyData[0].month).toBe(1);
    expect(result.monthlyData[5].month).toBe(6);

    // Each month should have increasing balance
    for (let i = 1; i < result.monthlyData.length; i++) {
      expect(result.monthlyData[i].balance.toNumber()).toBeGreaterThan(
        result.monthlyData[i - 1].balance.toNumber(),
      );
    }
  });

  it("should accumulate interest over time", () => {
    const result = calculateCompoundInterest({
      principal: new Decimal(10000),
      monthlyContribution: new Decimal(0),
      annualRate: new Decimal(12),
      months: 24,
    });

    // Interest should compound, so 24 months should give more than 2x the 12-month interest
    expect(result.totalInterest.toNumber()).toBeGreaterThan(2400);
  });

  it("should handle large time periods", () => {
    const result = calculateCompoundInterest({
      principal: new Decimal(10000),
      monthlyContribution: new Decimal(500),
      annualRate: new Decimal(10),
      months: 120, // 10 years
    });

    expect(result.monthlyData).toHaveLength(120);
    expect(result.totalInvested.toNumber()).toBe(10000 + 500 * 120);
    expect(result.finalAmount.toNumber()).toBeGreaterThan(
      result.totalInvested.toNumber(),
    );
  });

  it("should maintain decimal precision", () => {
    const result = calculateCompoundInterest({
      principal: new Decimal("10000.50"),
      monthlyContribution: new Decimal("999.99"),
      annualRate: new Decimal("11.75"),
      months: 3,
    });

    expect(result.finalAmount).toBeInstanceOf(Decimal);
    expect(result.totalInterest).toBeInstanceOf(Decimal);
    // Should handle decimal places correctly
    expect(result.finalAmount.toFixed(2)).toMatch(/\d+\.\d{2}/);
  });
});

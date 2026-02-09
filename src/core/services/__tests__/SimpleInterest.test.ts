import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { calculateSimpleInterest } from "../SimpleInterest";

describe("calculateSimpleInterest", () => {
  it("should calculate simple interest correctly for yearly periods", () => {
    const result = calculateSimpleInterest({
      principal: new Decimal(10000),
      rate: new Decimal(10),
      time: 2,
      timeUnit: "years",
    });

    expect(result.interest.toNumber()).toBe(2000);
    expect(result.finalAmount.toNumber()).toBe(12000);
  });

  it("should calculate simple interest correctly for monthly periods", () => {
    const result = calculateSimpleInterest({
      principal: new Decimal(10000),
      rate: new Decimal(12),
      time: 12,
      timeUnit: "months",
    });

    // 12 months = 1 year, 10000 * 0.12 * 1 = 1200
    expect(result.interest.toNumber()).toBe(1200);
    expect(result.finalAmount.toNumber()).toBe(11200);
  });

  it("should handle zero principal", () => {
    const result = calculateSimpleInterest({
      principal: new Decimal(0),
      rate: new Decimal(10),
      time: 5,
      timeUnit: "years",
    });

    expect(result.interest.toNumber()).toBe(0);
    expect(result.finalAmount.toNumber()).toBe(0);
  });

  it("should handle zero rate", () => {
    const result = calculateSimpleInterest({
      principal: new Decimal(10000),
      rate: new Decimal(0),
      time: 5,
      timeUnit: "years",
    });

    expect(result.interest.toNumber()).toBe(0);
    expect(result.finalAmount.toNumber()).toBe(10000);
  });

  it("should calculate with fractional rates", () => {
    const result = calculateSimpleInterest({
      principal: new Decimal(10000),
      rate: new Decimal(5.5),
      time: 1,
      timeUnit: "years",
    });

    expect(result.interest.toNumber()).toBe(550);
    expect(result.finalAmount.toNumber()).toBe(10550);
  });

  it("should handle 6 months correctly", () => {
    const result = calculateSimpleInterest({
      principal: new Decimal(10000),
      rate: new Decimal(12),
      time: 6,
      timeUnit: "months",
    });

    // 6 months = 0.5 years, 10000 * 0.12 * 0.5 = 600
    expect(result.interest.toNumber()).toBe(600);
    expect(result.finalAmount.toNumber()).toBe(10600);
  });

  it("should maintain precision with decimal values", () => {
    const result = calculateSimpleInterest({
      principal: new Decimal("10000.50"),
      rate: new Decimal("10.25"),
      time: 3,
      timeUnit: "years",
    });

    const expectedInterest = new Decimal("10000.50").mul(0.1025).mul(3);
    expect(result.interest.toFixed(2)).toBe(expectedInterest.toFixed(2));
  });
});

import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  annualToMonthlyRate,
  monthlyToAnnualRate,
  convertRate,
} from "@/core/services/rateConverter";

describe("rateConverter", () => {
  describe("annualToMonthlyRate", () => {
    it("should convert 12% annual to approximately 0.9489% monthly", () => {
      const result = annualToMonthlyRate(new Decimal(12));
      expect(result.toNumber()).toBeCloseTo(0.9489, 2);
    });

    it("should convert 10% annual to approximately 0.7974% monthly", () => {
      const result = annualToMonthlyRate(new Decimal(10));
      expect(result.toNumber()).toBeCloseTo(0.7974, 2);
    });

    it("should handle 0% rate", () => {
      const result = annualToMonthlyRate(new Decimal(0));
      expect(result.toNumber()).toBe(0);
    });

    it("should handle high rates correctly", () => {
      const result = annualToMonthlyRate(new Decimal(50));
      expect(result.toNumber()).toBeGreaterThan(0);
      expect(result.toNumber()).toBeLessThan(5);
    });
  });

  describe("monthlyToAnnualRate", () => {
    it("should convert 1% monthly to approximately 12.68% annual", () => {
      const result = monthlyToAnnualRate(new Decimal(1));
      expect(result.toNumber()).toBeCloseTo(12.68, 1);
    });

    it("should convert 0.5% monthly to approximately 6.17% annual", () => {
      const result = monthlyToAnnualRate(new Decimal(0.5));
      expect(result.toNumber()).toBeCloseTo(6.17, 1);
    });

    it("should handle 0% rate", () => {
      const result = monthlyToAnnualRate(new Decimal(0));
      expect(result.toNumber()).toBe(0);
    });

    it("should be inverse of annualToMonthly (round trip)", () => {
      const annual = new Decimal(15);
      const monthly = annualToMonthlyRate(annual);
      const backToAnnual = monthlyToAnnualRate(monthly);

      expect(backToAnnual.toNumber()).toBeCloseTo(annual.toNumber(), 5);
    });
  });

  describe("convertRate", () => {
    it("should convert from annual and return both rates", () => {
      const result = convertRate(new Decimal(12), "annual");

      expect(result.annualRate.toNumber()).toBe(12);
      expect(result.monthlyRate.toNumber()).toBeCloseTo(0.9489, 2);
    });

    it("should convert from monthly and return both rates", () => {
      const result = convertRate(new Decimal(1), "monthly");

      expect(result.monthlyRate.toNumber()).toBe(1);
      expect(result.annualRate.toNumber()).toBeCloseTo(12.68, 1);
    });

    it("should maintain precision in both directions", () => {
      const annualRate = new Decimal(24);
      const resultFromAnnual = convertRate(annualRate, "annual");
      const resultFromMonthly = convertRate(
        resultFromAnnual.monthlyRate,
        "monthly",
      );

      expect(resultFromMonthly.annualRate.toNumber()).toBeCloseTo(
        annualRate.toNumber(),
        4,
      );
    });
  });
});

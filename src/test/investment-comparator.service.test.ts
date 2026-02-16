import { describe, it, expect } from "vitest";

import { InvestmentComparatorService } from "../core/services/investment-comparator.service";
import { InvestmentScenario } from "../core/domain/investment-comparator.types";

describe("InvestmentComparatorService", () => {
    it("should calculate a basic scenario correctly", () => {
        // Scenario: $10,000 initial, $1,000 monthly, 10% annual rate, 1 year
        const scenario: InvestmentScenario = {
            id: "A",
            name: "Test Scenario",
            initialAmount: 10000,
            monthlyContribution: 1000,
            annualRate: 10,
            years: 1,
        };

        // Calculate manually:
        // Monthly rate = (1.10)^(1/12) - 1 ≈ 0.007974
        // Month 1: (10000 + 1000) * (1 + 0.007974) = 11087.71
        // ... approximation is hard manually, rely on logical checks

        const result = InvestmentComparatorService["calculateScenario"](scenario);

        expect(result.totalInvested.toNumber()).toBe(10000 + 1000 * 12); // 22,000
        expect(result.finalAmount.toNumber()).toBeGreaterThan(22000);
        expect(result.timeline).toHaveLength(2); // Year 0 and Year 1
    });

    it("should compare two scenarios and identify the winner", () => {
        const scenarioA: InvestmentScenario = {
            id: "A",
            name: "Safe",
            initialAmount: 0,
            monthlyContribution: 1000,
            annualRate: 5,
            years: 10,
        };

        const scenarioB: InvestmentScenario = {
            id: "B",
            name: "Aggressive",
            initialAmount: 0,
            monthlyContribution: 1000,
            annualRate: 10,
            years: 10,
        };

        const result = InvestmentComparatorService.compare(scenarioA, scenarioB);

        expect(result.scenarioB.finalAmount.toNumber()).toBeGreaterThan(
            result.scenarioA.finalAmount.toNumber()
        );
        expect(result.difference.winnerId).toBe("B");
        expect(result.difference.percentage.toNumber()).toBeCloseTo(
            result.difference.finalAmount.dividedBy(result.scenarioB.finalAmount).times(100).toNumber()
        );
    });
});

import Decimal from "decimal.js";

export interface InvestmentScenario {
    id: string;
    name: string;
    initialAmount: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
}

export interface YearData {
    year: number;
    investedAmount: Decimal;
    interestEarned: Decimal;
    totalAmount: Decimal;
}

export interface ScenarioResult {
    scenarioId: string;
    totalInvested: Decimal;
    totalInterest: Decimal;
    finalAmount: Decimal;
    timeline: YearData[];
}

export interface ComparisonResult {
    scenarioA: ScenarioResult;
    scenarioB: ScenarioResult;
    difference: {
        finalAmount: Decimal;
        percentage: Decimal;
        winnerId: string;
    };
}

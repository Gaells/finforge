import Decimal from "decimal.js";
import {
    InvestmentScenario,
    ScenarioResult,
    ComparisonResult,
    YearData,
} from "../domain/investment-comparator.types";

export class InvestmentComparatorService {
    private static calculateScenario(scenario: InvestmentScenario, inflationRate: number = 0): ScenarioResult {
        const { initialAmount, monthlyContribution, annualRate, years } = scenario;

        const annualRateDecimal = new Decimal(annualRate).dividedBy(100);
        const monthlyRate = annualRateDecimal.plus(1).pow(new Decimal(1).dividedBy(12)).minus(1);

        const inflationRateDecimal = new Decimal(inflationRate).dividedBy(100);

        let currentBalance = new Decimal(initialAmount);
        let totalInvested = new Decimal(initialAmount);
        const timeline: YearData[] = [];

        timeline.push({
            year: 0,
            investedAmount: totalInvested,
            interestEarned: new Decimal(0),
            totalAmount: currentBalance,
            realTotalAmount: currentBalance,
        });

        for (let year = 1; year <= years; year++) {
            let yearInterest = new Decimal(0);

            for (let month = 1; month <= 12; month++) {
                currentBalance = currentBalance.plus(monthlyContribution);
                totalInvested = totalInvested.plus(monthlyContribution);
                const interest = currentBalance.times(monthlyRate);
                currentBalance = currentBalance.plus(interest);
                yearInterest = yearInterest.plus(interest);
            }

            const discountFactor = new Decimal(1).plus(inflationRateDecimal).pow(year);
            const realTotalAmount = currentBalance.dividedBy(discountFactor);

            timeline.push({
                year,
                investedAmount: totalInvested,
                interestEarned: yearInterest,
                totalAmount: currentBalance,
                realTotalAmount: realTotalAmount,
            });
        }

        const finalAmount = currentBalance;
        const totalInterest = finalAmount.minus(totalInvested);
        const realFinalAmount = timeline[timeline.length - 1].realTotalAmount;

        return {
            scenarioId: scenario.id,
            totalInvested,
            totalInterest,
            finalAmount,
            realFinalAmount,
            timeline,
        };
    }

    static compare(
        scenarioA: InvestmentScenario,
        scenarioB: InvestmentScenario,
        inflationRate: number = 0
    ): ComparisonResult {
        const resultA = this.calculateScenario(scenarioA, inflationRate);
        const resultB = this.calculateScenario(scenarioB, inflationRate);

        const diffAmount = resultA.finalAmount.minus(resultB.finalAmount);

        let diffPercent = new Decimal(0);
        if (!resultB.finalAmount.isZero()) {
            diffPercent = diffAmount.dividedBy(resultB.finalAmount).times(100);
        }

        return {
            scenarioA: resultA,
            scenarioB: resultB,
            difference: {
                finalAmount: diffAmount,
                percentage: diffPercent,
                winnerId: diffAmount.isPositive() ? scenarioA.id : scenarioB.id,
            },
        };
    }
}
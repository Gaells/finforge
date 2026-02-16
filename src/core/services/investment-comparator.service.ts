import Decimal from "decimal.js";
import {
    InvestmentScenario,
    ScenarioResult,
    ComparisonResult,
    YearData,
} from "../domain/investment-comparator.types";

export class InvestmentComparatorService {
    private static calculateScenario(scenario: InvestmentScenario): ScenarioResult {
        const { initialAmount, monthlyContribution, annualRate, years } = scenario;

        const annualRateDecimal = new Decimal(annualRate).dividedBy(100);

        const monthlyRate = annualRateDecimal.plus(1).pow(new Decimal(1).dividedBy(12)).minus(1);

        let currentBalance = new Decimal(initialAmount);
        let totalInvested = new Decimal(initialAmount);
        const timeline: YearData[] = [];

        timeline.push({
            year: 0,
            investedAmount: totalInvested,
            interestEarned: new Decimal(0),
            totalAmount: currentBalance,
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

            timeline.push({
                year,
                investedAmount: totalInvested,
                interestEarned: yearInterest,
                totalAmount: currentBalance,
            });
        }

        const finalAmount = currentBalance;
        const totalInterest = finalAmount.minus(totalInvested);

        return {
            scenarioId: scenario.id,
            totalInvested,
            totalInterest,
            finalAmount,
            timeline,
        };
    }

    static compare(
        scenarioA: InvestmentScenario,
        scenarioB: InvestmentScenario
    ): ComparisonResult {
        const resultA = this.calculateScenario(scenarioA);
        const resultB = this.calculateScenario(scenarioB);

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
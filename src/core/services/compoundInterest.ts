import {
  Decimal,
  CompoundInterestResult,
} from "../domain/financial-types";

const RateConverter = {
  annualToMonthly: (annualRate: number): Decimal => {
    return new Decimal(annualRate).div(100).div(12);
  },
};

export const CompoundInterestService = {
  calculate: (
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    years: number,
    inflationRate: number = 0
  ): CompoundInterestResult => {
    const months = years * 12;
    const monthlyRate = RateConverter.annualToMonthly(annualRate);
    const inflationRateDecimal = new Decimal(inflationRate).dividedBy(100);

    let currentBalance = new Decimal(principal);
    let totalInvested = new Decimal(principal);
    const timeline = [];

    timeline.push({
      ano: 0,
      investido: totalInvested.toNumber(),
      juros: 0,
      patrimonio: currentBalance.toNumber(),
      patrimonioReal: currentBalance.toNumber(),
    });

    for (let i = 1; i <= months; i++) {
      currentBalance = currentBalance.plus(monthlyContribution);
      totalInvested = totalInvested.plus(monthlyContribution);
      currentBalance = currentBalance.plus(currentBalance.times(monthlyRate));

      if (i % 12 === 0) {
        const year = i / 12;
        const discountFactor = new Decimal(1).plus(inflationRateDecimal).pow(year);
        const realTotalAmount = currentBalance.dividedBy(discountFactor);

        timeline.push({
          ano: year,
          investido: totalInvested.toNumber(),
          juros: currentBalance.minus(totalInvested).toNumber(),
          patrimonio: currentBalance.toNumber(),
          patrimonioReal: realTotalAmount.toNumber(),
        });
      }
    }

    const finalAmount = currentBalance;
    const totalInterest = finalAmount.minus(totalInvested);
    const realFinalAmount = new Decimal(timeline[timeline.length - 1].patrimonioReal);

    return {
      totalInvested,
      totalInterest,
      finalAmount,
      realFinalAmount,
      timeline,
    };
  },
};

export function calculateTimeToGoal(
  principal: Decimal,
  monthlyContribution: Decimal,
  annualRate: Decimal,
  goalAmount: Decimal,
): number {
  const monthlyRate = annualRate.div(100).div(12);
  let currentBalance = principal;
  let months = 0;
  const maxMonths = 1200;

  while (currentBalance.lessThan(goalAmount) && months < maxMonths) {
    currentBalance = currentBalance.plus(monthlyContribution);
    currentBalance = currentBalance.mul(new Decimal(1).plus(monthlyRate));
    months++;
  }

  return months;
}

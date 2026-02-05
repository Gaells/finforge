import {
  Decimal,
  CompoundInterestParams,
  CompoundInterestResult,
  MonthlySnapshot,
} from "../domain/financial-types";

export function calculateCompoundInterest(
  params: CompoundInterestParams,
): CompoundInterestResult {
  const { principal, monthlyContribution, annualRate, months } = params;
  const monthlyRate = annualRate.div(100).div(12);
  const monthlyData: MonthlySnapshot[] = [];
  let currentBalance = principal;
  let totalInvested = principal;

  for (let month = 1; month <= months; month++) {
    currentBalance = currentBalance.plus(monthlyContribution);
    totalInvested = totalInvested.plus(monthlyContribution);

    const interestThisMonth = currentBalance.mul(monthlyRate);
    currentBalance = currentBalance.plus(interestThisMonth);

    monthlyData.push({
      month,
      balance: currentBalance,
      invested: totalInvested,
      interest: currentBalance.minus(totalInvested),
    });
  }

  const finalAmount = currentBalance;
  const totalInterest = finalAmount.minus(totalInvested);

  return {
    finalAmount,
    totalInvested,
    totalInterest,
    monthlyData,
  };
}

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

import {
  Decimal,
  FireParams,
  FireResult,
  FireProjection,
} from "../domain/financial-types";

export function calculateFire(params: FireParams): FireResult {
  const { monthlyExpenses, monthlyRate, currentSavings, monthlyContribution } =
    params;

  const safeWithdrawalRate = monthlyRate.div(100);

  if (safeWithdrawalRate.isZero()) {
    return {
      fireNumber: new Decimal(Infinity),
      yearsToFire: Infinity,
      monthsToFire: Infinity,
      progressPercentage: 0,
      projectionData: [],
    };
  }

  const fireNumber = monthlyExpenses.div(safeWithdrawalRate);

  let currentPatrimony = currentSavings;
  let months = 0;
  const maxMonths = 1200;
  const projectionData: FireProjection[] = [];

  projectionData.push({
    year: 0,
    patrimony: currentPatrimony,
    target: fireNumber,
  });

  while (currentPatrimony.lessThan(fireNumber) && months < maxMonths) {
    currentPatrimony = currentPatrimony.plus(monthlyContribution);
    currentPatrimony = currentPatrimony.mul(
      new Decimal(1).plus(safeWithdrawalRate),
    );
    months++;

    if (months % 12 === 0) {
      projectionData.push({
        year: months / 12,
        patrimony: currentPatrimony,
        target: fireNumber,
      });
    }
  }

  if (months >= maxMonths && months % 12 !== 0) {
    projectionData.push({
      year: Math.ceil(months / 12),
      patrimony: currentPatrimony,
      target: fireNumber,
    });
  }

  const progressPercentage = currentSavings.div(fireNumber).mul(100).toNumber();

  return {
    fireNumber,
    yearsToFire: Math.floor(months / 12),
    monthsToFire: months,
    progressPercentage: Math.min(progressPercentage, 100),
    projectionData,
  };
}

export function calculateFireRule4Percent(monthlyExpenses: Decimal): Decimal {
  return monthlyExpenses.mul(12).mul(25);
}

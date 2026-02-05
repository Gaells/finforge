import { Decimal, RateConversionResult } from "../domain/financial-types";

export function annualToMonthlyRate(annualRate: Decimal): Decimal {
  const annualRateDecimal = annualRate.div(100);
  const base = new Decimal(1).plus(annualRateDecimal);
  const exponent = new Decimal(1).div(12);
  const monthlyRateDecimal = base.pow(exponent).minus(1);

  return monthlyRateDecimal.mul(100); // Retorna em percentual
}

export function monthlyToAnnualRate(monthlyRate: Decimal): Decimal {
  const monthlyRateDecimal = monthlyRate.div(100);
  const base = new Decimal(1).plus(monthlyRateDecimal);
  const annualRateDecimal = base.pow(12).minus(1);

  return annualRateDecimal.mul(100);
}

export function convertRate(
  rate: Decimal,
  from: "monthly" | "annual",
): RateConversionResult {
  if (from === "monthly") {
    return {
      monthlyRate: rate,
      annualRate: monthlyToAnnualRate(rate),
    };
  }

  return {
    monthlyRate: annualToMonthlyRate(rate),
    annualRate: rate,
  };
}

import Decimal from "decimal.js";

Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export function toDecimal(value: number | string | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
}

export function percentToDecimal(percent: number): Decimal {
  return new Decimal(percent).div(100);
}

export function annualToMonthlyRate(annualRate: number): Decimal {
  const annualDecimal = percentToDecimal(annualRate);
  return annualDecimal.plus(1).pow(new Decimal(1).div(12)).minus(1);
}

export function monthlyToAnnualRate(monthlyRate: Decimal): Decimal {
  return monthlyRate.plus(1).pow(12).minus(1);
}

export function formatCurrency(value: Decimal): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value.toNumber());
}

export function formatPercent(value: Decimal): string {
  return `${value.times(100).toFixed(2)}%`;
}

export function calculateRealRate(
  nominalRate: number,
  inflationRate: number,
): Decimal {
  const nominal = percentToDecimal(nominalRate);
  const inflation = percentToDecimal(inflationRate);

  return nominal.plus(1).div(inflation.plus(1)).minus(1);
}

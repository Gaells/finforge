import {
  Decimal,
  InflationAdjustParams,
  InflationAdjustResult,
} from "../domain/financial-types";

export function calculateInflationAdjustedValue(
  params: InflationAdjustParams,
): InflationAdjustResult {
  const { futureValue, inflationRate, years } = params;
  const rateDecimal = inflationRate.div(100);
  const denominator = new Decimal(1).plus(rateDecimal).pow(years);
  const presentValue = futureValue.div(denominator);
  const purchasingPowerLoss = futureValue.minus(presentValue);

  return {
    presentValue,
    purchasingPowerLoss,
  };
}

export function calculateFutureValueNeeded(
  presentValue: Decimal,
  inflationRate: Decimal,
  years: number,
): Decimal {
  const rateDecimal = inflationRate.div(100);
  return presentValue.mul(new Decimal(1).plus(rateDecimal).pow(years));
}

export interface InflationProjection {
  year: number;
  nominalValue: Decimal;
  realValue: Decimal;
  lossPercentage: number;
}

export function generateInflationProjection(
  initialValue: Decimal,
  inflationRate: Decimal,
  years: number,
): InflationProjection[] {
  const projection: InflationProjection[] = [];
  const rateDecimal = inflationRate.div(100);

  for (let year = 0; year <= years; year++) {
    const denominator = new Decimal(1).plus(rateDecimal).pow(year);
    const realValue = initialValue.div(denominator);
    const lossPercentage =
      year === 0
        ? 0
        : initialValue.minus(realValue).div(initialValue).mul(100).toNumber();

    projection.push({
      year,
      nominalValue: initialValue,
      realValue,
      lossPercentage,
    });
  }

  return projection;
}

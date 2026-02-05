import Decimal from "decimal.js";

// Configure Decimal.js for financial precision
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
});

export { Decimal };

export interface CompoundInterestParams {
  principal: Decimal;
  monthlyContribution: Decimal;
  annualRate: Decimal;
  months: number;
}

export interface CompoundInterestResult {
  finalAmount: Decimal;
  totalInvested: Decimal;
  totalInterest: Decimal;
  monthlyData: MonthlySnapshot[];
}

export interface MonthlySnapshot {
  month: number;
  balance: Decimal;
  invested: Decimal;
  interest: Decimal;
}

export interface SimpleInterestParams {
  principal: Decimal;
  rate: Decimal;
  time: number;
  timeUnit: "months" | "years";
}

export interface SimpleInterestResult {
  interest: Decimal;
  finalAmount: Decimal;
}

export interface FireParams {
  monthlyExpenses: Decimal;
  monthlyRate: Decimal;
  currentSavings: Decimal;
  monthlyContribution: Decimal;
}

export interface FireResult {
  fireNumber: Decimal;
  yearsToFire: number;
  monthsToFire: number;
  progressPercentage: number;
  projectionData: FireProjection[];
}

export interface FireProjection {
  year: number;
  patrimony: Decimal;
  target: Decimal;
}

export interface RateConversionResult {
  monthlyRate: Decimal;
  annualRate: Decimal;
}

export interface InflationAdjustParams {
  futureValue: Decimal;
  inflationRate: Decimal;
  years: number;
}

export interface InflationAdjustResult {
  presentValue: Decimal;
  purchasingPowerLoss: Decimal;
}

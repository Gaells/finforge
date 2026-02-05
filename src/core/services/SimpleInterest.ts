import {
  Decimal,
  SimpleInterestParams,
  SimpleInterestResult,
} from "../domain/financial-types";

export function calculateSimpleInterest(
  params: SimpleInterestParams,
): SimpleInterestResult {
  const { principal, rate, time, timeUnit } = params;

  const timeInPeriods = timeUnit === "years" ? time : new Decimal(time).div(12);

  const rateDecimal = rate.div(100);
  const interest = principal.mul(rateDecimal).mul(timeInPeriods);
  const finalAmount = principal.plus(interest);

  return {
    interest,
    finalAmount,
  };
}

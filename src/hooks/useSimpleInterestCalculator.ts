import { useState, useMemo } from "react";
import Decimal from "decimal.js";
import { calculateSimpleInterest } from "@/core/services/SimpleInterest";
import {
  TimeUnit,
  SIMPLE_INTEREST_CONSTANTS,
} from "@/core/domain/calculator-constants";

export function useSimpleInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(
    SIMPLE_INTEREST_CONSTANTS.PRINCIPAL.DEFAULT,
  );
  const [rate, setRate] = useState<number>(
    SIMPLE_INTEREST_CONSTANTS.RATE.DEFAULT,
  );
  const [time, setTime] = useState<number>(
    SIMPLE_INTEREST_CONSTANTS.TIME.MONTHS.DEFAULT,
  );
  const [timeUnit, setTimeUnit] = useState<TimeUnit>("months");

  const result = useMemo(() => {
    return calculateSimpleInterest({
      principal: new Decimal(principal),
      rate: new Decimal(rate),
      time,
      timeUnit,
    });
  }, [principal, rate, time, timeUnit]);

  const effectiveTime = timeUnit === "years" ? time : time / 12;

  const returnPercentage = result.interest
    .div(principal || 1)
    .mul(100)
    .toFixed(2);

  return {
    // State
    principal,
    rate,
    time,
    timeUnit,

    // Setters
    setPrincipal,
    setRate,
    setTime,
    setTimeUnit,

    // Computed values
    result,
    effectiveTime,
    returnPercentage,
  };
}

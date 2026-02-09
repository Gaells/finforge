import { useState, useMemo } from "react";
import Decimal from "decimal.js";
import { convertRate } from "@/core/services/rateConverter";
import { RATE_CONVERTER_CONSTANTS } from "@/core/domain/calculator-constants";

export function useRateConverter() {
  const [annualRate, setAnnualRate] = useState<number>(
    RATE_CONVERTER_CONSTANTS.ANNUAL_RATE.DEFAULT,
  );
  const [monthlyInputRate, setMonthlyInputRate] = useState<number>(
    RATE_CONVERTER_CONSTANTS.MONTHLY_RATE.DEFAULT,
  );

  const annualToMonthly = useMemo(() => {
    return convertRate(new Decimal(annualRate), "annual");
  }, [annualRate]);

  const monthlyToAnnual = useMemo(() => {
    return convertRate(new Decimal(monthlyInputRate), "monthly");
  }, [monthlyInputRate]);

  return {
    // State
    annualRate,
    monthlyInputRate,

    // Setters
    setAnnualRate,
    setMonthlyInputRate,

    // Computed values
    annualToMonthly,
    monthlyToAnnual,
  };
}

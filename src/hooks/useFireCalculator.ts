import { useState, useMemo } from "react";
import Decimal from "decimal.js";
import {
  calculateFire,
  calculateFireRule4Percent,
} from "@/core/services/fireCalculator";
import { FIRE_CALCULATOR_CONSTANTS } from "@/core/domain/calculator-constants";

export function useFireCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(
    FIRE_CALCULATOR_CONSTANTS.MONTHLY_EXPENSES.DEFAULT,
  );
  const [monthlyRate, setMonthlyRate] = useState<number>(
    FIRE_CALCULATOR_CONSTANTS.MONTHLY_RATE.DEFAULT,
  );
  const [currentSavings, setCurrentSavings] = useState<number>(
    FIRE_CALCULATOR_CONSTANTS.CURRENT_SAVINGS.DEFAULT,
  );
  const [monthlyContribution, setMonthlyContribution] = useState<number>(
    FIRE_CALCULATOR_CONSTANTS.MONTHLY_CONTRIBUTION.DEFAULT,
  );

  const result = useMemo(() => {
    return calculateFire({
      monthlyExpenses: new Decimal(monthlyExpenses),
      monthlyRate: new Decimal(monthlyRate),
      currentSavings: new Decimal(currentSavings),
      monthlyContribution: new Decimal(monthlyContribution),
    });
  }, [monthlyExpenses, monthlyRate, currentSavings, monthlyContribution]);

  const rule4Percent = useMemo(() => {
    return calculateFireRule4Percent(new Decimal(monthlyExpenses));
  }, [monthlyExpenses]);

  const chartData = useMemo(() => {
    return result.projectionData.map((d) => ({
      ano: d.year,
      patrimonio: d.patrimony.toNumber(),
      meta: d.target.toNumber(),
    }));
  }, [result]);

  const isFireReached = result.progressPercentage >= 100;

  return {
    // State
    monthlyExpenses,
    monthlyRate,
    currentSavings,
    monthlyContribution,

    // Setters
    setMonthlyExpenses,
    setMonthlyRate,
    setCurrentSavings,
    setMonthlyContribution,

    // Computed values
    result,
    rule4Percent,
    chartData,
    isFireReached,
  };
}

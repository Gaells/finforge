import { useState, useMemo } from "react";
import { CompoundInterestService } from "@/core/services/compoundInterest";
import { COMPOUND_INTEREST_CONSTANTS } from "@/core/domain/calculator-constants";

export function useCompoundInterestCalculator() {
  const [principal, setPrincipal] = useState<number>(
    COMPOUND_INTEREST_CONSTANTS.PRINCIPAL.DEFAULT,
  );
  const [monthlyContribution, setMonthlyContribution] = useState<number>(
    COMPOUND_INTEREST_CONSTANTS.MONTHLY_CONTRIBUTION.DEFAULT,
  );
  const [annualRate, setAnnualRate] = useState<number>(
    COMPOUND_INTEREST_CONSTANTS.ANNUAL_RATE.DEFAULT,
  );
  const [years, setYears] = useState<number>(COMPOUND_INTEREST_CONSTANTS.YEARS.DEFAULT);
  const [inflationRate, setInflationRate] = useState(4.5);
  const [isInflationAdjusted, setIsInflationAdjusted] = useState(false);

  const result = useMemo(() => {
    return CompoundInterestService.calculate(
      principal,
      monthlyContribution,
      annualRate,
      years,
      isInflationAdjusted ? inflationRate : 0
    );
  }, [principal, monthlyContribution, annualRate, years, inflationRate, isInflationAdjusted]);

  const chartData = useMemo(() => {
    return result.timeline.map((item) => ({
      ano: item.ano,
      investido: item.investido,
      juros: item.juros,
      patrimonio: item.patrimonio,
      patrimonioReal: item.patrimonioReal,
    }));
  }, [result]);

  return {
    // State
    principal,
    monthlyContribution,
    annualRate,
    years,
    inflationRate,
    isInflationAdjusted,

    // Setters
    setPrincipal,
    setMonthlyContribution,
    setAnnualRate,
    setYears,
    setInflationRate,
    setIsInflationAdjusted,

    // Computed values
    result,
    chartData,
  };
}

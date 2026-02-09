import { useState, useMemo } from "react";
import Decimal from "decimal.js";
import { calculateCompoundInterest } from "@/core/services/compoundInterest";
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
  const [years, setYears] = useState<number>(
    COMPOUND_INTEREST_CONSTANTS.YEARS.DEFAULT,
  );

  const result = useMemo(() => {
    return calculateCompoundInterest({
      principal: new Decimal(principal),
      monthlyContribution: new Decimal(monthlyContribution),
      annualRate: new Decimal(annualRate),
      months: years * 12,
    });
  }, [principal, monthlyContribution, annualRate, years]);

  // Prepare chart data (annual snapshots)
  const chartData = useMemo(() => {
    const data: Array<{
      ano: number;
      patrimonio: number;
      investido: number;
      juros: number;
    }> = [];

    // Add initial point
    data.push({
      ano: 0,
      patrimonio: principal,
      investido: principal,
      juros: 0,
    });

    // Add yearly data
    result.monthlyData.forEach((snapshot) => {
      if (snapshot.month % 12 === 0) {
        data.push({
          ano: snapshot.month / 12,
          patrimonio: snapshot.balance.toNumber(),
          investido: snapshot.invested.toNumber(),
          juros: snapshot.interest.toNumber(),
        });
      }
    });

    return data;
  }, [result, principal]);

  return {
    // State
    principal,
    monthlyContribution,
    annualRate,
    years,

    // Setters
    setPrincipal,
    setMonthlyContribution,
    setAnnualRate,
    setYears,

    // Computed values
    result,
    chartData,
  };
}

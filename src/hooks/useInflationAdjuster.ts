import { useState, useMemo } from "react";
import { Decimal } from "@/core/domain/financial-types";
import {
  calculateInflationAdjustedValue,
  generateInflationProjection,
} from "@/core/services/inflationAdjuster";
import { INFLATION_ADJUSTER_CONSTANTS } from "@/core/domain/calculator-constants";

export function useInflationAdjuster() {
  const [futureValue, setFutureValue] = useState<string>(
    String(INFLATION_ADJUSTER_CONSTANTS.FUTURE_VALUE.DEFAULT),
  );
  const [inflationRate, setInflationRate] = useState<number>(
    INFLATION_ADJUSTER_CONSTANTS.INFLATION_RATE.DEFAULT,
  );
  const [years, setYears] = useState<number>(
    INFLATION_ADJUSTER_CONSTANTS.YEARS.DEFAULT,
  );

  const result = useMemo(() => {
    const value = Number.parseFloat(futureValue) || 0;
    if (value <= 0) return null;

    return calculateInflationAdjustedValue({
      futureValue: new Decimal(value),
      inflationRate: new Decimal(inflationRate),
      years,
    });
  }, [futureValue, inflationRate, years]);

  const projection = useMemo(() => {
    const value = Number.parseFloat(futureValue) || 0;
    if (value <= 0) return [];

    return generateInflationProjection(
      new Decimal(value),
      new Decimal(inflationRate),
      years,
    );
  }, [futureValue, inflationRate, years]);

  const chartData = useMemo(() => {
    return projection.map((p) => ({
      year: `Ano ${p.year}`,
      valorReal: Number(p.realValue.toFixed(2)),
      valorNominal: Number(p.nominalValue.toFixed(2)),
      perda: p.lossPercentage,
    }));
  }, [projection]);

  return {
    // State
    futureValue,
    inflationRate,
    years,

    // Setters
    setFutureValue,
    setInflationRate,
    setYears,

    // Computed values
    result,
    projection,
    chartData,
  };
}

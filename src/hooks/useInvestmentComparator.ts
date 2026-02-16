import { useState, useMemo } from "react";
import { InvestmentScenario, ComparisonResult } from "../core/domain/investment-comparator.types";
import { InvestmentComparatorService } from "../core/services/investment-comparator.service";

export function useInvestmentComparator() {
    const [scenarioA, setScenarioA] = useState<InvestmentScenario>({
        id: "A",
        name: "Cenário A",
        initialAmount: 10000,
        monthlyContribution: 1000,
        annualRate: 10,
        years: 10,
    });

    const [scenarioB, setScenarioB] = useState<InvestmentScenario>({
        id: "B",
        name: "Cenário B",
        initialAmount: 10000,
        monthlyContribution: 1000,
        annualRate: 6,
        years: 10,
    });

    const [inflationRate, setInflationRate] = useState<number>(4.5);
    const [isInflationAdjusted, setIsInflationAdjusted] = useState<boolean>(false);

    const comparisonResult: ComparisonResult = useMemo(() => {
        return InvestmentComparatorService.compare(scenarioA, scenarioB, inflationRate);
    }, [scenarioA, scenarioB, inflationRate]);

    const updateScenarioA = (updates: Partial<InvestmentScenario>) => {
        setScenarioA((prev) => ({ ...prev, ...updates }));
    };

    const updateScenarioB = (updates: Partial<InvestmentScenario>) => {
        setScenarioB((prev) => ({ ...prev, ...updates }));
    };

    const setGlobalYears = (years: number) => {
        setScenarioA(prev => ({ ...prev, years }));
        setScenarioB(prev => ({ ...prev, years }));
    };

    return {
        scenarioA,
        scenarioB,
        comparisonResult,
        inputState: {
            inflationRate,
            isInflationAdjusted
        },
        updateScenarioA,
        updateScenarioB,
        setGlobalYears,
        setInflationRate,
        setIsInflationAdjusted
    };
}
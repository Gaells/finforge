import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCompoundInterestCalculator } from "../useCompoundInterestCalculator";

describe("useCompoundInterestCalculator", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    expect(result.current.principal).toBe(10000);
    expect(result.current.monthlyContribution).toBe(1000);
    expect(result.current.annualRate).toBe(12);
    expect(result.current.years).toBe(10);
  });

  it("should calculate compound interest correctly", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    expect(result.current.result.totalInvested.toNumber()).toBeGreaterThan(0);
    expect(result.current.result.finalAmount.toNumber()).toBeGreaterThan(
      result.current.result.totalInvested.toNumber(),
    );
    expect(result.current.result.totalInterest.toNumber()).toBeGreaterThan(0);
  });

  it("should update principal and recalculate", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    const initialFinalAmount = result.current.result.finalAmount.toNumber();

    act(() => {
      result.current.setPrincipal(20000);
    });

    expect(result.current.principal).toBe(20000);
    expect(result.current.result.finalAmount.toNumber()).toBeGreaterThan(
      initialFinalAmount,
    );
  });

  it("should update monthly contribution and recalculate", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    act(() => {
      result.current.setMonthlyContribution(2000);
    });

    expect(result.current.monthlyContribution).toBe(2000);
    expect(result.current.result.totalInvested.toNumber()).toBeGreaterThan(
      130000,
    );
  });

  it("should update annual rate and recalculate", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    const initialInterest = result.current.result.totalInterest.toNumber();

    act(() => {
      result.current.setAnnualRate(20);
    });

    expect(result.current.annualRate).toBe(20);
    expect(result.current.result.totalInterest.toNumber()).toBeGreaterThan(
      initialInterest,
    );
  });

  it("should update years and recalculate", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    act(() => {
      result.current.setYears(5);
    });

    expect(result.current.years).toBe(5);
    expect(result.current.result.monthlyData).toHaveLength(60);
  });

  it("should generate chart data correctly", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    expect(result.current.chartData.length).toBeGreaterThan(0);
    expect(result.current.chartData[0]).toHaveProperty("ano");
    expect(result.current.chartData[0]).toHaveProperty("patrimonio");
    expect(result.current.chartData[0]).toHaveProperty("investido");
    expect(result.current.chartData[0]).toHaveProperty("juros");
  });

  it("should include initial data point in chart", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    const firstPoint = result.current.chartData[0];
    expect(firstPoint.ano).toBe(0);
    expect(firstPoint.patrimonio).toBe(10000);
    expect(firstPoint.juros).toBe(0);
  });

  it("should handle zero contributions", () => {
    const { result } = renderHook(() => useCompoundInterestCalculator());

    act(() => {
      result.current.setMonthlyContribution(0);
    });

    expect(result.current.result.totalInvested.toNumber()).toBe(10000);
    expect(result.current.result.finalAmount.toNumber()).toBeGreaterThan(10000);
  });
});

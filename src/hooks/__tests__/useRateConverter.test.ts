import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useRateConverter } from "../useRateConverter";

describe("useRateConverter", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useRateConverter());

    expect(result.current.annualRate).toBe(12);
    expect(result.current.monthlyInputRate).toBe(1);
  });

  it("should convert annual to monthly rate", () => {
    const { result } = renderHook(() => useRateConverter());

    expect(result.current.annualToMonthly.annualRate.toNumber()).toBe(12);
    expect(result.current.annualToMonthly.monthlyRate.toNumber()).toBeCloseTo(
      0.9489,
      2,
    );
  });

  it("should convert monthly to annual rate", () => {
    const { result } = renderHook(() => useRateConverter());

    expect(result.current.monthlyToAnnual.monthlyRate.toNumber()).toBe(1);
    expect(result.current.monthlyToAnnual.annualRate.toNumber()).toBeCloseTo(
      12.68,
      1,
    );
  });

  it("should update annual rate and recalculate", () => {
    const { result } = renderHook(() => useRateConverter());

    act(() => {
      result.current.setAnnualRate(24);
    });

    expect(result.current.annualRate).toBe(24);
    expect(
      result.current.annualToMonthly.monthlyRate.toNumber(),
    ).toBeGreaterThan(1.5);
  });

  it("should update monthly rate and recalculate", () => {
    const { result } = renderHook(() => useRateConverter());

    act(() => {
      result.current.setMonthlyInputRate(2);
    });

    expect(result.current.monthlyInputRate).toBe(2);
    expect(
      result.current.monthlyToAnnual.annualRate.toNumber(),
    ).toBeGreaterThan(20);
  });

  it("should handle zero rates", () => {
    const { result } = renderHook(() => useRateConverter());

    act(() => {
      result.current.setAnnualRate(0);
      result.current.setMonthlyInputRate(0);
    });

    expect(result.current.annualToMonthly.monthlyRate.toNumber()).toBe(0);
    expect(result.current.monthlyToAnnual.annualRate.toNumber()).toBe(0);
  });

  it("should maintain conversion accuracy", () => {
    const { result } = renderHook(() => useRateConverter());

    act(() => {
      result.current.setAnnualRate(15);
    });

    const monthlyFromAnnual = result.current.annualToMonthly.monthlyRate;

    act(() => {
      result.current.setMonthlyInputRate(monthlyFromAnnual.toNumber());
    });

    const backToAnnual = result.current.monthlyToAnnual.annualRate;

    expect(backToAnnual.toNumber()).toBeCloseTo(15, 2);
  });
});

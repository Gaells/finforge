import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSimpleInterestCalculator } from "../useSimpleInterestCalculator";

describe("useSimpleInterestCalculator", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    expect(result.current.principal).toBe(10000);
    expect(result.current.rate).toBe(10);
    expect(result.current.time).toBe(12);
    expect(result.current.timeUnit).toBe("months");
  });

  it("should calculate simple interest correctly", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    // Default: 10000 principal, 10% rate, 12 months
    // Interest = 10000 * 0.10 * 1 year = 1000
    expect(result.current.result.interest.toNumber()).toBe(1000);
    expect(result.current.result.finalAmount.toNumber()).toBe(11000);
  });

  it("should update principal and recalculate", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    act(() => {
      result.current.setPrincipal(20000);
    });

    expect(result.current.principal).toBe(20000);
    expect(result.current.result.interest.toNumber()).toBe(2000);
  });

  it("should update rate and recalculate", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    act(() => {
      result.current.setRate(20);
    });

    expect(result.current.rate).toBe(20);
    expect(result.current.result.interest.toNumber()).toBe(2000);
  });

  it("should update time and recalculate", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    act(() => {
      result.current.setTime(24);
    });

    expect(result.current.time).toBe(24);
    // 24 months = 2 years, interest = 10000 * 0.10 * 2 = 2000
    expect(result.current.result.interest.toNumber()).toBe(2000);
  });

  it("should switch time unit and recalculate", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    act(() => {
      result.current.setTimeUnit("years");
      result.current.setTime(2);
    });

    expect(result.current.timeUnit).toBe("years");
    expect(result.current.effectiveTime).toBe(2);
    expect(result.current.result.interest.toNumber()).toBe(2000);
  });

  it("should calculate effective time correctly for months", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    act(() => {
      result.current.setTime(6);
      result.current.setTimeUnit("months");
    });

    expect(result.current.effectiveTime).toBe(0.5);
  });

  it("should calculate return percentage correctly", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    // Default: 1000 interest on 10000 principal = 10%
    expect(result.current.returnPercentage).toBe("10.00");
  });

  it("should handle zero principal without errors", () => {
    const { result } = renderHook(() => useSimpleInterestCalculator());

    act(() => {
      result.current.setPrincipal(0);
    });

    expect(result.current.result.interest.toNumber()).toBe(0);
    expect(result.current.result.finalAmount.toNumber()).toBe(0);
  });
});

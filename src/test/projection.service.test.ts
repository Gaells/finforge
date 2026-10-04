import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { projectPortfolio } from "@/core/services/projection.service";

describe("projectPortfolio", () => {
  it("sem aporte, sem retirada: cresce a 12% a.a.", () => {
    const r = projectPortfolio({
      initialAmount: new Decimal(10000),
        monthlyContribution: 0,
        annualRate: 12,
        years: 1,
      });
    // Com capitalização mensal, 10000 * 1.12 = 11200 exatamente
    expect(r.finalBalance.toNumber()).toBeGreaterThan(11199);
    expect(r.finalBalance.toNumber()).toBeLessThanOrEqual(11200);
    expect(r.totalContributed.toNumber()).toBe(10000);
  });

  it("com aporte mensal de R$ 1000, 12% a.a., 10 anos", () => {
    const r = projectPortfolio({
      initialAmount: new Decimal(10000),
      monthlyContribution: new Decimal(1000),
      annualRate: 12,
      years: 10,
    });
    // FV ≈ 10000*1.12^10 + 1000*((1.12^10 - 1)/r_mensal * 1.00949) ≈ 255000
    expect(r.finalBalance.toNumber()).toBeGreaterThan(240000);
    expect(r.finalBalance.toNumber()).toBeLessThan(260000);
    expect(r.totalContributed.toNumber()).toBe(130000); // 10000 + 120000
  });

  it("inclui poder de compra real quando inflação fornecida", () => {
    const r = projectPortfolio({
      initialAmount: new Decimal(10000),
      monthlyContribution: 0,
      annualRate: 12,
      years: 10,
      inflationRate: 4.5,
    });
    expect(r.realFinalBalance).not.toBeNull();
    expect(r.realFinalBalance!.lessThan(r.finalBalance)).toBe(true);
  });

  it("timeline tem years+1 pontos (incluindo ano 0)", () => {
    const r = projectPortfolio({
      initialAmount: new Decimal(10000),
      monthlyContribution: 0,
      annualRate: 10,
      years: 5,
    });
    expect(r.timeline).toHaveLength(6);
    expect(r.timeline[0].yearLabel).toBe("Hoje");
    expect(r.timeline[5].yearLabel).toBe("+5a");
  });

  it("retirada mensal reduz o patrimônio", () => {
    const r = projectPortfolio({
      initialAmount: new Decimal(100000),
      monthlyContribution: 0,
      annualRate: 8,
      years: 10,
      monthlyWithdrawal: new Decimal(500),
    });
    // deveria ser menor do que sem retirada
    const baseline = projectPortfolio({
      initialAmount: new Decimal(100000),
      monthlyContribution: 0,
      annualRate: 8,
      years: 10,
    });
    expect(r.finalBalance.toNumber()).toBeLessThan(baseline.finalBalance.toNumber());
  });
});
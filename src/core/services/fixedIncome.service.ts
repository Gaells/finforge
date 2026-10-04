import { Decimal } from "../domain/financial-types";
import type { FixedIncomeDetail } from "../domain/portfolio.types";

/**
 * Calcula o valor atual de um título de renda fixa.
 *
 * - CDI%:   valor_final = principal * (1 + (CDI_anual * pct/100))^t
 *           simplificação: assumes capitalização anual do fator.
 * - IPCA+:  valor_final = principal * (1 + taxa) * (1 + IPCA)^t
 * - PRE:    valor_final = principal * (1 + taxa)^t
 * - SELIC:  equivalente a 100% do CDI
 * - OTHER:  aplica como prefixado
 *
 * @param detail detalhes do título
 * @param principal valor investido (BRL)
 * @param yearsElapsed anos desde a aplicação (fracionário permitido)
 * @param annualCdi CDI anual em % (ex: 13.65). Necessário para indexadores CDI/SELIC.
 * @param annualIpca IPCA acumulado anual em % (ex: 4.5). Necessário para IPCA+.
 */
export function calculateFixedIncomeValue(
  detail: FixedIncomeDetail,
  principal: Decimal | number,
  yearsElapsed: Decimal | number,
  annualCdi: Decimal | number = 13.65,
  annualIpca: Decimal | number = 4.5,
): Decimal {
  const P = decimal(principal);
  const t = decimal(yearsElapsed);

  switch (detail.indexer) {
    case "CDI": {
      const cdi = decimal(annualCdi).div(100);
      const pct = new Decimal(detail.rate).div(100);
      const effectiveRate = cdi.times(pct);
      return P.times(new Decimal(1).plus(effectiveRate).pow(t));
    }
    case "SELIC": {
      const selic = decimal(annualCdi).div(100); // SELIC ~= CDI neste cálculo
      const pct = new Decimal(detail.rate).div(100);
      const effectiveRate = selic.times(pct);
      return P.times(new Decimal(1).plus(effectiveRate).pow(t));
    }
    case "IPCA": {
      const ipca = decimal(annualIpca).div(100);
      const fixed = new Decimal(detail.rate).div(100);
      return P.times(new Decimal(1).plus(fixed)).times(
        new Decimal(1).plus(ipca).pow(t),
      );
    }
    case "PRE": {
      const fixed = new Decimal(detail.rate).div(100);
      return P.times(new Decimal(1).plus(fixed).pow(t));
    }
    case "OTHER":
    default: {
      const fixed = new Decimal(detail.rate).div(100);
      return P.times(new Decimal(1).plus(fixed).pow(t));
    }
  }
}

/**
 * Dias até o vencimento (negativo se vencido).
 */
export function daysToMaturity(
  maturityDate: string | null,
  referenceDate: Date = new Date(),
): number | null {
  if (!maturityDate) return null;
  const maturity = new Date(maturityDate + "T00:00:00");
  const diff = maturity.getTime() - referenceDate.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function decimal(v: Decimal | number): Decimal {
  return v instanceof Decimal ? v : new Decimal(v);
}
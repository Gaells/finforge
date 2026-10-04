import { Decimal } from "../domain/financial-types";

export interface ProjectionParams {
  initialAmount: Decimal | number;
  monthlyContribution: Decimal | number;
  annualRate: Decimal | number; // %
  years: number;
  inflationRate?: Decimal | number; // % (opcional, para poder de compra)
  monthlyWithdrawal?: Decimal | number; // renda passiva (negativo se for retirada)
}

export interface ProjectionPoint {
  month: number;
  year: number;
  yearLabel: string;
  balance: Decimal;
  totalContributed: Decimal;
  totalInterest: Decimal;
  realBalance: Decimal | null;
}

export interface ProjectionResult {
  params: ProjectionParams;
  finalBalance: Decimal;
  totalContributed: Decimal;
  totalInterest: Decimal;
  realFinalBalance: Decimal | null;
  timeline: ProjectionPoint[];
}

/**
 * Projeta o patrimônio mês a mês com aportes e/ou retiradas.
 * Fórmula: saldo = (saldo_anterior + aporte - retirada) * (1 + taxa_mensal)
 * Onde taxa_mensal = (1 + taxa_anual)^(1/12) - 1 (capitalização composta mensal).
 */
export function projectPortfolio(params: ProjectionParams): ProjectionResult {
  const initial = decimal(params.initialAmount);
  const monthlyContribution = decimal(params.monthlyContribution);
  const annualRate = decimal(params.annualRate).div(100);
  const years = params.years;
  const inflationRate = params.inflationRate
    ? decimal(params.inflationRate).div(100)
    : null;
  const monthlyWithdrawal = params.monthlyWithdrawal
    ? decimal(params.monthlyWithdrawal)
    : new Decimal(0);

  // taxa mensal equivalente a anual
  const monthlyRate = new Decimal(1).plus(annualRate).pow(new Decimal(1).div(12)).minus(new Decimal(1));

  const months = years * 12;
  let balance = initial;
  let totalContributed = initial;

  const timeline: ProjectionPoint[] = [
      monthSnapshot(0, balance, totalContributed, inflationRate, 0),
  ];

  for (let m = 1; m <= months; m++) {
    balance = balance.plus(monthlyContribution).minus(monthlyWithdrawal);
    totalContributed = totalContributed.plus(monthlyContribution).minus(monthlyWithdrawal);
    balance = balance.times(new Decimal(1).plus(monthlyRate));

    if (m % 12 === 0) {
      timeline.push(
        monthSnapshot(m, balance, totalContributed, inflationRate, m / 12),
      );
    }
  }

  const finalBalance = balance;
  const totalInterest = finalBalance.minus(totalContributed);
  const realFinalBalance = inflationRate
    ? finalBalance.dividedBy(
        new Decimal(1).plus(inflationRate).pow(years),
      )
    : null;

  return {
    params,
    finalBalance,
    totalContributed,
    totalInterest,
    realFinalBalance,
    timeline,
  };
}

function monthSnapshot(
  month: number,
  balance: Decimal,
  contributed: Decimal,
  inflationRate: Decimal | null,
  year: number,
): ProjectionPoint {
  const realBalance =
    inflationRate && year > 0
      ? balance.dividedBy(new Decimal(1).plus(inflationRate).pow(year))
      : null;

  return {
    month,
    year,
    yearLabel: year === 0 ? "Hoje" : `+${year}a`,
    balance,
    totalContributed: contributed,
    totalInterest: balance.minus(contributed),
    realBalance,
  };
}

function decimal(v: Decimal | number): Decimal {
  return v instanceof Decimal ? v : new Decimal(v);
}
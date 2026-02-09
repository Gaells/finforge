export type TimeUnit = "months" | "years";

export const SIMPLE_INTEREST_CONSTANTS = {
  PRINCIPAL: {
    MIN: 0,
    MAX: 500000,
    STEP: 1000,
    DEFAULT: 10000,
  },
  RATE: {
    MIN: 0,
    MAX: 50,
    STEP: 0.5,
    DEFAULT: 10,
  },
  TIME: {
    MONTHS: {
      MIN: 1,
      MAX: 120,
      DEFAULT: 12,
    },
    YEARS: {
      MIN: 1,
      MAX: 30,
      DEFAULT: 1,
    },
  },
} as const;

export const TIME_UNIT_LABELS: Record<
  TimeUnit,
  { singular: string; plural: string }
> = {
  months: { singular: "mês", plural: "meses" },
  years: { singular: "ano", plural: "anos" },
};

/**
 * Constants for rate converter calculator
 */
export const RATE_CONVERTER_CONSTANTS = {
  ANNUAL_RATE: {
    MIN: 0,
    MAX: 50,
    STEP: 0.5,
    DEFAULT: 12,
  },
  MONTHLY_RATE: {
    MIN: 0,
    MAX: 5,
    STEP: 0.05,
    DEFAULT: 1,
  },
} as const;

/**
 * Constants for inflation adjuster calculator
 */
export const INFLATION_ADJUSTER_CONSTANTS = {
  FUTURE_VALUE: {
    MIN: 0,
    MAX: 10000000,
    STEP: 10000,
    DEFAULT: 100000,
  },
  INFLATION_RATE: {
    MIN: 0,
    MAX: 15,
    STEP: 0.1,
    DEFAULT: 5,
  },
  YEARS: {
    MIN: 1,
    MAX: 30,
    STEP: 1,
    DEFAULT: 10,
  },
} as const;

/**
 * Constants for FIRE calculator
 */
export const FIRE_CALCULATOR_CONSTANTS = {
  MONTHLY_EXPENSES: {
    MIN: 1000,
    MAX: 50000,
    STEP: 500,
    DEFAULT: 4000,
  },
  MONTHLY_RATE: {
    MIN: 0.1,
    MAX: 3,
    STEP: 0.1,
    DEFAULT: 1,
  },
  CURRENT_SAVINGS: {
    MIN: 0,
    MAX: 2000000,
    STEP: 10000,
    DEFAULT: 50000,
  },
  MONTHLY_CONTRIBUTION: {
    MIN: 0,
    MAX: 30000,
    STEP: 500,
    DEFAULT: 2000,
  },
} as const;

/**
 * Constants for compound interest calculator
 */
export const COMPOUND_INTEREST_CONSTANTS = {
  PRINCIPAL: {
    MIN: 0,
    MAX: 500000,
    STEP: 1000,
    DEFAULT: 10000,
  },
  MONTHLY_CONTRIBUTION: {
    MIN: 0,
    MAX: 20000,
    STEP: 100,
    DEFAULT: 1000,
  },
  ANNUAL_RATE: {
    MIN: 0,
    MAX: 30,
    STEP: 0.5,
    DEFAULT: 12,
  },
  YEARS: {
    MIN: 1,
    MAX: 50,
    STEP: 1,
    DEFAULT: 10,
  },
} as const;

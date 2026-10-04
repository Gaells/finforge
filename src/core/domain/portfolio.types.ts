import { Decimal } from "./financial-types";
import type { AssetType, Currency, TransactionType } from "@/lib/supabase/types";

export type {
  AssetType,
  Currency,
  TransactionType,
  FixedIncomeKind,
  FixedIncomeIndexer,
  ExpectedRates,
} from "@/lib/supabase/types";

export interface Asset {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  currency: Currency;
  exchange: string | null;
  sector: string | null;
  metadata: Record<string, unknown>;
}

export interface Transaction {
  id: string;
  assetId: string;
  type: TransactionType;
  quantity: number;
  unitPrice: number;
  total: number;
  fees: number;
  currency: Currency;
  date: string;
  notes: string | null;
}

export interface FixedIncomeDetail {
  assetId: string;
  kind:
    | "CDB"
    | "LCI"
    | "LCA"
    | "TESOURO"
    | "DEBENTURE"
    | "CRI"
    | "CRA"
    | "LC"
    | "OTHER";
  indexer: "PRE" | "CDI" | "IPCA" | "SELIC" | "OTHER";
  rate: number;
  maturityDate: string | null;
  issuer: string | null;
  currentValue: number | null;
}

export interface Position {
  asset: Asset;
  quantity: Decimal;
  avgPrice: Decimal;
  totalCost: Decimal;
  realizedPnL: Decimal;
  currentPrice: Decimal | null;
  currentValue: Decimal | null;
  unrealizedPnL: Decimal | null;
  totalReturn: Decimal | null;
  totalReturnPercent: Decimal | null;
  dividendsReceived: Decimal;
}

export interface PortfolioSummary {
  totalCost: Decimal;
  totalValue: Decimal;
  totalUnrealized: Decimal;
  totalRealized: Decimal;
  totalDividends: Decimal;
  totalReturn: Decimal;
  totalReturnPercent: Decimal;
  positionCount: number;
}
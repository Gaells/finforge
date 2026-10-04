/**
 * Tipos manuais do schema Supabase.
 *
 * Após rodar `npx supabase gen types typescript --project-id <id> --schema public > src/lib/supabase/types.ts`
 * este arquivo será regenerado automaticamente. Mantemos uma versão manual
 * sincronizada com `supabase/migrations/` para garantir type-safety desde o início.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AssetType =
  | "STOCK"
  | "ETF"
  | "FII"
  | "CRYPTO"
  | "FIXED_INCOME"
  | "CASH";

export type Currency = "BRL" | "USD";

export type TransactionType =
  | "BUY"
  | "SELL"
  | "DIVIDEND"
  | "INCOME"
  | "SPLIT"
  | "BONUS";

export type FixedIncomeKind =
  | "CDB"
  | "LCI"
  | "LCA"
  | "TESOURO"
  | "DEBENTURE"
  | "CRI"
  | "CRA"
  | "LC"
  | "OTHER";

export type FixedIncomeIndexer = "PRE" | "CDI" | "IPCA" | "SELIC" | "OTHER";

export interface ExpectedRates {
  STOCK: number;
  ETF: number;
  FII: number;
  CRYPTO: number;
  FIXED_INCOME: number;
  CASH: number;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          base_currency: Currency;
          expected_rates: ExpectedRates;
          ipca_annual: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          base_currency?: Currency;
          expected_rates?: ExpectedRates;
          ipca_annual?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          ticker: string;
          name: string;
          type: AssetType;
          currency: Currency;
          exchange: string | null;
          sector: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          ticker: string;
          name: string;
          type: AssetType;
          currency?: Currency;
          exchange?: string | null;
          sector?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["assets"]["Insert"]>;
        Relationships: [];
      };
      fixed_income_details: {
        Row: {
          asset_id: string;
          kind: FixedIncomeKind;
          indexer: FixedIncomeIndexer;
          rate: number;
          maturity_date: string | null;
          issuer: string | null;
          current_value: number | null;
        };
        Insert: {
          asset_id: string;
          kind: FixedIncomeKind;
          indexer: FixedIncomeIndexer;
          rate: number;
          maturity_date?: string | null;
          issuer?: string | null;
          current_value?: number | null;
        };
        Update: Partial<
          Database["public"]["Tables"]["fixed_income_details"]["Insert"]
        >;
        Relationships: [];
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          asset_id: string;
          type: TransactionType;
          quantity: number;
          unit_price: number;
          total: number;
          fees: number;
          currency: Currency;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          asset_id: string;
          type: TransactionType;
          quantity?: number;
          unit_price?: number;
          total?: number;
          fees?: number;
          currency?: Currency;
          date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transactions"]["Insert"]>;
        Relationships: [];
      };
      price_cache: {
        Row: {
          symbol: string;
          currency: Currency;
          price: number;
          source: string;
          updated_at: string;
        };
        Insert: {
          symbol: string;
          currency: Currency;
          price: number;
          source: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["price_cache"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      asset_type: AssetType;
      currency: Currency;
      transaction_type: TransactionType;
      fixed_income_kind: FixedIncomeKind;
      fixed_income_indexer: FixedIncomeIndexer;
    };
  };
}
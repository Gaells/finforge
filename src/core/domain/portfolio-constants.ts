import type { AssetType } from "@/lib/supabase/types";

export const ASSET_TYPE_OPTIONS: Array<{
  value: AssetType;
  label: string;
  hint: string;
}> = [
  { value: "STOCK", label: "Ação", hint: "ON, PN, BDR, NYSE, NASDAQ" },
  { value: "ETF", label: "ETF", hint: "Fundos negociados em bolsa" },
  { value: "FII", label: "FII", hint: "Fundos imobiliários" },
  { value: "CRYPTO", label: "Cripto", hint: "BTC, ETH e outras" },
  {
    value: "FIXED_INCOME",
    label: "Renda Fixa",
    hint: "CDB, LCI, LCA, Tesouro, Debêntures",
  },
  { value: "CASH", label: "Caixa / Conta", hint: "Conta corrente, poupança" },
];

export const FIXED_INCOME_KIND_OPTIONS = [
  { value: "CDB", label: "CDB" },
  { value: "LCI", label: "LCI" },
  { value: "LCA", label: "LCA" },
  { value: "TESOURO", label: "Tesouro Direto" },
  { value: "DEBENTURE", label: "Debênture" },
  { value: "CRI", label: "CRI" },
  { value: "CRA", label: "CRA" },
  { value: "LC", label: "Letra de Câmbio" },
  { value: "OTHER", label: "Outro" },
] as const;

export const FIXED_INCOME_INDEXER_OPTIONS = [
  { value: "PRE", label: "Prefixado", hint: "Taxa fixa anual" },
  { value: "CDI", label: "% do CDI", hint: "Ex: 110% do CDI" },
  { value: "IPCA", label: "IPCA +", hint: "Ex: IPCA + 6% a.a." },
  { value: "SELIC", label: "Selic", hint: "Ex: 100% Selic" },
  { value: "OTHER", label: "Outro" },
] as const;
import type { AssetType } from "@/lib/supabase/types";

export interface AssetClassMeta {
  label: string;
  labelPlural: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const ASSET_CLASS_META: Record<AssetType, AssetClassMeta> = {
  STOCK: {
    label: "Ação",
    labelPlural: "Ações",
    color: "hsl(217, 91%, 60%)",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  ETF: {
    label: "ETF",
    labelPlural: "ETFs",
    color: "hsl(262, 83%, 58%)",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  FII: {
    label: "FII",
    labelPlural: "FIIs",
    color: "hsl(24, 95%, 53%)",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  CRYPTO: {
    label: "Cripto",
    labelPlural: "Criptomoedas",
    color: "hsl(48, 96%, 53%)",
    bgColor: "bg-yellow-500/10",
    textColor: "text-yellow-600 dark:text-yellow-400",
  },
  FIXED_INCOME: {
    label: "Renda Fixa",
    labelPlural: "Renda Fixa",
    color: "hsl(142, 71%, 45%)",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  CASH: {
    label: "Caixa",
    labelPlural: "Contas",
    color: "hsl(220, 9%, 46%)",
    bgColor: "bg-zinc-500/10",
    textColor: "text-zinc-600 dark:text-zinc-400",
  },
};

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  BUY: "Compra",
  SELL: "Venda",
  DIVIDEND: "Dividendo",
  INCOME: "Rendimento",
  SPLIT: "Desdobramento",
  BONUS: "Bonificação",
};
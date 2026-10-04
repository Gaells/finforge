import Link from "next/link";
import {
  Plus,
  Receipt,
  ArrowDownCircle,
  ArrowUpCircle,
  Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TRANSACTION_TYPE_LABELS, ASSET_CLASS_META } from "@/core/domain/asset-classes";
import { deleteTransactionAction } from "@/app/transactions/actions";
import type { AssetType, TransactionType, Currency } from "@/lib/supabase/types";

interface TxRow {
  id: string;
  asset_id: string;
  asset_ticker: string;
  asset_name: string;
  asset_type: AssetType;
  type: TransactionType;
  quantity: number;
  unit_price: number;
  total: number;
  fees: number;
  currency: Currency;
  date: string;
  notes: string | null;
}

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("transactions")
    .select(
      "id, asset_id, type, quantity, unit_price, total, fees, currency, date, notes, assets!inner(ticker, name, type)",
    )
    .order("date", { ascending: false })
    .limit(200);

  const transactions: TxRow[] = (data ?? []).map((row: Record<string, unknown>) => {
    const asset = row.assets as { ticker: string; name: string; type: AssetType };
    return {
      id: row.id as string,
      asset_id: row.asset_id as string,
      asset_ticker: asset.ticker,
      asset_name: asset.name,
      asset_type: asset.type,
      type: row.type as TransactionType,
      quantity: row.quantity as number,
      unit_price: row.unit_price as number,
      total: row.total as number,
      fees: row.fees as number,
      currency: row.currency as Currency,
      date: row.date as string,
      notes: row.notes as string | null,
    };
  });

  const totalCount = transactions.length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalCount} {totalCount === 1 ? "registro" : "registros"} (últimos 200)
          </p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="w-4 h-4 mr-2" />
            Nova transação
          </Link>
        </Button>
      </div>

      {transactions.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Receipt className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg">Nenhuma transação registrada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Comece registrando suas compras, vendas ou dividendos.
              </p>
            </div>
            <Button asChild>
              <Link href="/transactions/new">
                <Plus className="w-4 h-4 mr-2" />
                Registrar primeira transação
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-4">
            <div className="overflow-x-auto -mx-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[hsl(var(--border)/0.6)] text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left py-3 px-2">Data</th>
                    <th className="text-left py-3 px-2">Ativo</th>
                    <th className="text-left py-3 px-2">Tipo</th>
                    <th className="text-right py-3 px-2">Qtd</th>
                    <th className="text-right py-3 px-2">Preço</th>
                    <th className="text-right py-3 px-2">Total</th>
                    <th className="text-left py-3 px-2 hidden md:table-cell">Obs</th>
                    <th className="py-3 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => {
                    const meta = ASSET_CLASS_META[tx.asset_type];
                    const isBuy = tx.type === "BUY";
                    const isSell = tx.type === "SELL";
                    const isIncome = tx.type === "DIVIDEND" || tx.type === "INCOME";
                    return (
                      <tr
                        key={tx.id}
                        className="border-b border-[hsl(var(--border)/0.4)] last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-3 px-2 whitespace-nowrap text-muted-foreground">
                          {formatDate(tx.date)}
                        </td>
                        <td className="py-3 px-2">
                          <Link
                            href={`/assets/${tx.asset_id}`}
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            <span className="font-semibold">{tx.asset_ticker}</span>
                            <Badge
                              variant="secondary"
                              className={`text-xs ${meta.bgColor} ${meta.textColor}`}
                            >
                              {meta.label}
                            </Badge>
                          </Link>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`inline-flex items-center gap-1 ${
                              isBuy
                                ? "text-emerald-600"
                                : isSell
                                  ? "text-red-600"
                                  : isIncome
                                    ? "text-blue-600"
                                    : ""
                            }`}
                          >
                            {isBuy ? (
                              <ArrowDownCircle className="w-3.5 h-3.5" />
                            ) : isSell ? (
                              <ArrowUpCircle className="w-3.5 h-3.5" />
                            ) : null}
                            {TRANSACTION_TYPE_LABELS[tx.type]}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right font-mono">
                          {tx.quantity > 0 ? tx.quantity.toLocaleString("pt-BR") : "—"}
                        </td>
                        <td className="py-3 px-2 text-right font-mono">
                          {tx.unit_price > 0
                            ? formatCurrency(tx.unit_price, tx.currency)
                            : "—"}
                        </td>
                        <td className="py-3 px-2 text-right font-mono font-semibold">
                          {tx.total > 0
                            ? formatCurrency(tx.total, tx.currency)
                            : "—"}
                        </td>
                        <td className="py-3 px-2 hidden md:table-cell text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
                          {tx.notes ?? "—"}
                        </td>
                        <td className="py-3 px-2">
                          <form action={deleteTransactionAction}>
                            <input type="hidden" name="id" value={tx.id} />
                            <button
                              type="submit"
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              aria-label="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
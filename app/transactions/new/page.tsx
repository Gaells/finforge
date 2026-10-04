import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { TransactionForm } from "@/components/portfolio/TransactionForm";

export default function NewTransactionPage() {
  return (
    <>
      <Link
        href="/transactions"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Nova transação</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Registre uma compra, venda, dividendo ou rendimento.
        </p>
      </div>
      <div className="rounded-2xl border-2 border-[hsl(var(--border)/0.6)] bg-card p-6">
        <TransactionForm />
      </div>
    </>
  );
}
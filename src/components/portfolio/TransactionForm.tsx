"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Loader2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { createTransactionAction } from "@/app/transactions/actions";
import type { AssetType } from "@/lib/supabase/types";

interface AssetOption {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  currency: string;
}

const TRANSACTION_TYPES = [
  { value: "BUY", label: "Compra", icon: ArrowDownCircle, color: "text-emerald-600" },
  { value: "SELL", label: "Venda", icon: ArrowUpCircle, color: "text-red-600" },
  { value: "DIVIDEND", label: "Dividendo", icon: ArrowUpCircle, color: "text-blue-600" },
  { value: "INCOME", label: "Rendimento", icon: ArrowUpCircle, color: "text-blue-600" },
] as const;

export function TransactionForm() {
  const [assets, setAssets] = useState<AssetOption[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      assetId: "",
      type: "BUY" as const,
      quantity: 0,
      unitPrice: 0,
      fees: 0,
      currency: "BRL",
      date: new Date().toISOString().substring(0, 10),
      notes: "",
    },
  });

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from("assets")
        .select("id, ticker, name, type, currency")
        .order("ticker");
      setAssets((data ?? []) as AssetOption[]);
      setLoadingAssets(false);
    })();
  }, []);

  const selectedAssetId = watch("assetId");
  useEffect(() => {
    const a = assets.find((x) => x.id === selectedAssetId);
    if (a) setValue("currency", a.currency);
  }, [selectedAssetId, assets, setValue]);

  const selectedType = watch("type") as string;
  const isFlow = selectedType === "BUY" || selectedType === "SELL";
  const isIncome = selectedType === "DIVIDEND" || selectedType === "INCOME";

  function onSubmit(values: Record<string, unknown>) {
    setServerError(null);
    setFieldErrors({});
    const formData = new FormData();
    for (const [k, v] of Object.entries(values)) {
      formData.set(k, String(v ?? ""));
    }
    startTransition(async () => {
      const result = await createTransactionAction({}, formData);
      if (result?.error) setServerError(result.error);
      if (result?.fieldErrors) setFieldErrors(result.fieldErrors);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Tipo de transação</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TRANSACTION_TYPES.map((t) => {
            const active = selectedType === t.value;
            const Icon = t.icon;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setValue("type", t.value as never)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                  active
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "border-[hsl(var(--border)/0.6)] hover:border-primary/40"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-primary" : t.color}`} />
                <span className={`text-sm font-medium ${active ? "text-primary" : ""}`}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="assetId">Ativo</Label>
        <select
          id="assetId"
          {...register("assetId")}
          disabled={loadingAssets}
          className="flex h-11 w-full rounded-xl border-2 border-[hsl(var(--border))] bg-background text-foreground px-3 py-2 text-sm"
        >
          <option value="">
            {loadingAssets ? "Carregando..." : "Selecione um ativo"}
          </option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.ticker} — {a.name}
            </option>
          ))}
        </select>
        {errors.assetId && (
          <p className="text-xs text-destructive">{errors.assetId.message}</p>
        )}
        {fieldErrors.assetId && (
          <p className="text-xs text-destructive">{fieldErrors.assetId}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Data</Label>
          <Input id="date" type="date" {...register("date")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Moeda</Label>
          <select
            id="currency"
            {...register("currency")}
            className="flex h-11 w-full rounded-xl border-2 border-[hsl(var(--border))] bg-background text-foreground px-3 py-2 text-sm"
          >
            <option value="BRL">BRL</option>
            <option value="USD">USD</option>
          </select>
        </div>
        {isFlow && (
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              step="any"
              min="0"
              {...register("quantity")}
              placeholder="100"
            />
          </div>
        )}
      </div>

      {isFlow && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="unitPrice">Preço unitário</Label>
            <Input
              id="unitPrice"
              type="number"
              step="0.01"
              min="0"
              {...register("unitPrice")}
              placeholder="30.50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fees">Taxas / Corretagem</Label>
            <Input
              id="fees"
              type="number"
              step="0.01"
              min="0"
              {...register("fees")}
              placeholder="0"
            />
          </div>
        </div>
      )}

      {isIncome && (
        <div className="space-y-2">
          <Label htmlFor="total">Valor recebido</Label>
          <Input
            id="total"
            type="number"
            step="0.01"
            min="0"
            value={watch("quantity") || ""}
            onChange={(e) => setValue("quantity", Number(e.target.value))}
            placeholder="150.00"
          />
          <p className="text-xs text-muted-foreground">
            Para dividendos e rendimentos, informe o valor total recebido.
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Observações (opcional)</Label>
        <Input id="notes" {...register("notes")} placeholder="Compra mensal, JCP, etc." />
      </div>

      {serverError && (
        <p className="text-sm text-destructive font-medium">{serverError}</p>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => globalThis.history.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Salvando...
            </>
          ) : (
            "Registrar transação"
          )}
        </Button>
      </div>
    </form>
  );
}
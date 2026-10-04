"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as ZodNS } from "zod";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ASSET_TYPE_OPTIONS,
  FIXED_INCOME_INDEXER_OPTIONS,
  FIXED_INCOME_KIND_OPTIONS,
} from "@/core/domain/portfolio-constants";
import {
  createAssetAction,
  updateAssetAction,
  type AssetFormValues,
} from "@/app/assets/actions";

const schema = ZodNS.object({
  ticker: ZodNS.string().trim().min(1, "Ticker obrigatório").max(20),
  name: ZodNS.string().trim().min(1, "Nome obrigatório").max(100),
  type: ZodNS.enum(["STOCK", "ETF", "FII", "CRYPTO", "FIXED_INCOME", "CASH"]),
  currency: ZodNS.enum(["BRL", "USD"]),
  exchange: ZodNS.string().trim().max(50).optional().or(ZodNS.literal("")),
  sector: ZodNS.string().trim().max(50).optional().or(ZodNS.literal("")),
});

interface AssetFormProps {
  defaultValues?: Partial<AssetFormValues>;
  mode: "create" | "edit";
}

export function AssetForm({ defaultValues, mode }: AssetFormProps) {
  const [isPending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const initialType = defaultValues?.type ?? "STOCK";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ticker: defaultValues?.ticker ?? "",
      name: defaultValues?.name ?? "",
      type: initialType,
      currency: defaultValues?.currency ?? "BRL",
      exchange: defaultValues?.exchange ?? "",
      sector: defaultValues?.sector ?? "",
    },
  });

  const selectedType = watch("type");
  const isRF = selectedType === "FIXED_INCOME";

  function onSubmit(values: Record<string, unknown>) {
    setServerError(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.set("ticker", String(values.ticker ?? ""));
    formData.set("name", String(values.name ?? ""));
    formData.set("type", String(values.type ?? ""));
    formData.set("currency", String(values.currency ?? "BRL"));
    formData.set("exchange", String(values.exchange ?? ""));
    formData.set("sector", String(values.sector ?? ""));

    if (mode === "edit" && defaultValues?.id) {
      formData.set("id", defaultValues.id);
    }

    if (values.type === "FIXED_INCOME") {
      const kindEl = document.getElementById("fi-kind") as HTMLInputElement | null;
      const indexerEl = document.getElementById("fi-indexer") as HTMLInputElement | null;
      const rateEl = document.getElementById("fi-rate") as HTMLInputElement | null;
      const maturityEl = document.getElementById("fi-maturity") as HTMLInputElement | null;
      const issuerEl = document.getElementById("fi-issuer") as HTMLInputElement | null;
      if (kindEl) formData.set("fixedIncome.kind", kindEl.value);
      if (indexerEl) formData.set("fixedIncome.indexer", indexerEl.value);
      if (rateEl) formData.set("fixedIncome.rate", rateEl.value);
      if (maturityEl) formData.set("fixedIncome.maturityDate", maturityEl.value);
      if (issuerEl) formData.set("fixedIncome.issuer", issuerEl.value);
    }

    startTransition(async () => {
      const action = mode === "create" ? createAssetAction : updateAssetAction;
      const result = await action({}, formData);
      if (result?.error) setServerError(result.error);
      if (result?.fieldErrors) setFieldErrors(result.fieldErrors);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de ativo</Label>
          <Select
            value={selectedType}
            onValueChange={(v) => setValue("type", v as never)}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASSET_TYPE_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  <div className="flex flex-col">
                    <span className="font-medium">{opt.label}</span>
                    <span className="text-xs text-muted-foreground">{opt.hint}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Moeda</Label>
          <Select
            value={watch("currency")}
            onValueChange={(v) => setValue("currency", v as never)}
          >
            <SelectTrigger id="currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BRL">BRL — Real</SelectItem>
              <SelectItem value="USD">USD — Dólar</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ticker">Ticker / Código</Label>
          <Input
            id="ticker"
            {...register("ticker")}
            placeholder={selectedType === "CRYPTO" ? "BTC" : "PETR4"}
            className="uppercase"
            aria-invalid={!!errors.ticker || !!fieldErrors.ticker}
          />
          {errors.ticker && (
            <p className="text-xs text-destructive">{errors.ticker.message as string}</p>
          )}
          {fieldErrors.ticker && (
            <p className="text-xs text-destructive">{fieldErrors.ticker}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            {...register("name")}
            placeholder="Petrobras PN"
            aria-invalid={!!errors.name || !!fieldErrors.name}
          />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message as string}</p>
          )}
        </div>
      </div>

      {(selectedType === "STOCK" ||
        selectedType === "ETF" ||
        selectedType === "FII" ||
        selectedType === "CRYPTO") && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exchange">Bolsa / Exchange</Label>
            <Input
              id="exchange"
              {...register("exchange")}
              placeholder={selectedType === "CRYPTO" ? "Binance" : "B3"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sector">Setor</Label>
            <Input
              id="sector"
              {...register("sector")}
              placeholder="Energia, Tech, Saúde..."
            />
          </div>
        </div>
      )}

      {isRF && (
        <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-4 space-y-4">
          <p className="text-sm font-semibold text-primary">Detalhes de Renda Fixa</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fi-kind">Produto</Label>
              <select
                id="fi-kind"
                defaultValue={defaultValues?.fixedIncome?.kind ?? "CDB"}
                className="flex h-10 w-full rounded-xl border-2 border-[hsl(var(--border))] bg-background text-foreground px-3 py-2 text-sm"
              >
                {FIXED_INCOME_KIND_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fi-indexer">Indexador</Label>
              <select
                id="fi-indexer"
                defaultValue={defaultValues?.fixedIncome?.indexer ?? "CDI"}
                className="flex h-10 w-full rounded-xl border-2 border-[hsl(var(--border))] bg-background text-foreground px-3 py-2 text-sm"
              >
                {FIXED_INCOME_INDEXER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fi-rate">Taxa</Label>
              <Input
                id="fi-rate"
                type="number"
                step="0.01"
                min="0"
                defaultValue={defaultValues?.fixedIncome?.rate ?? ""}
                placeholder="110 (para 110% CDI)"
              />
              <p className="text-xs text-muted-foreground">
                Ex: 110 para 110% do CDI; 13.5 para 13,5% a.a.; 6 para IPCA+6%.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fi-maturity">Vencimento</Label>
              <Input
                id="fi-maturity"
                type="date"
                defaultValue={defaultValues?.fixedIncome?.maturityDate ?? ""}
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="fi-issuer">Emissor</Label>
              <Input
                id="fi-issuer"
                defaultValue={defaultValues?.fixedIncome?.issuer ?? ""}
                placeholder="Banco, corretora ou Tesouro"
              />
            </div>
          </div>
        </div>
      )}

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
          ) : mode === "create" ? (
            "Cadastrar ativo"
          ) : (
            "Salvar alterações"
          )}
        </Button>
      </div>
    </form>
  );
}
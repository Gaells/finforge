import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { AssetForm } from "@/components/portfolio/AssetForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ASSET_CLASS_META } from "@/core/domain/asset-classes";
import { deleteAssetAction } from "@/app/assets/actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AssetDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: asset, error } = await supabase
    .from("assets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !asset) notFound();

  let fixedIncome: {
    kind: string;
    indexer: string;
    rate: number;
    maturity_date: string | null;
    issuer: string | null;
  } | null = null;
  if (asset.type === "FIXED_INCOME") {
    const { data: fi } = await supabase
      .from("fixed_income_details")
      .select("*")
      .eq("asset_id", id)
      .single();
    fixedIncome = fi;
  }

  const meta = ASSET_CLASS_META[asset.type as keyof typeof ASSET_CLASS_META];

  return (
    <>
      <Link
        href="/assets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">{asset.ticker}</h1>
            <Badge variant="secondary" className={meta?.bgColor + " " + meta?.textColor}>
              {meta?.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{asset.name}</p>
        </div>
        <form action={deleteAssetAction}>
          <input type="hidden" name="id" value={asset.id} />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border-2 border-[hsl(var(--border)/0.6)] bg-card p-6">
        <h2 className="text-lg font-semibold mb-4">Editar informações</h2>
        <AssetForm
          mode="edit"
          defaultValues={{
            id: asset.id,
            ticker: asset.ticker,
            name: asset.name,
            type: asset.type,
            currency: asset.currency,
            exchange: asset.exchange,
            sector: asset.sector,
            fixedIncome: fixedIncome
              ? {
                  kind: fixedIncome.kind as never,
                  indexer: fixedIncome.indexer as never,
                  rate: fixedIncome.rate,
                  maturityDate: fixedIncome.maturity_date,
                  issuer: fixedIncome.issuer,
                }
              : undefined,
          }}
        />
      </div>
    </>
  );
}
import Link from "next/link";
import { Coins, Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ASSET_CLASS_META } from "@/core/domain/asset-classes";
import type { AssetType } from "@/lib/supabase/types";

interface AssetRow {
  id: string;
  ticker: string;
  name: string;
  type: AssetType;
  currency: string;
  exchange: string | null;
}

export default async function AssetsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assets")
    .select("id, ticker, name, type, currency, exchange")
    .order("created_at", { ascending: false });

  const assets: AssetRow[] = (data ?? []) as AssetRow[];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Ativos</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {assets.length} {assets.length === 1 ? "ativo cadastrado" : "ativos cadastrados"}
          </p>
        </div>
        <Button asChild>
          <Link href="/assets/new">
            <Plus className="w-4 h-4 mr-2" />
            Novo ativo
          </Link>
        </Button>
      </div>

      {assets.length === 0 ? (
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Coins className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg">Nenhum ativo cadastrado</p>
              <p className="text-sm text-muted-foreground mt-1">
                Cadastre ações, FIIs, ETFs, cripto, renda fixa e contas.
              </p>
            </div>
            <Button asChild>
              <Link href="/assets/new">
                <Plus className="w-4 h-4 mr-2" />
                Cadastrar primeiro ativo
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {assets.map((asset) => {
            const meta = ASSET_CLASS_META[asset.type];
            return (
              <Link
                key={asset.id}
                href={`/assets/${asset.id}`}
                className="group rounded-2xl border-2 border-[hsl(var(--border)/0.6)] bg-card p-5 hover:border-primary/40 transition-all hover:shadow-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{asset.ticker}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {asset.name}
                    </p>
                  </div>
                  <Badge variant="secondary" className={meta.bgColor + " " + meta.textColor}>
                    {meta.label}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{asset.exchange || "—"}</span>
                  <span>{asset.currency}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
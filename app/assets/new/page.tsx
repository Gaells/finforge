import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AssetForm } from "@/components/portfolio/AssetForm";

export default function NewAssetPage() {
  return (
    <>
      <Link
        href="/assets"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Cadastrar ativo</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Adicione um novo ativo à sua carteira.
        </p>
      </div>
      <div className="rounded-2xl border-2 border-[hsl(var(--border)/0.6)] bg-card p-6">
        <AssetForm mode="create" />
      </div>
    </>
  );
}
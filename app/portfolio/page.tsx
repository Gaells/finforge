import Link from "next/link";
import {
  Coins,
  TrendingUp,
  PieChart,
  LineChart,
  Receipt,
  ArrowRight,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const sections = [
  {
    title: "Posições",
    description: "Lista de ativos, preço médio, P&L e rentabilidade por posição.",
    icon: Coins,
    href: "/portfolio/holdings",
  },
  {
    title: "Transações",
    description: "Histórico completo de compras, vendas, dividendos e aportes.",
    icon: Receipt,
    href: "/transactions",
  },
  {
    title: "Alocação",
    description: "Diversificação por classe de ativo e concentração da carteira.",
    icon: PieChart,
    href: "/portfolio/allocation",
  },
  {
    title: "Projeção",
    description: "Simule a evolução do patrimônio com aportes recorrentes.",
    icon: LineChart,
    href: "/portfolio/projection",
  },
];

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    (user?.user_metadata.display_name as string | undefined) ??
    user?.email?.split("@")[0] ??
    "investidor";

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Olá, {displayName}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Acompanhe e projete sua carteira de investimentos.
        </p>
      </div>

      <Card className="mb-8 border-2 border-dashed border-[hsl(var(--border))] bg-muted/20">
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center gap-3">
          <TrendingUp className="w-10 h-10 text-primary opacity-70" />
          <div>
            <p className="font-semibold">Sua carteira está vazia</p>
            <p className="text-sm text-muted-foreground mt-1">
              Comece cadastrando seus primeiros ativos e transações.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            <Button asChild>
              <Link href="/assets/new">
                Cadastrar ativo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/transactions/new">Nova transação</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-lg font-semibold mb-4">Acessar</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-2xl border-2 border-[hsl(var(--border)/0.6)] bg-card p-5 hover:border-primary/40 transition-all hover:shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <s.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
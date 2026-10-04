"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coins,
  Receipt,
  PieChart,
  LineChart,
  Wallet,
  Sparkles,
  ChevronLeft,
  DollarSign,
} from "lucide-react";

import { cn } from "@/lib/utils";

const sections = [
  { href: "/portfolio", label: "Visão geral", icon: LayoutDashboard },
  { href: "/portfolio/holdings", label: "Posições", icon: Coins },
  { href: "/transactions", label: "Transações", icon: Receipt },
  { href: "/portfolio/allocation", label: "Alocação", icon: PieChart },
  { href: "/portfolio/projection", label: "Projeção", icon: LineChart },
  { href: "/portfolio/simulator", label: "Simulador", icon: Sparkles },
  { href: "/portfolio/dividends", label: "Proventos", icon: DollarSign },
];

const quick = [
  { href: "/assets/new", label: "Cadastrar ativo", icon: Wallet, primary: true },
  { href: "/transactions/new", label: "Nova transação", icon: Sparkles },
];

export function PortfolioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0 border-r border-[hsl(var(--border)/0.6)] bg-card/40">
      <div className="sticky top-20 p-4 space-y-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Carteira
          </p>
          <nav className="space-y-1">
            {sections.map((s) => {
              const active = pathname === s.href;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  <s.icon className="w-4 h-4" />
                  {s.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Ações rápidas
          </p>
          <nav className="space-y-1">
            {quick.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors",
                  s.primary
                    ? "bg-gradient-to-r from-primary to-emerald-500 text-white shadow-md shadow-primary/20 hover:opacity-90"
                    : "border border-dashed border-[hsl(var(--border))] hover:bg-muted text-muted-foreground hover:text-foreground",
                )}
              >
                <s.icon className="w-4 h-4" />
                {s.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
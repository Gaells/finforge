"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Coins, Receipt, PieChart, LineChart, Sparkles, DollarSign } from "lucide-react";

import { cn } from "@/lib/utils";

const sections = [
  { href: "/portfolio", label: "Resumo", icon: LayoutDashboard },
  { href: "/portfolio/holdings", label: "Posições", icon: Coins },
  { href: "/transactions", label: "Extrato", icon: Receipt },
  { href: "/portfolio/allocation", label: "Alocação", icon: PieChart },
  { href: "/portfolio/projection", label: "Projeção", icon: LineChart },
  { href: "/portfolio/simulator", label: "Simulador", icon: Sparkles },
  { href: "/portfolio/dividends", label: "Proventos", icon: DollarSign },
];

export function PortfolioTabs() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden mb-4 -mx-4 px-4 overflow-x-auto">
      <div className="flex gap-2 min-w-max">
        {sections.map((s) => {
          const active = pathname === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-card border border-[hsl(var(--border)/0.6)] text-muted-foreground",
              )}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
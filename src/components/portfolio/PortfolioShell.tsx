import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { createClient } from "@/lib/supabase/server";
import { ForgeLogo } from "@/public/ForgeLogo";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/auth/UserMenu";
import { PortfolioSidebar } from "@/components/portfolio/PortfolioSidebar";
import { PortfolioTabs } from "@/components/portfolio/PortfolioTabs";

export async function PortfolioShell({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass-card border-b border-[hsl(var(--border)/0.6)]">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <ForgeLogo size="sm" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <PortfolioTabs />

      <div className="container mx-auto px-4 py-6 flex gap-6">
        <PortfolioSidebar />
        <div className="flex-1 min-w-0 pb-24">{children}</div>
      </div>
    </div>
  );
}
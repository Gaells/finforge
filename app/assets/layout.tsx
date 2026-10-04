import type { ReactNode } from "react";
import { PortfolioShell } from "@/components/portfolio/PortfolioShell";

export default function AssetsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PortfolioShell>{children}</PortfolioShell>;
}
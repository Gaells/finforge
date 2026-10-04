import { PortfolioSettings } from "@/components/portfolio/PortfolioSettings";

export default function PortfolioSettingsPage() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Backup, exportação e importação da carteira.
        </p>
      </div>
      <PortfolioSettings />
    </>
  );
}
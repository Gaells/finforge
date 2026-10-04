"use client";

import { useState, useTransition } from "react";
import { Download, Upload, Loader2, CheckCircle2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { exportPortfolioAction, importPortfolioAction } from "@/app/portfolio/settings/actions";

export function PortfolioSettings() {
  const [isExporting, startExport] = useTransition();
  const [isImporting, startImport] = useTransition();
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function handleExport() {
    setMessage(null);
    startExport(async () => {
      const result = await exportPortfolioAction();
      if (!result.ok || !result.data) {
        setMessage({ type: "err", text: result.error ?? "Erro ao exportar." });
        return;
      }
      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `finforge-${new Date().toISOString().substring(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setMessage({ type: "ok", text: "Backup exportado com sucesso." });
    });
  }

  function handleImport(formData: FormData) {
    setMessage(null);
    startImport(async () => {
      const result = await importPortfolioAction(undefined, formData);
      if (result.error) {
        setMessage({ type: "err", text: result.error });
        return;
      }
      setMessage({
        type: "ok",
        text: `Importação concluída (${result.imported ?? 0} ativos).`,
      });
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" />
            Exportar carteira
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Baixe um arquivo JSON com todos os seus ativos, transações e detalhes de
            renda fixa. Útil para backup ou migração.
          </p>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exportando...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Baixar JSON
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            Importar carteira
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Carregue um arquivo JSON exportado anteriormente. Ativos serão criados novamente
            na sua conta.
          </p>
          <form
            action={(fd) => handleImport(fd)}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="file"
              name="file"
              accept="application/json,.json"
              required
              className="flex-1 text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:font-medium hover:file:bg-primary/20 file:cursor-pointer"
            />
            <Button type="submit" disabled={isImporting}>
              {isImporting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Importando...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Importar
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {message && (
        <div
          className={`rounded-xl border-2 p-4 flex items-start gap-2 ${
            message.type === "ok"
              ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
              : "border-destructive/30 bg-destructive/5 text-destructive"
          }`}
        >
          {message.type === "ok" && <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />}
          <p className="text-sm">{message.text}</p>
        </div>
      )}
    </div>
  );
}
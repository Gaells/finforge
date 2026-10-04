"use client";

import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RefreshPricesButtonProps {
  onRefresh?: () => void;
}

export function RefreshPricesButton({ onRefresh }: RefreshPricesButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await fetch("/api/prices/refresh", { method: "POST" });
      onRefresh?.();
      // Refresh da página para refletir novas cotações
      globalThis.location.reload();
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
    >
      <RefreshCw className={`w-4 h-4 mr-2 ${isPending ? "animate-spin" : ""}`} />
      {isPending ? "Atualizando..." : "Atualizar cotações"}
    </Button>
  );
}
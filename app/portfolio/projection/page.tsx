import { createClient } from "@/lib/supabase/server";
import { ProjectionPanel } from "@/components/portfolio/ProjectionPanel";

export default async function ProjectionPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defaults baseados nas taxas configuradas pelo usuário (se houver)
  const defaults = {
    initialAmount: 0,
    monthlyContribution: 1000,
    annualRate: 10,
    years: 20,
    ipca: 4.5,
  };

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("expected_rates, ipca_annual")
      .eq("id", user.id)
      .single();
    if (profile) {
      // taxa média ponderada simples (igual peso por classe)
      const rates = profile.expected_rates as unknown as Record<string, number>;
      const avg =
        Object.values(rates).reduce((s, v) => s + v, 0) / Object.values(rates).length;
      defaults.annualRate = Number((avg * 100).toFixed(1));
      defaults.ipca = Number(profile.ipca_annual);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Projeção</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Simule a evolução do seu patrimônio ao longo dos anos.
        </p>
      </div>
      <ProjectionPanel defaults={defaults} />
    </>
  );
}
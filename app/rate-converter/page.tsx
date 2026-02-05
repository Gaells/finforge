'use client'

import { useState, useMemo } from "react";
import Decimal from "decimal.js";
import { Percent, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { convertRate } from "@/core/services/rateConverter";

function formatRate(value: Decimal, decimals: number = 4): string {
  return value.toFixed(decimals) + "%";
}

export default function RateConverterPage() {
  const [annualRate, setAnnualRate] = useState(12);
  const [monthlyInputRate, setMonthlyInputRate] = useState(1);

  const annualToMonthly = useMemo(() => {
    return convertRate(new Decimal(annualRate), "annual");
  }, [annualRate]);

  const monthlyToAnnual = useMemo(() => {
    return convertRate(new Decimal(monthlyInputRate), "monthly");
  }, [monthlyInputRate]);

  return (
    <CalculatorLayout
      title="Conversor de Taxas"
      description="Converta taxas anuais para mensais equivalentes e vice-versa. Essencial para comparar investimentos com diferentes periodicidades."
      icon={<Percent className="w-5 h-5" />}
    >
      <Tabs defaultValue="annual-to-monthly" className="max-w-3xl">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="annual-to-monthly">Anual → Mensal</TabsTrigger>
          <TabsTrigger value="monthly-to-annual">Mensal → Anual</TabsTrigger>
        </TabsList>

        {/* Annual to Monthly */}
        <TabsContent value="annual-to-monthly">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taxa Anual</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Taxa Anual</Label>
                    <span className="text-sm text-primary font-medium">
                      {annualRate}% a.a.
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="0.1"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
                    className="font-mono text-lg"
                  />
                  <Slider
                    value={[annualRate]}
                    onValueChange={([v]) => setAnnualRate(v)}
                    min={0}
                    max={50}
                    step={0.5}
                  />
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Taxas comuns:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[6, 10, 12, 15, 20].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setAnnualRate(rate)}
                        className="px-3 py-1 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              key={annualToMonthly.monthlyRate.toString()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                    Taxa Mensal Equivalente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-5xl font-bold text-primary">
                      {formatRate(annualToMonthly.monthlyRate, 4)}
                    </p>
                    <p className="text-muted-foreground mt-2">ao mês</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Fórmula:
                    </p>
                    <p className="font-mono text-sm">
                      i<sub>m</sub> = (1 + i<sub>a</sub>)<sup>1/12</sup> - 1
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mt-2">
                      i<sub>m</sub> = (1 + {(annualRate / 100).toFixed(4)})
                      <sup>0.0833</sup> - 1
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Monthly to Annual */}
        <TabsContent value="monthly-to-annual">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Taxa Mensal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Taxa Mensal</Label>
                    <span className="text-sm text-primary font-medium">
                      {monthlyInputRate}% a.m.
                    </span>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    value={monthlyInputRate}
                    onChange={(e) =>
                      setMonthlyInputRate(Number(e.target.value) || 0)
                    }
                    className="font-mono text-lg"
                  />
                  <Slider
                    value={[monthlyInputRate]}
                    onValueChange={([v]) => setMonthlyInputRate(v)}
                    min={0}
                    max={5}
                    step={0.05}
                  />
                </div>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Taxas comuns:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[0.5, 0.8, 1, 1.2, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setMonthlyInputRate(rate)}
                        className="px-3 py-1 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <motion.div
              key={monthlyToAnnual.annualRate.toString()}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ArrowRightLeft className="w-4 h-4 text-primary" />
                    Taxa Anual Equivalente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-5xl font-bold text-primary">
                      {formatRate(monthlyToAnnual.annualRate, 2)}
                    </p>
                    <p className="text-muted-foreground mt-2">ao ano</p>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Fórmula:
                    </p>
                    <p className="font-mono text-sm">
                      i<sub>a</sub> = (1 + i<sub>m</sub>)<sup>12</sup> - 1
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mt-2">
                      i<sub>a</sub> = (1 + {(monthlyInputRate / 100).toFixed(4)}
                      )<sup>12</sup> - 1
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="max-w-3xl mt-8 bg-muted/30">
        <CardContent className="pt-6">
          <h4 className="font-semibold mb-3">
            Por que taxas equivalentes importam?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="mb-2">
                <strong className="text-foreground">
                  Taxa simples ≠ Taxa equivalente
                </strong>
              </p>
              <p>
                12% ao ano ≠ 1% ao mês! Devido ao efeito dos juros compostos, 1%
                ao mês equivale a aproximadamente 12.68% ao ano.
              </p>
            </div>
            <div>
              <p className="mb-2">
                <strong className="text-foreground">
                  Compare corretamente
                </strong>
              </p>
              <p>
                Ao comparar investimentos, sempre converta as taxas para a mesma
                periodicidade para fazer uma comparação justa.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
}

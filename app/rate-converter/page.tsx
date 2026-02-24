"use client";

import Decimal from "decimal.js";
import { Percent, ArrowRightLeft } from "lucide-react";
import { motion } from "framer-motion";

import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SliderInputField } from "@/components/calculator/SliderInputField";
import { useRateConverter } from "@/hooks/useRateConverter";
import { RATE_CONVERTER_CONSTANTS } from "@/core/domain/calculator-constants";

function formatRate(value: Decimal, decimals: number = 4): string {
  return value.toFixed(decimals) + "%";
}

export default function RateConverterPage() {
  const {
    annualRate,
    monthlyInputRate,
    setAnnualRate,
    setMonthlyInputRate,
    annualToMonthly,
    monthlyToAnnual,
  } = useRateConverter();

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
                <SliderInputField
                  id="annual-rate"
                  label="Taxa Anual"
                  value={annualRate}
                  onChange={setAnnualRate}
                  displayValue={`${annualRate}% a.a.`}
                  inputStep="0.1"
                  min={RATE_CONVERTER_CONSTANTS.ANNUAL_RATE.MIN}
                  max={RATE_CONVERTER_CONSTANTS.ANNUAL_RATE.MAX}
                  step={RATE_CONVERTER_CONSTANTS.ANNUAL_RATE.STEP}
                />

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Taxas comuns:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[6, 10, 12, 15, 20].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setAnnualRate(rate)}
                        className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-primary transition-colors"
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

                  <div className="bg-muted rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Fórmula:
                    </p>
                    <p className="font-mono text-sm text-foreground">
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
                <SliderInputField
                  id="monthly-rate"
                  label="Taxa Mensal"
                  value={monthlyInputRate}
                  onChange={setMonthlyInputRate}
                  displayValue={`${monthlyInputRate}% a.m.`}
                  inputStep="0.01"
                  min={RATE_CONVERTER_CONSTANTS.MONTHLY_RATE.MIN}
                  max={RATE_CONVERTER_CONSTANTS.MONTHLY_RATE.MAX}
                  step={RATE_CONVERTER_CONSTANTS.MONTHLY_RATE.STEP}
                />

                <div className="pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground mb-2">
                    Taxas comuns:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[0.5, 0.8, 1, 1.2, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setMonthlyInputRate(rate)}
                        className="px-3 py-1 text-sm rounded-full bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-primary transition-colors"
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

                  <div className="bg-muted rounded-lg p-4 mt-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Fórmula:
                    </p>
                    <p className="font-mono text-sm text-foreground">
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
      <Card className="max-w-3xl mt-8 bg-muted/20 border-border">
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

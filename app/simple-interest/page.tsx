'use client'

import { useState, useMemo } from "react";
import Decimal from "decimal.js";
import { Calculator } from "lucide-react";
import { motion } from "framer-motion";

import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { calculateSimpleInterest } from "@/core/services/SimpleInterest";

function formatCurrency(value: number | Decimal): string {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(num);
}

export default function SimpleInterestPage() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(10);
  const [time, setTime] = useState(12);
  const [timeUnit, setTimeUnit] = useState<"months" | "years">("months");

  const result = useMemo(() => {
    return calculateSimpleInterest({
      principal: new Decimal(principal),
      rate: new Decimal(rate),
      time,
      timeUnit,
    });
  }, [principal, rate, time, timeUnit]);

  const effectiveTime = timeUnit === "years" ? time : time / 12;

  return (
    <CalculatorLayout
      title="Juros Simples"
      description="Calcule juros simples para empréstimos, financiamentos ou rendimentos básicos. Fórmula: J = P × i × t"
      icon={<Calculator className="w-5 h-5" />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Parâmetros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Principal */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="principal">Capital (P)</Label>
                <span className="text-sm text-primary font-medium">
                  {formatCurrency(principal)}
                </span>
              </div>
              <Input
                id="principal"
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value) || 0)}
                className="font-mono"
              />
              <Slider
                value={[principal]}
                onValueChange={([v]) => setPrincipal(v)}
                min={0}
                max={500000}
                step={1000}
                className="mt-2"
              />
            </div>

            {/* Rate */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="rate">Taxa Anual (i)</Label>
                <span className="text-sm text-primary font-medium">
                  {rate}%
                </span>
              </div>
              <Input
                id="rate"
                type="number"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value) || 0)}
                className="font-mono"
              />
              <Slider
                value={[rate]}
                onValueChange={([v]) => setRate(v)}
                min={0}
                max={50}
                step={0.5}
                className="mt-2"
              />
            </div>

            {/* Time */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="time">Tempo (t)</Label>
                <span className="text-sm text-primary font-medium">
                  {time} {timeUnit === "months" ? "meses" : "anos"}
                </span>
              </div>
              <div className="flex gap-2">
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value) || 0)}
                  className="font-mono flex-1"
                />
                <Select
                  value={timeUnit}
                  onValueChange={(v) => setTimeUnit(v as "months" | "years")}
                >
                  <SelectTrigger className="w-30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="months">Meses</SelectItem>
                    <SelectItem value="years">Anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Slider
                value={[time]}
                onValueChange={([v]) => setTime(v)}
                min={1}
                max={timeUnit === "months" ? 120 : 30}
                step={1}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Formula Display */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Fórmula aplicada:
              </p>
              <div className="font-mono text-lg">J = P × i × t</div>
              <div className="font-mono text-sm text-muted-foreground mt-2">
                J = {formatCurrency(principal)} × {rate}% ×{" "}
                {effectiveTime.toFixed(2)} anos
              </div>
            </CardContent>
          </Card>

          {/* Results Cards */}
          <motion.div
            key={result.interest.toString()}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/30">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground mb-1">Juros (J)</p>
                <p className="text-3xl font-bold text-primary">
                  {formatCurrency(result.interest)}
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <p className="text-sm opacity-90 mb-1">
                Montante Final (M = P + J)
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(result.finalAmount)}
              </p>
            </CardContent>
          </Card>

          {/* Breakdown */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Capital Inicial</span>
                <span className="font-medium">{formatCurrency(principal)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Taxa Aplicada</span>
                <span className="font-medium">{rate}% a.a.</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Período</span>
                <span className="font-medium">
                  {effectiveTime.toFixed(2)} anos ({time}{" "}
                  {timeUnit === "months" ? "meses" : "anos"})
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Rendimento Total</span>
                <span className="font-medium text-success">
                  +{result.interest.div(principal).mul(100).toFixed(2)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}

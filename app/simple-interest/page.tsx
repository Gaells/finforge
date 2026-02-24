"use client";

import { Calculator } from "lucide-react";

import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SliderInputField } from "@/components/calculator/SliderInputField";
import { ResultCard } from "@/components/calculator/ResultCard";
import { BreakdownRow } from "@/components/calculator/BreakdownRow";
import { formatCurrency } from "@/core/helpers/format-currency";
import { useSimpleInterestCalculator } from "@/hooks/useSimpleInterestCalculator";
import {
  TimeUnit,
  SIMPLE_INTEREST_CONSTANTS,
  TIME_UNIT_LABELS,
} from "@/core/domain/calculator-constants";

export default function SimpleInterestPage() {
  const {
    principal,
    rate,
    time,
    timeUnit,
    setPrincipal,
    setRate,
    setTime,
    setTimeUnit,
    result,
    effectiveTime,
    returnPercentage,
  } = useSimpleInterestCalculator();

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
            <SliderInputField
              id="principal"
              label="Capital (P)"
              value={principal}
              onChange={setPrincipal}
              displayValue={formatCurrency(principal)}
              min={SIMPLE_INTEREST_CONSTANTS.PRINCIPAL.MIN}
              max={SIMPLE_INTEREST_CONSTANTS.PRINCIPAL.MAX}
              step={SIMPLE_INTEREST_CONSTANTS.PRINCIPAL.STEP}
            />

            {/* Rate */}
            <SliderInputField
              id="rate"
              label="Taxa Anual (i)"
              value={rate}
              onChange={setRate}
              displayValue={`${rate}%`}
              inputStep="0.1"
              min={SIMPLE_INTEREST_CONSTANTS.RATE.MIN}
              max={SIMPLE_INTEREST_CONSTANTS.RATE.MAX}
              step={SIMPLE_INTEREST_CONSTANTS.RATE.STEP}
            />

            {/* Time */}
            <SliderInputField
              id="time"
              label="Tempo (t)"
              value={time}
              onChange={setTime}
              displayValue={`${time} ${TIME_UNIT_LABELS[timeUnit].plural}`}
              min={
                SIMPLE_INTEREST_CONSTANTS.TIME[
                  timeUnit === "months" ? "MONTHS" : "YEARS"
                ].MIN
              }
              max={
                SIMPLE_INTEREST_CONSTANTS.TIME[
                  timeUnit === "months" ? "MONTHS" : "YEARS"
                ].MAX
              }
              step={1}
            >
              <div className="flex gap-2">
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(Number(e.target.value) || 0)}
                  className="font-mono flex-1 text-center text-lg font-semibold transition-all focus:scale-[1.02] focus:shadow-md"
                />
                <Select
                  value={timeUnit}
                  onValueChange={(v) => setTimeUnit(v as TimeUnit)}
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
            </SliderInputField>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-6">
          {/* Formula Display */}
          <Card className="bg-muted/50 border-border">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-2">
                Fórmula aplicada:
              </p>
              <div className="font-mono text-lg text-foreground">{"J = P x i x t"}</div>
              <div className="font-mono text-sm text-muted-foreground mt-2">
                {"J = "}{formatCurrency(principal)}{" x "}{rate}%{" x "}
                {effectiveTime.toFixed(2)} anos
              </div>
            </CardContent>
          </Card>

          {/* Results Cards */}
          <ResultCard
            label="Juros (J)"
            value={formatCurrency(result.interest)}
            variant="accent"
            animated
            animationKey={result.interest.toString()}
          />

          <ResultCard
            label="Montante Final (M = P + J)"
            value={formatCurrency(result.finalAmount)}
            variant="primary"
          />

          {/* Breakdown */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <BreakdownRow
                label="Capital Inicial"
                value={formatCurrency(principal)}
              />
              <BreakdownRow label="Taxa Aplicada" value={`${rate}% a.a.`} />
              <BreakdownRow
                label="Período"
                value={`${effectiveTime.toFixed(2)} anos (${time} ${TIME_UNIT_LABELS[timeUnit].plural})`}
              />
              <BreakdownRow
                label="Rendimento Total"
                value={`+${returnPercentage}%`}
                showBorder={false}
                valueClassName="font-medium text-success"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayout>
  );
}

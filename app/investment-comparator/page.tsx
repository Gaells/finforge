"use client";

import { Scale } from "lucide-react";
import { CalculatorLayout } from "@/components/CalculatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SliderInputField } from "@/components/calculator/SliderInputField";
import { useInvestmentComparator } from "@/hooks/useInvestmentComparator";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
    Legend,
} from "recharts";

export default function InvestmentComparatorPage() {
    const {
        scenarioA,
        scenarioB,
        comparisonResult,
        updateScenarioA,
        updateScenarioB,
        setGlobalYears
    } = useInvestmentComparator();

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const chartData = comparisonResult.scenarioA.timeline.map((point, index) => {
        const pointA = point;
        const pointB = comparisonResult.scenarioB.timeline[index];
        return {
            year: point.year,
            [scenarioA.name]: pointA?.totalAmount.toNumber() || 0,
            [scenarioB.name]: pointB?.totalAmount.toNumber() || 0,
        };
    });

    const winnerName = comparisonResult.difference.winnerId === scenarioA.id ? scenarioA.name : scenarioB.name;
    const winnerColor = comparisonResult.difference.winnerId === scenarioA.id ? "hsl(var(--primary))" : "hsl(var(--accent))";

    return (
        <CalculatorLayout
            title="Comparador de Investimentos"
            description="Compare dois cenários de investimento lado a lado para tomar a melhor decisão financeira."
            icon={<Scale className="w-5 h-5" />}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="border-primary/20 bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg text-primary">{scenarioA.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SliderInputField
                            id="initial-a"
                            label="Aporte Inicial"
                            value={scenarioA.initialAmount}
                            onChange={(v) => updateScenarioA({ initialAmount: v })}
                            displayValue={formatCurrency(scenarioA.initialAmount)}
                            min={0}
                            max={1000000}
                            step={1000}
                        />
                        <SliderInputField
                            id="monthly-a"
                            label="Aporte Mensal"
                            value={scenarioA.monthlyContribution}
                            onChange={(v) => updateScenarioA({ monthlyContribution: v })}
                            displayValue={formatCurrency(scenarioA.monthlyContribution)}
                            min={0}
                            max={50000}
                            step={100}
                        />
                        <SliderInputField
                            id="rate-a"
                            label="Rentabilidade Anual"
                            value={scenarioA.annualRate}
                            onChange={(v) => updateScenarioA({ annualRate: v })}
                            displayValue={`${scenarioA.annualRate}%`}
                            min={0}
                            max={30}
                            step={0.1}
                            inputStep="0.1"
                        />
                    </CardContent>
                </Card>

                <Card className="border-accent/20 bg-accent/5">
                    <CardHeader>
                        <CardTitle className="text-lg text-accent">{scenarioB.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SliderInputField
                            id="initial-b"
                            label="Aporte Inicial"
                            value={scenarioB.initialAmount}
                            onChange={(v) => updateScenarioB({ initialAmount: v })}
                            displayValue={formatCurrency(scenarioB.initialAmount)}
                            min={0}
                            max={1000000}
                            step={1000}
                        />
                        <SliderInputField
                            id="monthly-b"
                            label="Aporte Mensal"
                            value={scenarioB.monthlyContribution}
                            onChange={(v) => updateScenarioB({ monthlyContribution: v })}
                            displayValue={formatCurrency(scenarioB.monthlyContribution)}
                            min={0}
                            max={50000}
                            step={100}
                        />
                        <SliderInputField
                            id="rate-b"
                            label="Rentabilidade Anual"
                            value={scenarioB.annualRate}
                            onChange={(v) => updateScenarioB({ annualRate: v })}
                            displayValue={`${scenarioB.annualRate}%`}
                            min={0}
                            max={30}
                            step={0.1}
                            inputStep="0.1"
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-8">
                <CardContent className="pt-6">
                    <SliderInputField
                        id="years"
                        label="Período de Comparação (Anos)"
                        value={scenarioA.years}
                        onChange={setGlobalYears}
                        displayValue={`${scenarioA.years} anos`}
                        min={1}
                        max={50}
                        step={1}
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Resultado da Comparação</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="p-4 rounded-lg bg-muted/50 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Diferença Final</p>
                            <p className="text-2xl font-bold" style={{ color: winnerColor }}>
                                {formatCurrency(comparisonResult.difference.finalAmount.toNumber())}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {comparisonResult.difference.percentage.toFixed(2)}% a mais para {winnerName}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Total {scenarioA.name}</p>
                            <p className="text-xl font-bold text-primary">
                                {formatCurrency(comparisonResult.scenarioA.finalAmount.toNumber())}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Total {scenarioB.name}</p>
                            <p className="text-xl font-bold text-accent">
                                {formatCurrency(comparisonResult.scenarioB.finalAmount.toNumber())}
                            </p>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorA" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorB" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="year" />
                                <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "8px",
                                    }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey={scenarioA.name}
                                    stroke="hsl(var(--primary))"
                                    fillOpacity={1}
                                    fill="url(#colorA)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey={scenarioB.name}
                                    stroke="hsl(var(--accent))"
                                    fillOpacity={1}
                                    fill="url(#colorB)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </CalculatorLayout>
    );
}
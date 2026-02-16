"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { SliderInputField } from "@/components/calculator/SliderInputField";

interface InflationControlsProps {
    inflationRate: number;
    setInflationRate: (value: number) => void;
    isInflationAdjusted: boolean;
    setIsInflationAdjusted: (value: boolean) => void;
}

export function InflationControls({
    inflationRate,
    setInflationRate,
    isInflationAdjusted,
    setIsInflationAdjusted,
}: InflationControlsProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between space-x-2 border p-3 rounded-lg bg-background">
                <Label htmlFor="inflation-mode" className="flex flex-col cursor-pointer">
                    <span className="font-semibold">Ajustar pela Inflação</span>
                    <span className="text-xs text-muted-foreground">
                        Ver poder de compra real
                    </span>
                </Label>
                <Switch
                    id="inflation-mode"
                    checked={isInflationAdjusted}
                    onCheckedChange={setIsInflationAdjusted}
                />
            </div>

            {isInflationAdjusted && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <SliderInputField
                        id="inflation-rate"
                        label="Taxa de Inflação (IPCA)"
                        value={inflationRate}
                        onChange={setInflationRate}
                        displayValue={`${inflationRate}%`}
                        min={0}
                        max={15}
                        step={0.1}
                        inputStep="0.1"
                    />
                </div>
            )}
        </div>
    );
}

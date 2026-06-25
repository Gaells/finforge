import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useCallback, useRef } from "react";

interface SliderInputFieldProps {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  displayValue?: string;
  inputStep?: string;
  inputClassName?: string;
  debounceMs?: number;
  children?: React.ReactNode;
}

export function SliderInputField({
  id,
  label,
  value,
  onChange,
  min,
  max,
  step,
  displayValue,
  inputStep,
  inputClassName = "font-mono",
  debounceMs = 150,
  children,
}: Readonly<SliderInputFieldProps>) {
  const [localValue, setLocalValue] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSliderChange = useCallback((values: number[]) => {
    const newValue = values[0];
    setLocalValue(newValue);
    setIsDragging(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
      setIsDragging(false);
    }, debounceMs);
  }, [onChange, debounceMs]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value) || 0;
    setLocalValue(newValue);
    onChange(newValue);
  }, [onChange]);

  const percentage = ((localValue - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <span
          className={`
            text-sm font-bold tabular-nums transition-all duration-200
            ${isDragging ? "text-primary scale-105" : "text-foreground"}
          `}
        >
          {displayValue ?? localValue}
        </span>
      </div>
      
      {children || (
        <Input
          id={id}
          type="number"
          step={inputStep}
          value={localValue}
          onChange={handleInputChange}
          min={min}
          max={max}
          className={`
            ${inputClassName} 
            text-center text-base md:text-lg font-semibold 
            h-12 md:h-14 
            transition-all duration-200 
            focus:scale-[1.02] focus:shadow-lg focus:shadow-primary/10
            active:scale-[1.01]
          `}
        />
      )}
      
      <div className="relative pt-1 pb-2">
        <Slider
          value={[localValue]}
          onValueChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          className="relative z-10"
        />
        <div 
          className="absolute bottom-4 left-0 h-1.5 bg-primary/20 rounded-full w-full overflow-hidden"
        >
          <div 
            className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-75"
            style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

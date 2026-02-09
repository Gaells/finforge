import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

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
  children,
}: Readonly<SliderInputFieldProps>) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Label htmlFor={id}>{label}</Label>
        <span className="text-sm text-primary font-medium">
          {displayValue ?? value}
        </span>
      </div>
      {children || (
        <Input
          id={id}
          type="number"
          step={inputStep}
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          className={`${inputClassName} text-center text-lg font-semibold transition-all focus:scale-[1.02] focus:shadow-md`}
        />
      )}
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
        className="mt-2"
      />
    </div>
  );
}

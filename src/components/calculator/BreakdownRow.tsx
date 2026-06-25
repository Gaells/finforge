interface BreakdownRowProps {
  label: string;
  value: string;
  showBorder?: boolean;
  valueClassName?: string;
}

export function BreakdownRow({
  label,
  value,
  showBorder = true,
  valueClassName = "font-medium",
}: Readonly<BreakdownRowProps>) {
  const borderClass = showBorder ? "border-b border-[hsl(var(--border)/0.5)]" : "";

  return (
    <div className={`flex justify-between items-center py-2 ${borderClass}`}>
      <span className="text-muted-foreground">{label}</span>
      <span className={valueClassName}>{value}</span>
    </div>
  );
}

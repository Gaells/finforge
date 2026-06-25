import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ResultCardProps {
  label: string;
  value: string;
  variant?: "default" | "primary" | "accent" | "success" | "warning" | "danger";
  animated?: boolean;
  animationKey?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function ResultCard({
  label,
  value,
  variant = "default",
  animated = false,
  animationKey,
  trend,
  trendValue,
  icon,
  className,
}: Readonly<ResultCardProps>) {
  const getCardClassName = () => {
    const baseClasses = "transition-all duration-300 hover:shadow-lg hover:shadow-primary/5";
    
    switch (variant) {
      case "primary":
        return cn(
          "bg-primary text-primary-foreground shadow-lg shadow-primary/20",
          baseClasses
        );
      case "accent":
        return cn(
          "bg-accent text-accent-foreground shadow-lg shadow-accent/20",
          baseClasses
        );
      case "success":
        return cn(
          "bg-success/10 border-success/30 text-success",
          baseClasses
        );
      case "warning":
        return cn(
          "bg-warning/10 border-warning/30",
          baseClasses
        );
      case "danger":
        return cn(
          "bg-destructive/10 border-destructive/30 text-destructive",
          baseClasses
        );
      default:
        return cn(
          "bg-card border-[hsl(var(--border)/0.5)] hover:border-[hsl(var(--border))]",
          baseClasses,
          className
        );
    }
  };

  const getLabelClassName = () => {
    if (variant === "primary" || variant === "accent") {
      return "text-sm opacity-90 mb-1";
    }
    return "text-sm text-muted-foreground mb-1";
  };

  const getValueClassName = () => {
    const baseClasses = "text-2xl md:text-3xl font-bold";
    
    if (variant === "default") {
      return cn(baseClasses, "text-foreground");
    }
    return baseClasses;
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4" />;
      case "down":
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColorClass = () => {
    switch (trend) {
      case "up":
        return "text-success";
      case "down":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const content = (
    <Card className={getCardClassName()}>
      <CardContent className="pt-5 pb-5 px-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={getLabelClassName()}>{label}</p>
            <p className={getValueClassName()}>{value}</p>
            
            {trend && trendValue && (
              <div className={cn("flex items-center gap-1 mt-2 text-sm", getTrendColorClass())}>
                {getTrendIcon()}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
              variant === "primary" || variant === "accent"
                ? "bg-white/20"
                : "bg-primary/10 text-primary"
            )}>
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (animated) {
    return (
      <motion.div
        key={animationKey}
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

interface ResultGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ResultGrid({ children, className }: ResultGridProps) {
  return (
    <div className={cn(
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
      className
    )}>
      {children}
    </div>
  );
}

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
  label: string;
  value: string;
  variant?: "default" | "primary" | "accent";
  animated?: boolean;
  animationKey?: string;
}

export function ResultCard({
  label,
  value,
  variant = "default",
  animated = false,
  animationKey,
}: Readonly<ResultCardProps>) {
  const getCardClassName = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-primary-foreground";
      case "accent":
        return "border-primary/30";
      default:
        return "";
    }
  };

  const getLabelClassName = () => {
    if (variant === "primary") {
      return "text-sm opacity-90 mb-1";
    }
    return "text-sm text-muted-foreground mb-1";
  };

  const content = (
    <Card className={getCardClassName()}>
      <CardContent className="pt-6">
        <p className={getLabelClassName()}>{label}</p>
        <p className="text-3xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );

  if (animated) {
    return (
      <motion.div
        key={animationKey}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}

import { cn } from "@/lib/utils";

interface ForgeLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function ForgeLogo({ className, showText = true, size = "md" }: ForgeLogoProps) {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-3xl",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizes[size])}>
        {/* Anvil/Forge Icon */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="forgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(160, 84%, 45%)" />
              <stop offset="100%" stopColor="hsl(172, 66%, 50%)" />
            </linearGradient>
          </defs>
          
          {/* Chart bars rising like flames from anvil */}
          <rect x="8" y="18" width="5" height="14" rx="1" fill="url(#forgeGradient)" opacity="0.6" />
          <rect x="17" y="12" width="6" height="20" rx="1" fill="url(#forgeGradient)" opacity="0.8" />
          <rect x="27" y="6" width="5" height="26" rx="1" fill="url(#forgeGradient)" />
          
          {/* Base anvil shape */}
          <rect x="4" y="32" width="32" height="4" rx="2" fill="url(#forgeGradient)" />
        </svg>
      </div>
      
      {showText && (
        <span className={cn(
          "font-display font-bold tracking-tight",
          textSizes[size]
        )}>
          <span className="text-gradient">Fin</span>
          <span className="text-foreground">Forge</span>
        </span>
      )}
    </div>
  );
}

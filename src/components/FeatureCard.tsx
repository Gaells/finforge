import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  gradient?: "primary" | "wealth" | "accent";
  delay?: number;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  delay = 0,
}: Readonly<FeatureCardProps>) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "group relative flex flex-col p-6 rounded-2xl",
        "bg-white/80 dark:bg-zinc-900/80",
        "backdrop-blur-xl",
        "border border-border/50 dark:border-zinc-800/50",
        "shadow-sm hover:shadow-xl hover:shadow-primary/10",
        "transition-all duration-300 ease-out",
        "cursor-pointer overflow-hidden"
      )}
    >
      <div 
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-primary/5 via-transparent to-accent/5",
          "transition-opacity duration-500"
        )}
      />

      <div
        className={cn(
          "relative z-10",
          "flex items-center justify-center w-14 h-14 rounded-xl mb-5",
          "bg-gradient-to-br from-primary/10 to-accent/10",
          "text-primary group-hover:from-primary group-hover:to-accent",
          "group-hover:text-white",
          "transition-all duration-300",
          "shadow-lg shadow-primary/10 group-hover:shadow-primary/20"
        )}
      >
        <Icon className="w-7 h-7" />
      </div>

      <div className="relative z-10 flex-1">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <div className="relative z-10 mt-5 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <span className="text-sm font-semibold">Acessar</span>
        <svg
          className="w-4 h-4 ml-1.5 transform group-hover:translate-x-1.5 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </div>

      <div 
        className={cn(
          "absolute -bottom-4 -right-4 w-24 h-24 rounded-full",
          "bg-gradient-to-br from-primary/10 to-transparent",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500"
        )}
      />
    </motion.a>
  );
}

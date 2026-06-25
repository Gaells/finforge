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
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col p-6 rounded-2xl",
        "bg-card",
        "border-2 border-[hsl(var(--border)/0.6)]",
        "hover:border-primary/40 dark:hover:border-primary/50",
        "shadow-lg hover:shadow-2xl hover:shadow-primary/15",
        "transition-all duration-300 ease-out",
        "cursor-pointer overflow-hidden"
      )}
    >
      <div 
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100",
          "bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10",
          "transition-opacity duration-500"
        )}
      />
      
      <div 
        className={cn(
          "absolute -top-24 -right-24 w-48 h-48 rounded-full",
          "bg-gradient-to-br from-primary/30 to-accent/20",
          "opacity-0 group-hover:opacity-100",
          "blur-3xl transition-opacity duration-700"
        )}
      />

      <div 
        className={cn(
          "absolute -bottom-8 -left-8 w-32 h-32 rounded-full",
          "bg-gradient-to-tr from-primary/20 to-transparent",
          "opacity-0 group-hover:opacity-100",
          "blur-2xl transition-opacity duration-500"
        )}
      />

      <div className="relative z-10 flex items-center gap-4 mb-4">
        <motion.div
          className={cn(
            "flex items-center justify-center w-14 h-14 rounded-2xl",
            "bg-gradient-to-br from-primary/20 to-emerald-500/20",
            "border border-primary/20",
            "shadow-lg shadow-primary/20",
            "transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-primary/30",
            "group-hover:from-primary group-hover:to-emerald-500"
          )}
        >
          <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
        </div>
      </div>

      <div className="relative z-10 flex-1">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>

      <motion.div 
        className="relative z-10 mt-5 flex items-center gap-2 text-primary font-semibold"
        initial={{ opacity: 0, x: -10 }}
        whileHover={{ opacity: 1, x: 0 }}
      >
        <span className="text-sm">Acessar</span>
        <motion.svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          whileHover={{ x: 4 }}
          transition={{ duration: 0.2 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </motion.svg>
      </motion.div>

      <div 
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1",
          "bg-gradient-to-r from-primary via-emerald-500 to-accent",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-500"
        )}
      />
    </motion.a>
  );
}

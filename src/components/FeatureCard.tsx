"use client";

import { ReactNode } from "react";
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
  gradient = "primary",
  delay = 0,
}: FeatureCardProps) {
  const gradientClasses = {
    primary: "group-hover:gradient-primary",
    wealth: "group-hover:gradient-wealth",
    accent: "group-hover:from-accent group-hover:to-primary",
  };

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        "group relative flex flex-col p-6 rounded-xl",
        "bg-card border border-border/50",
        "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20",
        "transition-all duration-300 ease-out",
        "cursor-pointer overflow-hidden"
      )}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-5 gradient-primary transition-opacity duration-300" />

      {/* Icon container */}
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-lg mb-4",
          "bg-primary/10 text-primary",
          "group-hover:bg-primary group-hover:text-primary-foreground",
          "transition-all duration-300",
        )}
      >
        <Icon className="w-6 h-6" />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Arrow indicator */}
      <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-sm font-medium">Acessar</span>
        <svg
          className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </motion.a>
  );
}

"use client";

import { motion } from "framer-motion";
import { ForgeLogo } from "@/public/ForgeLogo";
import { FeatureCard } from "@/components/FeatureCard";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Calculator,
  Target,
  Percent,
  TrendingDown,
  Sparkles,
  Scale,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    title: "Juros Compostos",
    description:
      "Simule a evolução do seu patrimônio com aportes mensais e veja o poder dos juros sobre juros.",
    icon: TrendingUp,
    href: "/compound-interest",
    gradient: "wealth" as const,
  },
  {
    title: "Juros Simples",
    description:
      "Calcule juros simples para empréstimos, financiamentos ou rendimentos básicos.",
    icon: Calculator,
    href: "/simple-interest",
    gradient: "primary" as const,
  },
  {
    title: "Planejador FIRE",
    description:
      "Descubra quanto você precisa para alcançar a independência financeira e viver de renda.",
    icon: Target,
    href: "/fire-calculator",
    gradient: "wealth" as const,
  },
  {
    title: "Conversor de Taxas",
    description:
      "Converta taxas anuais para mensais e vice-versa. Compare rentabilidades reais.",
    icon: Percent,
    href: "/rate-converter",
    gradient: "accent" as const,
  },
  {
    title: "Ajuste de Inflação",
    description:
      "Calcule o poder de compra real do seu dinheiro ao longo do tempo com base no IPCA.",
    icon: TrendingDown,
    href: "/inflation-adjuster",
    gradient: "primary" as const,
  },
  {
    title: "Comparador de Investimentos",
    description:
      "Compare dois cenários de investimento lado a lado para tomar a melhor decisão financeira.",
    icon: Scale,
    href: "/investment-comparator",
    gradient: "accent" as const,
  },
];

const stats = [
  { value: "6", label: "Calculadoras" },
  { value: "∞", label: "Precisão Decimal" },
  { value: "100%", label: "Gratuito" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  },
};

const StatCounter = ({ value, label }: { value: string; label: string }) => (
  <motion.div 
    className="text-center"
    variants={itemVariants}
  >
    <motion.div 
      className="text-3xl md:text-4xl font-bold text-primary"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {value}
    </motion.div>
    <div className="text-sm md:text-base text-muted-foreground mt-1">
      {label}
    </div>
  </motion.div>
);

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px]" />

        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8 md:mb-12"
          >
            <ForgeLogo size="lg" />

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Precisão financeira</span>
              </div>
              <ThemeToggle />
            </div>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-3xl mb-10 md:mb-14"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 md:mb-6">
              Forje seu futuro{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                financeiro
              </span>
            </h1>

            <p className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl">
              Calculadoras de alta precisão para planejamento de independência
              financeira. Simule investimentos, calcule juros e descubra quando
              você pode se aposentar.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap items-center gap-6 md:gap-10"
            >
              {stats.map((stat) => (
                <StatCounter key={stat.label} value={stat.value} label={stat.label} />
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-semibold">
                Ferramentas Disponíveis
              </h2>
              <Button variant="ghost" size="sm" className="gap-2 hidden sm:flex">
                Ver todas
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={0.5 + index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[hsl(var(--border)/0.5)] py-6 md:py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <ForgeLogo size="sm" />
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              Desenvolvido com precisão para ajudá-lo a alcançar seus objetivos financeiros
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

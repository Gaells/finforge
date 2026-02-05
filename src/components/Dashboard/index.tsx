"use client";

import { motion } from "framer-motion";
import { ForgeLogo } from "@/public/ForgeLogo";
import { FeatureCard } from "@/components/FeatureCard";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  TrendingUp,
  Calculator,
  Target,
  Percent,
  TrendingDown,
  Sparkles,
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
];

export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-hero opacity-[0.02]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          {/* Logo & Nav */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-16"
          >
            <ForgeLogo size="lg" />

            <div className="flex items-center gap-4">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Ferramentas de precisão financeira
              </span>
              <ThemeToggle />
            </div>
          </motion.header>

          {/* Hero Content */}
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Forje seu futuro{" "}
              <span className="bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
                financeiro
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl"
            >
              Calculadoras de alta precisão para planejamento de independência
              financeira. Simule investimentos, calcule juros e descubra quando
              você pode se aposentar.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-8 mb-12"
            >
              {[
                { value: "5", label: "Calculadoras" },
                { value: "∞", label: "Precisão Decimal" },
                { value: "100%", label: "Gratuito" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-12 pb-24">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl font-semibold mb-8"
        >
          Ferramentas Disponíveis
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              {...feature}
              delay={0.5 + index * 0.1}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <ForgeLogo size="sm" />
            <p className="text-sm text-muted-foreground">
              Desenvolvido para prática de System Design e boas práticas
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

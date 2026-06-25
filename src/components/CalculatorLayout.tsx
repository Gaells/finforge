import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ForgeLogo } from "@/public/ForgeLogo";
import { ThemeToggle } from "@/components/theme-toggle";

interface CalculatorLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  icon: ReactNode;
}

export function CalculatorLayout({
  children,
  title,
  description,
  icon,
}: Readonly<CalculatorLayoutProps>) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => globalThis.history.back()}
                className="hover:bg-primary/10 active:scale-90 transition-transform h-10 w-10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="hidden sm:block">
                <ForgeLogo size="sm" />
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">{title}</h1>
              <p className="text-sm md:text-base text-muted-foreground hidden sm:block">
                {description}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground sm:hidden">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}

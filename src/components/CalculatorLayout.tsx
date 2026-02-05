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
      {/* Header */}
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => globalThis.history.back()}
                className="hover:bg-primary/10"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <ForgeLogo size="sm" />
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </motion.div>

        {/* Calculator Content */}
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

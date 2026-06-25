"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface StickyResultBarProps {
  label: string;
  value: string;
  secondaryLabel?: string;
  secondaryValue?: string;
  showBar: boolean;
  onClose?: () => void;
}

export function StickyResultBar({
  label,
  value,
  secondaryLabel,
  secondaryValue,
  showBar,
  onClose,
}: StickyResultBarProps) {
  return (
    <AnimatePresence>
      {showBar && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 md:hidden",
            "bg-background/95 backdrop-blur-lg border-t border-[hsl(var(--border)/0.5)]",
            "safe-area-inset-bottom"
          )}
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground truncate">{label}</p>
                <p className="text-lg font-bold text-primary truncate">{value}</p>
              </div>

              {secondaryLabel && secondaryValue && (
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-xs text-muted-foreground truncate">{secondaryLabel}</p>
                  <p className="text-sm font-semibold truncate">{secondaryValue}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                {onClose && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="h-8 w-8 shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MobileSlideUpPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function MobileSlideUpPanel({
  isOpen,
  onClose,
  title,
  children,
  className,
}: MobileSlideUpPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-background border-t border-[hsl(var(--border)/0.5)]",
              "max-h-[85vh] overflow-auto",
              "safe-area-inset-bottom",
              className
            )}
          >
            <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-[hsl(var(--border)/0.5)] px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold">{title}</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mr-2">
                <X className="h-4 h-4" />
              </Button>
            </div>
            <div className="p-4">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action && (
        <Button onClick={action.onClick} size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}

interface SuccessCheckmarkProps {
  show: boolean;
  message?: string;
}

export function SuccessCheckmark({ show, message }: SuccessCheckmarkProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="flex items-center gap-2 text-success"
        >
          <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {message && <span className="text-sm font-medium">{message}</span>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

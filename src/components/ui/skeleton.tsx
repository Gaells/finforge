import * as React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "text" | "circular" | "card";
}

function Skeleton({ className, variant = "default", ...props }: SkeletonProps) {
  const baseClass = "animate-pulse bg-muted rounded-md";
  
  const variantClasses = {
    default: "w-full h-4",
    text: "h-4 w-20",
    circular: "rounded-full",
    card: "w-full h-32",
  };

  return (
    <div
      className={cn(baseClass, variantClasses[variant], className)}
      {...props}
    />
  );
}

function SkeletonCard() {
  return (
    <div className="space-y-3 p-4 rounded-xl border border-border/50 bg-card">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="space-y-2 flex-1">
          <Skeleton variant="text" className="w-3/4" />
          <Skeleton variant="text" className="w-1/2" />
        </div>
      </div>
      <Skeleton variant="card" />
      <div className="flex gap-2">
        <Skeleton variant="text" className="flex-1" />
        <Skeleton variant="text" className="flex-1" />
      </div>
    </div>
  );
}

function SkeletonChart() {
  return (
    <div className="space-y-3 p-4 rounded-xl border border-border/50 bg-card">
      <div className="flex justify-between items-center">
        <Skeleton variant="text" className="w-32" />
        <div className="flex gap-2">
          <Skeleton variant="circular" className="w-6 h-6" />
          <Skeleton variant="circular" className="w-6 h-6" />
        </div>
      </div>
      <Skeleton variant="card" className="h-48" />
      <div className="flex justify-between">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-20" />
      </div>
    </div>
  );
}

function SkeletonInputField() {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <Skeleton variant="text" className="w-24" />
        <Skeleton variant="text" className="w-20" />
      </div>
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonChart, SkeletonInputField };

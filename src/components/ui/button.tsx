import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link"
      | "success";
    size?: "default" | "sm" | "lg" | "icon";
    isLoading?: boolean;
  }
>(({ className, variant = "default", size = "default", isLoading, children, disabled, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-zinc-950 dark:focus-visible:ring-primary/50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:shadow-primary/25":
            variant === "default",
          "bg-destructive text-white hover:bg-destructive/90 shadow-md hover:shadow-lg hover:shadow-destructive/25":
            variant === "destructive",
          "border-2 border-[hsl(var(--border))] bg-transparent hover:bg-[hsl(var(--muted))] hover:border-primary/40 active:scale-[0.98] dark:border-zinc-700 dark:hover:bg-zinc-800":
            variant === "outline",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:bg-secondary/70":
            variant === "secondary",
          "hover:bg-[hsl(var(--primary)/0.1)] hover:text-primary active:bg-[hsl(var(--primary)/0.15)]":
            variant === "ghost",
          "text-primary underline-offset-4 hover:underline":
            variant === "link",
          "bg-success text-success-foreground hover:bg-success/90 shadow-md hover:shadow-lg hover:shadow-success/25":
            variant === "success",
        },
        {
          "h-11 px-5 py-2.5 min-w-[44px]": size === "default",
          "h-9 rounded-lg px-3 min-w-[36px]": size === "sm",
          "h-12 rounded-xl px-8 min-w-[48px]": size === "lg",
          "h-10 w-10 min-w-[44px] rounded-xl": size === "icon",
        },
        "select-none",
        className,
      )}
      ref={ref}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
});
Button.displayName = "Button";

export { Button };

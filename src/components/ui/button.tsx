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
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] disabled:active:scale-100 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-300",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md":
            variant === "default",
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm":
            variant === "destructive",
          "border border-zinc-200 bg-white hover:bg-zinc-50 hover:border-zinc-300 active:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:hover:border-zinc-700":
            variant === "outline",
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 active:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80":
            variant === "secondary",
          "hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-200 dark:hover:bg-zinc-800 dark:hover:text-zinc-50":
            variant === "ghost",
          "text-primary underline-offset-4 hover:underline":
            variant === "link",
          "bg-success text-white hover:bg-success/90 shadow-sm":
            variant === "success",
        },
        {
          "h-11 px-5 py-2.5 min-w-[44px]": size === "default",
          "h-9 rounded-md px-3 min-w-[36px]": size === "sm",
          "h-12 rounded-lg px-8 min-w-[48px]": size === "lg",
          "h-10 w-10 min-w-[44px]": size === "icon",
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

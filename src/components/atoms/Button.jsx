import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "default", size = "default", children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black shadow-neon hover:shadow-neon-strong": 
            variant === "default",
          "bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-black shadow-gold hover:shadow-gold-strong": 
            variant === "accent",
          "bg-gradient-to-r from-surface to-secondary-500 hover:from-surface/90 hover:to-secondary-400 text-white border border-primary/30 hover:border-primary/50": 
            variant === "secondary",
          "bg-transparent hover:bg-primary/10 text-primary border border-primary/30 hover:border-primary/50": 
            variant === "outline",
          "bg-transparent hover:bg-red-500/10 text-red-400 hover:text-red-300": 
            variant === "ghost",
        },
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4 py-2": size === "default",
          "h-12 px-6 text-lg": size === "lg",
        },
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
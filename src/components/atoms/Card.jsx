import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-gradient-to-br from-surface to-secondary-500 border border-primary/20 p-6 shadow-lg backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;
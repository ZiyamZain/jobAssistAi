import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const MinimalInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-12 w-full border-b border-zinc-200 dark:border-zinc-800 bg-transparent py-2 text-lg transition-all placeholder:text-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));

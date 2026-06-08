import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-xl border border-[var(--border)] bg-surface-2/60 px-4 text-sm text-white placeholder:text-slate-500",
          "transition-colors duration-200 outline-none",
          "focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/30",
          "aria-[invalid=true]:border-red-500/60 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/20",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

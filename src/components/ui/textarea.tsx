import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 w-full resize-y rounded-xl border border-[var(--border)] bg-surface-2/60 px-4 py-3 text-sm text-white placeholder:text-slate-500",
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
Textarea.displayName = "Textarea";

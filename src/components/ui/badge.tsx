import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        brand:
          "border-brand-500/25 bg-brand-500/10 text-brand-200",
        positive:
          "border-positive-500/25 bg-positive-500/10 text-positive-400",
        neutral: "border-[var(--border-strong)] bg-white/5 text-slate-300",
      },
    },
    defaultVariants: { variant: "brand" },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

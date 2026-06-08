import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Bespoke button system. The `primary` variant carries the brand gradient and
 * ambient glow that defines Strada's premium feel; all variants share stable,
 * non-layout-shifting hover transitions (color/shadow only).
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 ease-[var(--ease-premium)] cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-brand-400 to-brand-600 text-white shadow-[0_10px_30px_-10px_var(--color-brand-600)] hover:from-brand-300 hover:to-brand-500 hover:shadow-[0_16px_40px_-12px_var(--color-brand-500)]",
        secondary:
          "glass-strong text-foreground hover:border-[var(--border-strong)] hover:bg-white/5",
        ghost: "text-slate-300 hover:bg-white/5 hover:text-white",
        outline:
          "border border-[var(--border-strong)] text-foreground hover:bg-white/5 hover:border-brand-500/50",
        link: "text-brand-300 underline-offset-4 hover:text-brand-200 hover:underline",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-[0.95rem]",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. an `<a>` / `<Link>`) via Slot. */
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };

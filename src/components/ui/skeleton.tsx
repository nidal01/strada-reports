import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Skeleton loading placeholder. Reserves layout space (zero CLS) while async
 * content resolves, using the design-system shimmer utility.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface-3/60 shimmer",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

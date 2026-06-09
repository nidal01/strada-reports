import Image from "next/image";
import { cn } from "@/lib/utils";
import logoSrc from "../../../public/brand/logo.png";

interface LogoProps {
  className?: string;
  /** Tailwind height utility for the lockup (width scales automatically). */
  heightClass?: string;
  /** Optional priority hint for above-the-fold usage (e.g. the navbar). */
  priority?: boolean;
}

/**
 * Official Strada brand lockup — the layered-disc mark + "Strada" wordmark +
 * the orange "reports" script. Served from the real transparent-PNG asset via
 * next/image (auto WebP/AVIF, fixed intrinsic ratio → zero layout shift).
 */
export function Logo({ className, heightClass = "h-8", priority = false }: LogoProps) {
  return (
    <Image
      src={logoSrc}
      alt="Strada Reports"
      priority={priority}
      sizes="200px"
      className={cn("w-auto", heightClass, className)}
    />
  );
}

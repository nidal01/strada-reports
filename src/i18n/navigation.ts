import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Always import `Link`, `redirect`,
 * `usePathname` and `useRouter` from here instead of `next/navigation` so that
 * the active locale and localised pathnames are preserved automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

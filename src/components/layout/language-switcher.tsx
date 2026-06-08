"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { useParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import type { SolutionSlug } from "@/features/solutions/data";
import type { NavPathname } from "@/lib/site";

/**
 * Compact TR/EN toggle. Preserves the current localised pathname when switching
 * locale (via next-intl navigation) and is wrapped in a transition so the UI
 * stays responsive during the route change.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale) return;
    startTransition(() => {
      if (pathname === "/solutions/[slug]" && typeof params.slug === "string") {
        router.replace(
          {
            pathname: "/solutions/[slug]",
            params: { slug: params.slug as SolutionSlug },
          },
          { locale: next },
        );
        return;
      }
      if (pathname === "/blog/[slug]") {
        router.replace("/blog", { locale: next });
        return;
      }
      router.replace(pathname as NavPathname, { locale: next });
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-[var(--border)] bg-white/5 p-0.5",
        isPending && "opacity-70",
        className,
      )}
      role="group"
      aria-label={t("switchLanguage")}
    >
      <Globe className="ml-1.5 size-3.5 text-slate-500" aria-hidden="true" />
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-current={loc === locale ? "true" : undefined}
          className={cn(
            "cursor-pointer rounded-full px-2.5 py-1 text-xs font-semibold uppercase transition-colors duration-200",
            loc === locale
              ? "bg-brand-500/20 text-brand-200"
              : "text-slate-400 hover:text-white",
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}

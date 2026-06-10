"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { primaryNav, siteConfig } from "@/lib/site";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

/**
 * Floating, glassmorphic navigation bar.
 * - Mounts with a slide-down entrance.
 * - Intensifies its glass/border treatment once the user scrolls past the hero
 *   fold (scroll-linked via Framer Motion, no re-render storms).
 * - Collapses into an animated full-screen sheet on mobile.
 */
export function Navbar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-[var(--z-nav)] flex justify-center px-4 pt-4"
    >
      <nav
        aria-label="Ana menü"
        className={cn(
          "flex w-full max-w-7xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-300 ease-[var(--ease-premium)] sm:px-5",
          scrolled
            ? "glass-strong shadow-[0_8px_40px_-12px_rgba(0,0,0,0.6)]"
            : "border border-transparent bg-transparent",
        )}
      >
        <Link href="/" className="rounded-lg" aria-label="Strada — ana sayfa">
          <Logo />
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.key}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200",
                    active ? "text-white" : "text-slate-400 hover:text-white",
                  )}
                >
                  {t(item.key)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <LanguageSwitcher />
          <Button asChild variant="ghost" size="sm">
            <a href={siteConfig.appUrl}>{t("login")}</a>
          </Button>
          <Button asChild size="sm">
            <Link href="/contact">{t("requestDemo")}</Link>
          </Button>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1.5 md:hidden">
          <Button asChild variant="ghost" size="sm" className="px-3">
            <a href={siteConfig.appUrl}>{t("login")}</a>
          </Button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? t("close") : t("menu")}
            className="flex size-10 cursor-pointer items-center justify-center rounded-lg text-slate-200 transition-colors hover:bg-white/5"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile sheet */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 top-0 z-[-1] md:hidden"
          >
            <div
              className="absolute inset-0 bg-base/80 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong absolute inset-x-4 top-24 rounded-2xl p-4"
            >
              <ul className="flex flex-col gap-1">
                {primaryNav.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block rounded-xl px-4 py-3 text-base font-medium text-slate-200 transition-colors hover:bg-white/5"
                    >
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-3 border-t border-[var(--border)] pt-4">
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <LanguageSwitcher className="self-start" />
                </div>
                <Button asChild className="w-full" onClick={() => setMobileOpen(false)}>
                  <Link href="/contact">{t("requestDemo")}</Link>
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}

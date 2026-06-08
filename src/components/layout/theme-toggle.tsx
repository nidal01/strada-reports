"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { applyTheme, resolveTheme, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

type ThemeLabels = {
  toggleTheme: string;
  themeLight: string;
  themeDark: string;
};

function ThemeToggleBase({
  className,
  labels,
}: {
  className?: string;
  labels: ThemeLabels;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = resolveTheme();
    setTheme(current);
    applyTheme(current);
    setMounted(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  const label = theme === "dark" ? labels.themeLight : labels.themeDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={labels.toggleTheme}
      title={label}
      className={cn(
        "inline-flex size-9 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] bg-white/5 text-slate-400 transition-colors duration-200 hover:bg-white/10 hover:text-[var(--foreground)]",
        className,
      )}
    >
      {mounted ? (
        theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />
      ) : (
        <Sun className="size-4 opacity-50" />
      )}
    </button>
  );
}

/** Navbar theme toggle (requires next-intl provider). */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("nav");
  return (
    <ThemeToggleBase
      className={className}
      labels={{
        toggleTheme: t("toggleTheme"),
        themeLight: t("themeLight"),
        themeDark: t("themeDark"),
      }}
    />
  );
}

/** Admin panel theme toggle (no i18n provider). */
export function ThemeToggleStandalone({ className }: { className?: string }) {
  return (
    <ThemeToggleBase
      className={className}
      labels={{
        toggleTheme: "Tema değiştir",
        themeLight: "Açık temaya geç",
        themeDark: "Koyu temaya geç",
      }}
    />
  );
}

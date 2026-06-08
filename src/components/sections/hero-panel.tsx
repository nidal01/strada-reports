"use client";

import { motion } from "framer-motion";
import { TrendingUp, Wallet, PiggyBank, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Bespoke, hand-built "Finansal Durum" dashboard mockup used as the hero
 * product preview. Built with DOM + SVG (not a screenshot) so it stays crisp,
 * causes zero layout shift, and can animate its bars/metrics on entry.
 */
export function HeroPanel() {
  const t = useTranslations("hero");

  const metrics = [
    { icon: Wallet, label: t("metricRevenue"), value: "₺8.1M", delta: "+12.4%", tone: "brand" as const },
    { icon: PiggyBank, label: t("metricCollections"), value: "₺6.9M", delta: "+8.1%", tone: "positive" as const },
    { icon: TrendingUp, label: t("metricProfit"), value: "₺1.08M", delta: "+5.2%", tone: "positive" as const },
  ];

  // Stacked-bar data approximating "müşteri bazlı satış" (relative widths %)
  const bars = [
    { label: "İnebolu Yapı", value: 100 },
    { label: "Dörtyol Ltd.", value: 88 },
    { label: "Boyran Beton", value: 42 },
    { label: "Belen İnşaat", value: 26 },
    { label: "İskenderun", value: 14 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      style={{ perspective: 1200 }}
      className="glass-strong gradient-border relative w-full overflow-hidden rounded-2xl p-4 shadow-[0_40px_120px_-30px_rgba(2,6,23,0.9)] sm:p-5"
    >
      {/* window chrome */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-red-400/70" />
          <span className="size-2.5 rounded-full bg-amber-400/70" />
          <span className="size-2.5 rounded-full bg-positive-400/70" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-positive-500/25 bg-positive-500/10 px-2.5 py-0.5 text-[0.65rem] font-medium text-positive-400">
          <span className="size-1.5 animate-pulse rounded-full bg-positive-400" />
          {t("liveTag")}
        </span>
      </div>

      <div className="mb-1 text-sm font-semibold text-white">{t("panelTitle")}</div>
      <div className="mb-5 text-xs text-slate-400">{t("panelSubtitle")}</div>

      {/* metric cards */}
      <div className="grid grid-cols-3 gap-2.5">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-xl border border-[var(--border)] bg-surface-2/60 p-3"
          >
            <m.icon
              className={
                m.tone === "positive"
                  ? "size-4 text-positive-400"
                  : "size-4 text-brand-300"
              }
            />
            <div className="mt-2 text-[0.7rem] leading-tight text-slate-500">{m.label}</div>
            <div className="mt-0.5 text-base font-semibold tracking-tight text-white">
              {m.value}
            </div>
            <div className="mt-1 inline-flex items-center gap-0.5 text-[0.65rem] font-medium text-positive-400">
              <ArrowUpRight className="size-3" />
              {m.delta}
            </div>
          </motion.div>
        ))}
      </div>

      {/* bar chart */}
      <div className="mt-4 rounded-xl border border-[var(--border)] bg-surface-2/40 p-4">
        <div className="mb-3 text-[0.7rem] font-medium text-slate-400">
          Müşteri Bazlı Satış · ₺8.057.669
        </div>
        <div className="flex flex-col gap-2.5">
          {bars.map((b, i) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="w-20 shrink-0 truncate text-[0.65rem] text-slate-500">
                {b.label}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${b.value}%` }}
                  transition={{ delay: 0.7 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-sky-accent"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* floating accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-brand-500/20 blur-3xl"
      />
    </motion.div>
  );
}

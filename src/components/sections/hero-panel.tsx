"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroPanel() {
  const t = useTranslations("hero");

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      style={{ perspective: 1200 }}
      className="glass-strong gradient-border relative w-full overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgba(2,6,23,0.9)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-surface-2/60 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-slate-400/40" />
          <span className="size-2.5 rounded-full bg-slate-400/40" />
          <span className="size-2.5 rounded-full bg-slate-400/40" />
        </div>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium text-slate-500">
          <RefreshCw className="size-3" />
          {t("syncTag")}
        </span>
      </div>
      <Image
        src="/product/finansal-durum.png"
        alt={t("panelTitle")}
        width={2272}
        height={4310}
        sizes="(max-width: 1024px) 100vw, 560px"
        className="w-full max-h-[28rem] object-cover object-top sm:max-h-[32rem]"
        priority
      />
    </motion.div>
  );
}

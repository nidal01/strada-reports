"use client";

import { useTranslations } from "next-intl";

/**
 * Official DIA "Mavi Çözüm Ortağı" badge — distinct from the ERP integration
 * logo strip. Asset: public/brand/dia-cozum-ortagi.png
 */
export function DiaPartnerBadge({ className }: { className?: string }) {
  const t = useTranslations("hero");

  return (
    <div className={className}>
      <span className="text-xs font-medium text-slate-500">{t("partnerLabel")}</span>
      <div className="mt-3">
        {/* eslint-disable-next-line @next/next/no-img-element -- partner badge has fixed aspect; avoid CLS with h-* w-auto */}
        <img
          src="/brand/dia-cozum-ortagi.png"
          alt={t("partnerLabel")}
          className="h-12 w-auto sm:h-14"
        />
      </div>
    </div>
  );
}

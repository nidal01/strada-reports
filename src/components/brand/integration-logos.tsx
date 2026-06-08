"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Integration logo lockup shown in the hero in place of the old "DIA ERP ile
 * tam entegre" badge. Renders the ERP brand marks Strada connects to (DIA,
 * LOGO) as a muted, grayscale strip that colourises on hover.
 *
 * Official assets live in `public/brand/`. Marks render in full brand colour
 * (a blue app-icon + a red wordmark don't survive a grayscale treatment); a
 * subtle opacity lift on hover keeps the strip quiet but alive. If a file is
 * missing the mark falls back to a typographic wordmark, so the layout never
 * breaks.
 */
const INTEGRATIONS: ReadonlyArray<{ key: string; name: string; src: string; height: string }> = [
  { key: "dia", name: "DIA", src: "/brand/dia.svg", height: "h-24" },
  { key: "logo", name: "LOGO", src: "/brand/logo-yazilim.svg", height: "h-12" },
];

function LogoMark({ name, src, height }: { name: string; src: string; height: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-sm font-bold tracking-tight text-slate-400">
        {name}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- logos vary in aspect ratio; <img h-* w-auto> avoids fixed dimensions and CLS
    <img
      src={src}
      alt={`${name} entegrasyonu`}
      onError={() => setFailed(true)}
      className={`${height} w-auto opacity-80 transition duration-300 ease-[var(--ease-premium)] hover:opacity-100`}
    />
  );
}

export function IntegrationLogos({ className }: { className?: string }) {
  const t = useTranslations("hero");

  return (
    <div className={className}>
      <span className="text-xs font-medium text-slate-500">
        {t("integrationsLabel")}
      </span>
      <div className="mt-3 flex items-center gap-8">
        {INTEGRATIONS.map((item) => (
          <LogoMark key={item.key} name={item.name} src={item.src} height={item.height} />
        ))}
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { SolutionsGrid } from "@/features/solutions/solutions-grid";
import { PageFaq } from "@/features/seo/faq-section";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.solutions" });
  return { title: t("title"), description: t("description") };
}

const SECTION_KEYS = ["integrations", "sync", "reporting", "erp"] as const;

/** Real Strada screenshots illustrating each solution pillar. */
const SECTION_MEDIA: Record<
  (typeof SECTION_KEYS)[number],
  { src: string; w: number; h: number }
> = {
  integrations: { src: "/product/finansal-durum.png", w: 1400, h: 910 },
  sync: { src: "/product/musteri-dagilimi.png", w: 1400, h: 749 },
  reporting: { src: "/product/stok-satislari.png", w: 1400, h: 1665 },
  erp: { src: "/product/cariler.png", w: 1400, h: 980 },
};

/**
 * Solutions — alternating deep-dive sections for integrations, automated
 * synchronization, financial reporting and ERP connectivity.
 */
export default async function SolutionsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "solutionsPage" });

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <SolutionsGrid />

      <div className="py-12 sm:py-16">
        <Container className="flex flex-col gap-20 sm:gap-28">
          {SECTION_KEYS.map((key, i) => {
            const points = t.raw(`sections.${key}.points`) as readonly string[];
            const reversed = i % 2 === 1;
            return (
              <article
                key={key}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                {/* Copy */}
                <Reveal className={cn(reversed && "lg:order-2")}>
                  <span className="text-sm font-semibold text-brand-300">
                    {t(`sections.${key}.tag`)}
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {t(`sections.${key}.title`)}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-400">
                    {t(`sections.${key}.description`)}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-slate-300">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-positive-500/15 text-positive-400">
                          <Check className="size-3.5" />
                        </span>
                        <span className="text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* Visual — real product screenshot */}
                <Reveal
                  delay={0.1}
                  className={cn(
                    "glass-strong gradient-border relative overflow-hidden rounded-2xl shadow-[0_30px_90px_-30px_rgba(2,6,23,0.9)]",
                    reversed && "lg:order-1",
                  )}
                >
                  <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-surface-2/60 px-4 py-2.5">
                    <span className="size-2.5 rounded-full bg-slate-400/40" />
                    <span className="size-2.5 rounded-full bg-slate-400/40" />
                    <span className="size-2.5 rounded-full bg-slate-400/40" />
                  </div>
                  <Image
                    src={SECTION_MEDIA[key].src}
                    alt={`${t(`sections.${key}.title`)} — Strada Reports`}
                    width={SECTION_MEDIA[key].w}
                    height={SECTION_MEDIA[key].h}
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="w-full"
                  />
                </Reveal>
              </article>
            );
          })}
        </Container>
      </div>

      <PageFaq page="solutions" />
      <CtaBanner />
    </>
  );
}

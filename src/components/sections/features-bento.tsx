import { RefreshCw, BarChart3, Plug, Smartphone, Sparkles, ArrowRight, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { Logo } from "@/components/brand/logo";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FeatureKey = "sync" | "reports" | "erp" | "mobile" | "security";

const ICONS: Record<FeatureKey, LucideIcon> = {
  sync: RefreshCw,
  reports: BarChart3,
  erp: Plug,
  mobile: Smartphone,
  security: Sparkles,
};

/** Bento layout: each entry maps to a grid span on large screens. */
const LAYOUT: ReadonlyArray<{ key: FeatureKey; span: string; feature: boolean }> = [
  { key: "sync", span: "lg:col-span-2", feature: true },
  { key: "reports", span: "lg:col-span-1", feature: false },
  { key: "erp", span: "lg:col-span-1", feature: false },
  { key: "mobile", span: "lg:col-span-1", feature: false },
  { key: "security", span: "lg:col-span-1", feature: false },
];

/**
 * Bento-grid feature showcase. Cards carry a B2B-corporate materiality — a
 * subtle top-edge highlight, a tinted diffusion shadow and a refined icon
 * well — so the grid reads with depth rather than flat panels. The lead "sync"
 * card spans two columns and shows the real ERP→Strada integration flow with
 * official brand marks.
 */
export function FeaturesBento() {
  const t = useTranslations("features");

  return (
    <section className="relative py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <Reveal
          as="div"
          variants={staggerContainer(0.08, 0.1)}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {LAYOUT.map(({ key, span, feature }) => {
            const Icon = ICONS[key];
            return (
              <Reveal
                key={key}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-b from-surface/70 to-surface/30 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05),0_24px_48px_-34px_rgba(2,6,23,0.8)] transition-[border-color,box-shadow] duration-300 hover:border-brand-500/40 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.07),0_30px_64px_-30px_rgba(37,99,235,0.32)] sm:p-7",
                  span,
                )}
              >
                {/* hover glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-brand-600/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-600/15"
                />

                <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-b from-brand-500/20 to-brand-500/5 text-brand-300 ring-1 ring-inset ring-white/10">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                  {t(`items.${key}.description`)}
                </p>

                {/* lead card: real integration flow */}
                {feature ? <IntegrationFlow /> : null}
              </Reveal>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * Lead-card integration diagram: the source ERP systems (DIA, LOGO) flowing
 * through an animated data bus into the Strada hub. Logos sit on white chips so
 * each brand mark stays crisp in both light and dark themes.
 */
function IntegrationFlow() {
  return (
    <div className="mt-6 rounded-xl border border-[var(--border)] bg-surface-2/40 p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <p className="mb-4 text-[0.7rem] font-medium text-slate-500">
        Gerçek zamanlı veri akışı
      </p>
      <div className="flex items-stretch gap-2 sm:gap-3 lg:gap-4">
        {/* source ERP systems */}
        <div className="flex flex-col justify-center gap-2.5">
          <LogoChip src="/brand/dia.svg" alt="DIA ERP" imgClass="h-6" />
          <LogoChip src="/brand/logo-yazilim.svg" alt="LOGO Yazılım" imgClass="h-4" />
        </div>

        {/* animated data bus */}
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <div className="relative h-px flex-1 overflow-hidden bg-[var(--border)]">
            <span className="absolute inset-y-0 left-0 w-1/2 animate-[marquee_2.4s_linear_infinite] bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
          </div>
          <ArrowRight className="size-4 shrink-0 text-brand-400" />
        </div>

        {/* Strada hub */}
        <div className="flex shrink-0 items-center rounded-xl border border-brand-500/40 bg-white px-3 shadow-[0_0_0_4px_rgba(59,130,246,0.08)] lg:px-5">
          <Logo heightClass="h-5 lg:h-7" />
        </div>
      </div>
    </div>
  );
}

/** White brand chip that keeps a coloured ERP logo crisp in any theme. */
function LogoChip({ src, alt, imgClass }: { src: string; alt: string; imgClass: string }) {
  return (
    <div className="flex h-11 w-20 items-center justify-center rounded-lg border border-black/5 bg-white px-3 shadow-sm lg:w-28">
      {/* eslint-disable-next-line @next/next/no-img-element -- small static brand mark; <img> keeps the source aspect ratio without fixed dimensions */}
      <img src={src} alt={alt} className={`${imgClass} w-auto`} />
    </div>
  );
}

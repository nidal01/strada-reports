import { RefreshCw, BarChart3, Plug, Smartphone, ShieldCheck, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

type FeatureKey = "sync" | "reports" | "erp" | "mobile" | "security";

const ICONS: Record<FeatureKey, LucideIcon> = {
  sync: RefreshCw,
  reports: BarChart3,
  erp: Plug,
  mobile: Smartphone,
  security: ShieldCheck,
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
 * Bento-grid feature showcase. Cards share a glassmorphic surface with a
 * gradient border on hover; the lead "sync" card spans two columns and carries
 * an illustrative data-flow visual.
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
                  "group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-surface/50 p-6 transition-colors duration-300 hover:border-brand-500/30 sm:p-7",
                  span,
                  feature && "lg:row-span-1",
                )}
              >
                {/* hover glow */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-brand-600/0 blur-3xl transition-colors duration-500 group-hover:bg-brand-600/15"
                />

                <div className="flex size-11 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-300">
                  <Icon className="size-5" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {t(`items.${key}.title`)}
                </h3>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-400">
                  {t(`items.${key}.description`)}
                </p>

                {/* lead card data-flow visual */}
                {feature ? <SyncVisual /> : null}
              </Reveal>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}

/** Decorative "ERP → Strada" data-flow strip for the lead bento card. */
function SyncVisual() {
  return (
    <div className="mt-6 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-surface-2/50 p-4">
      <span className="rounded-lg border border-[var(--border)] bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
        DIA ERP
      </span>
      <div className="relative h-px flex-1 overflow-hidden bg-[var(--border)]">
        <span className="absolute inset-y-0 left-0 w-1/3 animate-[marquee_2.4s_linear_infinite] bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
      </div>
      <span className="rounded-lg border border-brand-500/30 bg-brand-500/10 px-3 py-1.5 text-xs font-medium text-brand-200">
        Strada
      </span>
    </div>
  );
}

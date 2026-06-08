import {
  LineChart,
  TrendingUp,
  TrendingDown,
  HandCoins,
  Users,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer } from "@/lib/motion";

const ICONS: readonly LucideIcon[] = [
  LineChart,
  TrendingUp,
  TrendingDown,
  HandCoins,
  Users,
  ShoppingCart,
];

/**
 * Report-module grid mirroring Strada's real "Finansal Raporlar" menu
 * (Kâr/Zarar, Gelir, Gider, Tahsilat, Cari, Satış). Each tile is a uniform
 * card with an accent icon and short description.
 */
export function Modules() {
  const t = useTranslations("modules");
  const items = t.raw("items") as ReadonlyArray<{ name: string; desc: string }>;

  return (
    <section className="relative py-24 sm:py-32">
      {/* subtle dotted backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-40 mask-radial-faded" />
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <Reveal
          as="div"
          variants={staggerContainer(0.06, 0.1)}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? LineChart;
            return (
              <Reveal
                key={item.name}
                className="group flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-surface/40 p-5 transition-colors duration-300 hover:border-brand-500/30 hover:bg-surface/70"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-sky-accent/10 text-brand-300 transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}

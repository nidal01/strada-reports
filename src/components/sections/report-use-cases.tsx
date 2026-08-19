"use client";

import Image from "next/image";
import { ArrowRight, BarChart3, Package, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useDemoRequest } from "@/features/demo/demo-request-context";

const ICONS = [Wallet, BarChart3, Package] as const;

/**
 * Scenario-based outcomes with real report screenshots mapped to management use cases.
 */
export function ReportUseCases() {
  const t = useTranslations("useCases");
  const { open } = useDemoRequest();
  const items = t.raw("items") as ReadonlyArray<{
    title: string;
    outcome: string;
    image: string;
    imageAlt: string;
    tags: readonly string[];
  }>;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <Reveal variants={staggerContainer()} className="mt-14 grid gap-6 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? Wallet;
            return (
              <Reveal
                key={item.title}
                variants={fadeUp}
                className="surface-clear group flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] transition-colors hover:border-brand-500/35"
              >
                <div className="relative aspect-[16/10] overflow-hidden border-b border-[var(--border)] bg-white">
                  <Image
                    src={item.image}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 400px"
                    className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400">
                    <Icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-300">{item.outcome}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {item.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-400"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </Reveal>

        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={open}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full border border-brand-500/30",
              "bg-brand-500/10 px-6 py-3 text-sm font-semibold text-brand-300",
              "transition-colors duration-200 hover:border-brand-400/50 hover:bg-brand-500/15 hover:text-brand-200",
            )}
          >
            {t("cta")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </Container>
    </section>
  );
}

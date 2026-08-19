"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, fadeUp, scaleIn } from "@/lib/motion";
import { PRODUCT_SCREENSHOTS, type ProductScreenshot } from "@/features/product/screenshots";
import { cn } from "@/lib/utils";

interface GallerySlot {
  id: string;
  cellClass: string;
  variant: "hero" | "default";
}

const SLOTS: GallerySlot[] = [
  { id: "gelir-gider-trendi", cellClass: "sm:col-span-2 lg:col-span-7 lg:row-span-2", variant: "hero" },
  { id: "pexels-multi-monitor", cellClass: "lg:col-span-5", variant: "default" },
  { id: "kar-zarar-raporu", cellClass: "lg:col-span-5", variant: "default" },
  { id: "pexels-dashboard-overview", cellClass: "lg:col-span-4", variant: "default" },
  { id: "pexels-financial-graphs", cellClass: "lg:col-span-4", variant: "default" },
  { id: "pexels-analyst-charts", cellClass: "lg:col-span-4", variant: "default" },
];

const screenshotMap = new Map(PRODUCT_SCREENSHOTS.map((s) => [s.id, s]));

export function MediaGallery() {
  const t = useTranslations("media");
  const st = useTranslations("showcase.items");

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <Reveal
          variants={staggerContainer(0.1, 0.15)}
          className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:grid-rows-[280px_280px_220px] lg:gap-4"
        >
          {SLOTS.map((slot) => {
            const item = screenshotMap.get(slot.id);
            if (!item) return null;
            return (
              <Reveal
                key={slot.id}
                variants={slot.variant === "hero" ? scaleIn : fadeUp}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-surface/40 transition-colors hover:border-brand-500/30",
                  slot.cellClass,
                )}
              >
                <GalleryCard item={item} label={st(`${item.i18nKey}.alt`)} />
              </Reveal>
            );
          })}
        </Reveal>

        <Reveal className="mt-10 text-center">
          <Link
            href="/media"
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium text-brand-300",
              "transition-colors hover:text-brand-200",
            )}
          >
            {t("viewAll")}
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

function GalleryCard({ item, label }: { item: ProductScreenshot; label: string }) {
  return (
    <>
      <Image
        src={item.src}
        alt={label}
        width={item.w}
        height={item.h}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className={cn(
          "h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]",
          item.previewPosition,
        )}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="text-sm font-medium text-white">{label}</span>
      </div>
    </>
  );
}

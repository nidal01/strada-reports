"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { scaleIn } from "@/lib/motion";
import { cn } from "@/lib/utils";

type ShowcaseImage = {
  src: string;
  alt: string;
  w: number;
  h: number;
  cap: string;
  /** Tailwind object-position for cropped preview (lightbox always shows full). */
  previewPosition?: string;
};

const AUTOPLAY_MS = 6000;

/**
 * Product showcase: framed hero report + a 2-up carousel of supporting
 * screenshots. Cards preview the top of each shot; click opens a scrollable
 * lightbox so the full live capture is visible without cropping.
 */
export function ProductShowcase() {
  const t = useTranslations("showcase");

  const supporting = useMemo<ShowcaseImage[]>(
    () => [
      {
        src: "/product/musteri-dagilimi.png",
        alt: t("alt.customers"),
        w: 2272,
        h: 5086,
        cap: t("cap.customers"),
        // Pie/donut is in the upper content band (below filters).
        previewPosition: "object-[center_18%]",
      },
      { src: "/product/stok-satislari.png", alt: t("alt.stock"), w: 2272, h: 1768, cap: t("cap.stock") },
      { src: "/product/satis-trendi.png", alt: t("alt.sales"), w: 2272, h: 3306, cap: t("cap.sales") },
      { src: "/product/cariler.png", alt: t("alt.ledger"), w: 2272, h: 3022, cap: t("cap.ledger") },
    ],
    [t],
  );

  const pairCount = Math.ceil(supporting.length / 2);
  const [[pairIndex, direction], setPair] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);
  const [lightbox, setLightbox] = useState<ShowcaseImage | null>(null);

  const paginate = useCallback(
    (dir: number) => {
      setPair(([prev]) => [(prev + dir + pairCount) % pairCount, dir]);
    },
    [pairCount],
  );

  const goTo = useCallback((next: number) => {
    setPair(([prev]) => [next, next > prev ? 1 : -1]);
  }, []);

  useEffect(() => {
    if (paused || lightbox) return;
    const id = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [pairIndex, paused, lightbox, paginate]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [lightbox]);

  const visiblePair = supporting.slice(pairIndex * 2, pairIndex * 2 + 2);

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-brand-700/10 blur-[130px]"
      />
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <Reveal variants={scaleIn} className="mt-16">
          <button
            type="button"
            onClick={() =>
              setLightbox({
                src: "/product/gelir-gider-trendi.png",
                alt: t("alt.main"),
                w: 2272,
                h: 3656,
                cap: t("cap.main"),
              })
            }
            className="group glass-strong gradient-border block w-full cursor-zoom-in overflow-hidden rounded-2xl text-left shadow-[0_40px_120px_-30px_rgba(2,6,23,0.9)]"
            aria-label={t("expand")}
          >
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-surface-2/60 px-4 py-3">
              <span className="size-3 rounded-full bg-slate-400/40" />
              <span className="size-3 rounded-full bg-slate-400/40" />
              <span className="size-3 rounded-full bg-slate-400/40" />
              <span className="ml-3 hidden rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400 sm:block">
                app.strada.tr / finansal-raporlar
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-xs text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
                <Expand className="size-3.5" />
                {t("expand")}
              </span>
            </div>
            <Image
              src="/product/gelir-gider-trendi.png"
              alt={t("alt.main")}
              width={2272}
              height={3656}
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="w-full max-h-[36rem] object-cover object-top"
              priority={false}
            />
          </button>
        </Reveal>

        {/* 2-up carousel */}
        <div
          className="relative mt-6"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          role="region"
          aria-roledescription="carousel"
          aria-label={t("carouselLabel")}
        >
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={pairIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction >= 0 ? 48 : -48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction >= 0 ? -48 : 48 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                {visiblePair.map((img) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setLightbox(img)}
                    className="group glass cursor-zoom-in overflow-hidden rounded-2xl border border-[var(--border)] text-left transition-colors hover:border-brand-500/40"
                    aria-label={`${t("expand")}: ${img.cap}`}
                  >
                    <figure>
                      <div className="relative">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          width={img.w}
                          height={img.h}
                          sizes="(max-width: 768px) 100vw, 600px"
                          className={cn(
                            "w-full max-h-[24rem] object-cover",
                            img.previewPosition ?? "object-top",
                          )}
                        />
                        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-base/70 px-2 py-1 text-[0.65rem] font-medium text-slate-200 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                          <Expand className="size-3" />
                          {t("expand")}
                        </span>
                      </div>
                      <figcaption className="border-t border-[var(--border)] px-5 py-3 text-sm text-slate-400">
                        {img.cap}
                      </figcaption>
                    </figure>
                  </button>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label={t("prev")}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] text-slate-300 transition-colors hover:border-brand-500/40 hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label={t("carouselLabel")}>
              {Array.from({ length: pairCount }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={i === pairIndex}
                  aria-label={`${i + 1}`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-300",
                    i === pairIndex ? "w-6 bg-brand-400" : "w-2 bg-slate-600 hover:bg-slate-400",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label={t("next")}
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] text-slate-300 transition-colors hover:border-brand-500/40 hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </Container>

      {/* Full-size lightbox — no crop */}
      <AnimatePresence>
        {lightbox ? (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[var(--z-toast)] flex items-center justify-center p-3 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={lightbox.cap}
          >
            <button
              type="button"
              aria-label={t("close")}
              className="absolute inset-0 bg-base/90 backdrop-blur-md"
              onClick={() => setLightbox(null)}
            />
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="glass-strong gradient-border relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl"
            >
              <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
                <p className="truncate text-sm font-medium text-slate-200">{lightbox.cap}</p>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  aria-label={t("close")}
                  className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] text-slate-300 transition-colors hover:border-brand-500/40 hover:text-white"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto bg-white">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  width={lightbox.w}
                  height={lightbox.h}
                  sizes="(max-width: 1152px) 100vw, 1152px"
                  className="h-auto w-full"
                  priority
                />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

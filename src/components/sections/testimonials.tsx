"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const AUTOPLAY_MS = 7000;

/**
 * Dynamic testimonial slider. Cross-fades between quotes with directional
 * motion, auto-advances on a timer (paused on hover/focus), and exposes
 * keyboard-accessible prev/next + dot controls.
 */
export function Testimonials() {
  const t = useTranslations("testimonials");
  const items = t.raw("items") as ReadonlyArray<Testimonial>;
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback(
    (dir: number) => {
      setState(([prev]) => [(prev + dir + items.length) % items.length, dir]);
    },
    [items.length],
  );

  const goTo = useCallback(
    (next: number) => setState(([prev]) => [next, next > prev ? 1 : -1]),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const id = setTimeout(() => paginate(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, paginate]);

  const active = items[index];
  if (!active) return null;

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <div
          className="relative mx-auto mt-14 max-w-3xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          role="group"
          aria-roledescription="carousel"
          aria-label={t("title")}
        >
          <div className="glass-strong gradient-border relative overflow-hidden rounded-3xl p-8 sm:p-12">
            <Quote className="size-10 text-brand-500/30" aria-hidden="true" />

            {/* fixed min-height reserves space → zero layout shift between slides */}
            <div className="relative mt-4 min-h-[12rem] sm:min-h-[10rem]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.blockquote
                  key={index}
                  custom={direction}
                  initial={{ opacity: 0, x: direction >= 0 ? 40 : -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction >= 0 ? -40 : 40 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <p className="text-lg font-medium leading-relaxed text-slate-200 sm:text-xl">
                    “{active.quote}”
                  </p>
                  <footer className="mt-6 flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-sm font-semibold text-white"
                    >
                      {active.author.charAt(0)}
                    </span>
                    <span>
                      <cite className="block not-italic font-semibold text-white">
                        {active.author}
                      </cite>
                      <span className="text-sm text-slate-400">
                        {active.role} · {active.company}
                      </span>
                    </span>
                  </footer>
                </motion.blockquote>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => paginate(-1)}
              aria-label="Önceki"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] text-slate-300 transition-colors hover:border-brand-500/40 hover:text-white"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="flex items-center gap-2" role="tablist" aria-label="Testimonial seç">
              {items.map((it, i) => (
                <button
                  key={it.author}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`${i + 1}. yorum`}
                  onClick={() => goTo(i)}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all duration-300",
                    i === index ? "w-6 bg-brand-400" : "w-2 bg-slate-600 hover:bg-slate-400",
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => paginate(1)}
              aria-label="Sonraki"
              className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-[var(--border)] text-slate-300 transition-colors hover:border-brand-500/40 hover:text-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}

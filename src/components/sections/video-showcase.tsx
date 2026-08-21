"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { PRODUCT_VIDEOS } from "@/features/product/videos";
import { cn } from "@/lib/utils";

/**
 * Alternating product-tour sections driven by the shared video registry.
 * Old homepage videos are intentionally excluded — only PRODUCT_VIDEOS appear here.
 */
export function VideoShowcase() {
  const t = useTranslations("videoShowcase");

  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          subtitle={t("subtitle")}
        />

        <div className="mt-16 flex flex-col gap-20 sm:gap-28">
          {PRODUCT_VIDEOS.map((section, i) => {
            const reversed = i % 2 === 1;
            return (
              <article
                key={section.id}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <Reveal className={cn(reversed && "lg:order-2")}>
                  <span className="text-sm font-semibold text-brand-300">
                    {t(`sections.${section.i18nKey}.tag`)}
                  </span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                    {t(`sections.${section.i18nKey}.title`)}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-slate-400">
                    {t(`sections.${section.i18nKey}.description`)}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3">
                    {(t.raw(`sections.${section.i18nKey}.points`) as string[]).map((point) => (
                      <li key={point} className="flex items-start gap-3 text-slate-300">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-positive-500/15 text-positive-400">
                          <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        <span className="text-sm leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </Reveal>

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
                  <SectionVideoPlayer
                    src={section.src}
                    title={t(`sections.${section.i18nKey}.title`)}
                  />
                </Reveal>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

function SectionVideoPlayer({ src, title }: { src: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  }

  return (
    <div className="group relative">
      <video
        ref={videoRef}
        src={src}
        controls={playing}
        preload="metadata"
        playsInline
        className="w-full"
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`${title} oynat`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 transition-colors hover:bg-black/30"
        >
          <div className="flex size-16 items-center justify-center rounded-full bg-brand-500/90 text-white shadow-lg shadow-brand-500/30 transition-transform duration-200 hover:scale-110">
            <Play className="size-7 ml-0.5" fill="currentColor" />
          </div>
          <span className="text-sm font-medium text-white drop-shadow-md">{title}</span>
        </button>
      )}
    </div>
  );
}

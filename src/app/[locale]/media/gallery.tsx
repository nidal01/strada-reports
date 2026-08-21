"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Play } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer, fadeUp } from "@/lib/motion";
import {
  PRODUCT_SCREENSHOTS,
  REPORT_CATEGORIES,
  type ReportCategory,
} from "@/features/product/screenshots";
import { PRODUCT_VIDEOS } from "@/features/product/videos";
import { cn } from "@/lib/utils";

type FilterKey = ReportCategory | "all" | "video";

const FILTER_KEYS: Record<FilterKey, string> = {
  all: "filterAll",
  finance: "filterFinance",
  sales: "filterSales",
  stock: "filterStock",
  ledger: "filterLedger",
  concept: "filterConcept",
  video: "filterVideo",
};

export function MediaPageGallery() {
  const t = useTranslations("media");
  const st = useTranslations("showcase.items");
  const [active, setActive] = useState<FilterKey>("all");

  const showVideos = active === "all" || active === "video";
  const showImages = active !== "video";

  const filteredImages = !showImages
    ? []
    : active === "all"
      ? PRODUCT_SCREENSHOTS
      : PRODUCT_SCREENSHOTS.filter((s) => s.category === active);

  const filters: FilterKey[] = ["all", ...REPORT_CATEGORIES, "video"];

  return (
    <section className="pb-24 sm:pb-32">
      <Container>
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filters.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200",
                active === cat
                  ? "bg-brand-500/20 text-brand-300 border border-brand-500/40"
                  : "text-slate-400 hover:text-white border border-transparent hover:border-[var(--border)]",
              )}
            >
              {t(FILTER_KEYS[cat])}
            </button>
          ))}
        </div>

        <Reveal
          key={active}
          variants={staggerContainer(0.06, 0.05)}
          className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3"
        >
          {/* Videos first */}
          {showVideos &&
            PRODUCT_VIDEOS.map((video) => (
              <Reveal
                key={video.id}
                variants={fadeUp}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--border)] bg-surface/40 transition-colors hover:border-brand-500/30"
              >
                <VideoCard
                  src={video.src}
                  title={t(`videos.${video.i18nKey}.title`)}
                  playLabel={t("playVideo")}
                />
              </Reveal>
            ))}

          {/* Images */}
          {filteredImages.map((item) => (
            <Reveal
              key={item.id}
              variants={fadeUp}
              className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl border border-[var(--border)] bg-surface/40 transition-colors hover:border-brand-500/30"
            >
              <Image
                src={item.src}
                alt={st(`${item.i18nKey}.alt`)}
                width={item.w}
                height={item.h}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className={cn(
                  "w-full transition-transform duration-500 group-hover:scale-[1.02]",
                  item.previewPosition,
                )}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div>
                  <span className="text-sm font-medium text-white">
                    {st(`${item.i18nKey}.alt`)}
                  </span>
                  <p className="mt-0.5 text-xs text-slate-300">
                    {st(`${item.i18nKey}.cap`)}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

function VideoCard({
  src,
  title,
  playLabel,
}: {
  src: string;
  title: string;
  playLabel: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function handlePlay() {
    if (videoRef.current) {
      setPlaying(true);
      videoRef.current.play();
    }
  }

  return (
    <div className="relative aspect-video">
      <video
        ref={videoRef}
        src={src}
        controls={playing}
        preload="metadata"
        playsInline
        className="h-full w-full object-cover"
        onEnded={() => setPlaying(false)}
      />
      {!playing && (
        <button
          type="button"
          onClick={handlePlay}
          aria-label={playLabel}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40 transition-colors hover:bg-black/30"
        >
          <div className="flex size-14 items-center justify-center rounded-full bg-brand-500/90 text-white shadow-lg shadow-brand-500/30 transition-transform duration-200 hover:scale-110">
            <Play className="size-6 ml-0.5" fill="currentColor" />
          </div>
          <span className="text-sm font-medium text-white drop-shadow-md">{title}</span>
        </button>
      )}
    </div>
  );
}

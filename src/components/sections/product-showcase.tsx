import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { scaleIn, staggerContainer } from "@/lib/motion";

/**
 * Real-product showcase. The primary "Gelir–Gider Trendi" report is framed in a
 * macOS-style browser chrome; two supporting reports (sales trend, account
 * ledger) flank it. All images are real Strada screenshots served via
 * next/image with explicit dimensions for zero CLS.
 */
export function ProductShowcase() {
  const t = useTranslations("showcase");

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[32rem] w-[64rem] -translate-x-1/2 rounded-full bg-brand-700/10 blur-[130px]"
      />
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        {/* Hero report in a browser frame */}
        <Reveal variants={scaleIn} className="mt-16">
          <figure className="glass-strong gradient-border overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgba(2,6,23,0.9)]">
            <div className="flex items-center gap-2 border-b border-[var(--border)] bg-surface-2/60 px-4 py-3">
              <span className="size-3 rounded-full bg-slate-400/40" />
              <span className="size-3 rounded-full bg-slate-400/40" />
              <span className="size-3 rounded-full bg-slate-400/40" />
              <span className="ml-3 hidden rounded-md bg-white/5 px-3 py-1 text-xs text-slate-400 sm:block">
                app.strada.tr / finansal-raporlar
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
          </figure>
        </Reveal>

        {/* Supporting reports */}
        <Reveal
          as="div"
          variants={staggerContainer(0.1, 0.1)}
          className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          {[
            { src: "/product/satis-trendi.png", alt: t("alt.sales"), w: 2272, h: 3306, cap: t("cap.sales") },
            { src: "/product/cariler.png", alt: t("alt.ledger"), w: 2272, h: 3022, cap: t("cap.ledger") },
          ].map((img) => (
            <Reveal
              key={img.src}
              variants={scaleIn}
              className="glass overflow-hidden rounded-2xl border border-[var(--border)]"
            >
              <figure>
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.w}
                  height={img.h}
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="w-full max-h-[24rem] object-cover object-top"
                />
                <figcaption className="border-t border-[var(--border)] px-5 py-3 text-sm text-slate-400">
                  {img.cap}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

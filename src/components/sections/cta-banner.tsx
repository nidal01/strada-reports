import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";
import { scaleIn } from "@/lib/motion";

/**
 * High-converting closing CTA. A single bold panel with the brand gradient
 * glow, primary + secondary actions, framed to be the last thing a visitor
 * sees before the footer.
 */
export function CtaBanner() {
  const t = useTranslations("ctaBanner");

  return (
    <section className="py-12 sm:py-20">
      <Container>
        <Reveal
          variants={scaleIn}
          className="glow-brand relative overflow-hidden rounded-3xl border border-brand-500/20 bg-gradient-to-b from-surface-2 to-base px-6 py-16 text-center sm:px-12 sm:py-20"
        >
          {/* radial highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_50%_100%_at_50%_0%,var(--color-brand-600)_0%,transparent_70%)] opacity-30"
          />

          <h2 className="relative mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            {t("title")}
          </h2>
          <p className="relative mx-auto mt-5 max-w-xl text-pretty text-lg text-slate-400">
            {t("subtitle")}
          </p>

          <div className="relative mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/contact">
                {t("primary")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">{t("secondary")}</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

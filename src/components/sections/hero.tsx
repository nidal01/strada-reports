"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { HeroPanel } from "@/components/sections/hero-panel";
import { IntegrationLogos } from "@/components/brand/integration-logos";
import { fadeUp, staggerContainer } from "@/lib/motion";

/**
 * Above-the-fold hero. Two-column on desktop: value proposition + CTAs on the
 * left, the live product mockup on the right. Ambient aurora + grid backdrop
 * establishes the premium dark-mode atmosphere.
 */
export function Hero() {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44 sm:pb-28">
      {/* ambient backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial-faded opacity-70" />
        <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-brand-700/20 blur-[120px] animate-[aurora_18s_ease_infinite]" />
        <div className="absolute right-[10%] top-[20%] h-72 w-72 rounded-full bg-sky-accent/10 blur-[100px]" />
      </div>

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
          {/* Copy column */}
          <motion.div
            variants={staggerContainer(0.1)}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start"
          >
            <motion.h1
              variants={fadeUp}
              className="text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t("titleLead")}{" "}
              <span className="text-gradient">{t("titleHighlight")}</span>{" "}
              {t("titleTail")}
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-400"
            >
              {t("subtitle")}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link href="/contact">
                  {t("ctaPrimary")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/solutions">{t("ctaSecondary")}</Link>
              </Button>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-6 text-sm text-slate-500">
              {t("trustNote")}
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="mt-8 w-full border-t border-[var(--border)] pt-6"
            >
              <IntegrationLogos />
            </motion.div>
          </motion.div>

          {/* Product preview column */}
          <div className="relative lg:pl-6">
            <HeroPanel />
          </div>
        </div>
      </Container>
    </section>
  );
}

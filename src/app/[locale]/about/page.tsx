import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Lock,
  KeyRound,
  ScrollText,
  FileSearch,
  DatabaseBackup,
  Boxes,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer } from "@/lib/motion";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.about" });
  return { title: t("title"), description: t("description") };
}

const SECURITY_ICONS: readonly LucideIcon[] = [
  Lock,
  KeyRound,
  ScrollText,
  FileSearch,
  DatabaseBackup,
  Boxes,
];

/** About & Trust — vision, values and the security/compliance grid. */
export default async function AboutPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "aboutPage" });

  const values = t.raw("values") as ReadonlyArray<{ title: string; desc: string }>;
  const securityItems = t.raw("security.items") as ReadonlyArray<{
    title: string;
    desc: string;
  }>;

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      {/* Vision + values */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {t("vision.title")}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-slate-400">
                {t("vision.body")}
              </p>
            </Reveal>

            <Reveal
              as="ul"
              variants={staggerContainer(0.1)}
              className="flex flex-col gap-4 lg:col-span-7"
            >
              {values.map((value) => (
                <Reveal
                  as="li"
                  key={value.title}
                  className="rounded-2xl border border-[var(--border)] bg-surface/40 p-6"
                >
                  <h3 className="text-lg font-semibold text-white">{value.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {value.desc}
                  </p>
                </Reveal>
              ))}
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Security & compliance */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow={t("security.eyebrow")}
            title={t("security.title")}
            subtitle={t("security.subtitle")}
          />

          <Reveal
            as="div"
            variants={staggerContainer(0.06, 0.1)}
            className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {securityItems.map((item, i) => {
              const Icon = SECURITY_ICONS[i] ?? Lock;
              return (
                <Reveal
                  key={item.title}
                  className="group rounded-2xl border border-[var(--border)] bg-surface/40 p-6 transition-colors duration-300 hover:border-brand-500/30"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-300">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="mt-5 font-semibold text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                    {item.desc}
                  </p>
                </Reveal>
              );
            })}
          </Reveal>
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";
import { Link, getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/motion/reveal";
import { siteConfig } from "@/lib/site";
import {
  getSolution,
  SOLUTION_SLUGS,
  type SolutionSlug,
} from "@/features/solutions/data";
import { SolutionJsonLd } from "@/features/solutions/json-ld";
import { RelatedSolutions } from "@/features/solutions/solutions-grid";

type Params = { params: Promise<{ locale: string; slug: string }> };

type SolutionContent = {
  meta: { title: string; description: string };
  title: string;
  tagline: string;
  overview: string;
  features: readonly string[];
  benefits: readonly string[];
  useCases: readonly string[];
};

export function generateStaticParams() {
  return SOLUTION_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};

  const t = await getTranslations({
    locale,
    namespace: `solutionContent.${slug}` as `solutionContent.${SolutionSlug}`,
  });
  const meta = t.raw("meta") as { title: string; description: string };

  const canonical = getPathname({
    locale: locale as Locale,
    href: { pathname: "/solutions/[slug]", params: { slug } },
  });

  const languages = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      `${siteConfig.url}${getPathname({
        locale: loc,
        href: { pathname: "/solutions/[slug]", params: { slug } },
      })}`,
    ]),
  );

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical, languages },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${siteConfig.url}${canonical}`,
      type: "website",
      images: [{ url: solution.image.src, alt: meta.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: [solution.image.src],
    },
  };
}

export default async function SolutionDetailPage({ params }: Params) {
  const { locale, slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  setRequestLocale(locale as Locale);

  const t = await getTranslations({
    locale,
    namespace: `solutionContent.${slug}` as `solutionContent.${SolutionSlug}`,
  });
  const tDetail = await getTranslations("solutionDetail");
  const tCat = await getTranslations("solutionDetail.categories");

  const content: SolutionContent = {
    meta: t.raw("meta") as SolutionContent["meta"],
    title: t("title"),
    tagline: t("tagline"),
    overview: t("overview"),
    features: t.raw("features") as readonly string[],
    benefits: t.raw("benefits") as readonly string[],
    useCases: t.raw("useCases") as readonly string[],
  };
  const Icon = solution.icon;
  const categoryLabel =
    solution.category === "tools" ? tCat("tools") : tCat("reports");

  const pageUrl = `${siteConfig.url}${getPathname({
    locale: locale as Locale,
    href: { pathname: "/solutions/[slug]", params: { slug } },
  })}`;

  return (
    <>
      <SolutionJsonLd
        slug={solution.slug}
        name={content.title}
        description={content.meta.description}
        url={pageUrl}
      />

      {/* Breadcrumb */}
      <Container className="pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                href="/solutions"
                className="transition-colors hover:text-brand-300"
              >
                {tDetail("breadcrumbSolutions")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-300" aria-current="page">
              {content.title}
            </li>
          </ol>
        </nav>
      </Container>

      <PageHero
        eyebrow={categoryLabel}
        title={content.title}
        subtitle={content.tagline}
      />

      {/* Overview + screenshot */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl border border-brand-500/20 bg-brand-500/10 text-brand-300">
                  <Icon className="size-6" />
                </div>
                <Badge variant="brand">{categoryLabel}</Badge>
              </div>
              <p className="mt-6 text-lg leading-relaxed text-slate-300">
                {content.overview}
              </p>
              <ul className="mt-8 flex flex-col gap-3">
                {content.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-slate-300">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-positive-500/15 text-positive-400">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="glass-strong gradient-border relative overflow-hidden rounded-2xl shadow-[0_30px_90px_-30px_rgba(2,6,23,0.9)]">
                <div className="flex items-center gap-1.5 border-b border-[var(--border)] bg-surface-2/60 px-4 py-2.5">
                  <span className="size-2.5 rounded-full bg-slate-400/40" />
                  <span className="size-2.5 rounded-full bg-slate-400/40" />
                  <span className="size-2.5 rounded-full bg-slate-400/40" />
                </div>
                <Image
                  src={solution.image.src}
                  alt={`${content.title} — Strada`}
                  width={solution.image.w}
                  height={solution.image.h}
                  sizes="(max-width: 1024px) 100vw, 560px"
                  className="w-full"
                  priority
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--border)] bg-surface/20 py-16 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {tDetail("featuresTitle")}
            </h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.features.map((feature, i) => (
              <Reveal key={feature} delay={i * 0.05}>
                <li className="flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-surface/40 p-5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-sm font-semibold text-brand-300">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-relaxed text-slate-300">{feature}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Use cases */}
      <section className="py-16 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {tDetail("useCasesTitle")}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {content.useCases.map((useCase) => (
              <Reveal
                key={useCase}
                className="rounded-2xl border border-[var(--border)] bg-surface/40 p-6"
              >
                <p className="text-sm leading-relaxed text-slate-300">{useCase}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <RelatedSolutions slugs={solution.related} />
      <CtaBanner />
    </>
  );
}

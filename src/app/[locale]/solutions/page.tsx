import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { SolutionsGrid } from "@/features/solutions/solutions-grid";
import { SolutionsPillars } from "@/features/solutions/solutions-pillars";
import { PageFaq } from "@/features/seo/faq-section";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.solutions" });
  return { title: t("title"), description: t("description") };
}

/**
 * Solutions — grid of modules plus deep-dive pillars for integrations,
 * visibility, financial reporting and ERP connectivity.
 */
export default async function SolutionsPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "solutionsPage" });

  return (
    <>
      <PageHero
        eyebrow={t("hero.eyebrow")}
        title={t("hero.title")}
        subtitle={t("hero.subtitle")}
      />

      <SolutionsGrid />
      <SolutionsPillars />

      <PageFaq page="solutions" />
      <CtaBanner />
    </>
  );
}

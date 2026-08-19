import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBanner } from "@/components/sections/cta-banner";
import { MediaPageGallery } from "./gallery";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.media" });
  return { title: t("title"), description: t("description") };
}

export default async function MediaPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "media" });

  return (
    <>
      <PageHero
        eyebrow={t("eyebrow")}
        title={t("pageTitle")}
        subtitle={t("pageSubtitle")}
      />
      <MediaPageGallery />
      <CtaBanner />
    </>
  );
}

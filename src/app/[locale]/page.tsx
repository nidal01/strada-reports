import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { PageFaq } from "@/features/seo/faq-section";
import { JsonLdScript, softwareApplicationSchema } from "@/features/seo/json-ld";
import { FeaturesBento } from "@/components/sections/features-bento";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { ReportUseCases } from "@/components/sections/report-use-cases";
import { Modules } from "@/components/sections/modules";
import { MediaGallery } from "@/components/sections/media-gallery";
import { VideoShowcase } from "@/components/sections/video-showcase";
import { CtaBanner } from "@/components/sections/cta-banner";
import { SolutionsGrid } from "@/features/solutions/solutions-grid";
import { SolutionsPillars } from "@/features/solutions/solutions-pillars";


/**
 * Home — the Enterprise Gateway landing page.
 * Section order: Hero → Solutions → Pillars → Showcase → Use Cases → Features → Modules → Media → FAQ → CTA.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "metadata.home" });

  return (
    <>
      <JsonLdScript
        data={softwareApplicationSchema({
          name: "Strada Reports",
          description: t("description"),
          locale,
        })}
      />
      <Hero />
      <SolutionsGrid />
      <SolutionsPillars />
      <ProductShowcase />
      <ReportUseCases />
      <FeaturesBento />
      <Modules />
      <VideoShowcase />
      <MediaGallery />
      <PageFaq page="home" />
      <CtaBanner />
    </>
  );
}

import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { PageFaq } from "@/features/seo/faq-section";
import { JsonLdScript, softwareApplicationSchema } from "@/features/seo/json-ld";
import { FeaturesBento } from "@/components/sections/features-bento";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Modules } from "@/components/sections/modules";
import { Testimonials } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { CtaBanner } from "@/components/sections/cta-banner";
import { SolutionsGrid } from "@/features/solutions/solutions-grid";
import { SolutionsPillars } from "@/features/solutions/solutions-pillars";

/** Blog önizlemesi Supabase'den canlı çekilsin (SSG önbelleğine takılmasın). */
export const dynamic = "force-dynamic";

/**
 * Home — the Enterprise Gateway landing page.
 * Section order follows the recommended conversion flow:
 * Hero → Solutions → Pillars → Bento Features → Report Modules → Testimonials → CTA.
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
      <FeaturesBento />
      <ProductShowcase />
      <Modules />
      <BlogPreview locale={locale} />
      <Testimonials />
      <PageFaq page="home" />
      <CtaBanner />
    </>
  );
}

import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { SocialProof } from "@/components/sections/social-proof";
import { FeaturesBento } from "@/components/sections/features-bento";
import { ProductShowcase } from "@/components/sections/product-showcase";
import { Modules } from "@/components/sections/modules";
import { Testimonials } from "@/components/sections/testimonials";
import { BlogPreview } from "@/components/sections/blog-preview";
import { CtaBanner } from "@/components/sections/cta-banner";

/**
 * Home — the Enterprise Gateway landing page.
 * Section order follows the recommended conversion flow:
 * Hero → Social Proof → Bento Features → Report Modules → Testimonials → CTA.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <SocialProof />
      <FeaturesBento />
      <ProductShowcase />
      <Modules />
      <BlogPreview locale={locale} />
      <Testimonials />
      <CtaBanner />
    </>
  );
}

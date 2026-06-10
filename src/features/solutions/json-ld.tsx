import { siteConfig } from "@/lib/site";
import type { SolutionSlug } from "./data";

interface SolutionJsonLdProps {
  slug: SolutionSlug;
  name: string;
  description: string;
  url: string;
}

/** SoftwareApplication JSON-LD for solution detail pages (SEO). */
export function SolutionJsonLd({ slug, name, description, url }: SolutionJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    provider: { "@id": `${siteConfig.url}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
      description: "Demo talep edin",
    },
    identifier: slug,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

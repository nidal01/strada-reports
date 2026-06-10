import { siteConfig } from "@/lib/site";

export interface FaqItem {
  question: string;
  answer: string;
}

interface JsonLdScriptProps {
  data: Record<string, unknown> | ReadonlyArray<Record<string, unknown>>;
}

/** Renders a JSON-LD script tag for structured data. */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Organization + LocalBusiness schema for GEO and brand identity. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    legalName: "Strada Bilişim",
    url: siteConfig.url,
    logo: `${siteConfig.url}/favicon.png`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description:
      "Strada Reports — kurumsal finansal raporlama ve DIA ERP entegrasyon platformu.",
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Gayrettepe Mh. Barbaros Bulvarı No:161 D:9",
      addressLocality: "Beşiktaş",
      addressRegion: "İstanbul",
      postalCode: "34349",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 41.0782,
      longitude: 29.0064,
    },
    areaServed: {
      "@type": "Country",
      name: "Türkiye",
    },
    sameAs: [
      siteConfig.social.linkedin,
      siteConfig.social.instagram,
      siteConfig.social.x,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      contactType: "sales",
      availableLanguage: ["Turkish", "English"],
      areaServed: "TR",
    },
  };
}

/** WebSite schema with publisher reference. */
export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.productName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

/** SoftwareApplication schema for the product landing page. */
export function softwareApplicationSchema({
  name,
  description,
  locale,
}: {
  name: string;
  description: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: siteConfig.url,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    provider: { "@id": `${siteConfig.url}/#organization` },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "TRY",
      description: locale === "tr" ? "Ücretsiz demo" : "Free demo",
    },
    featureList: [
      "DIA ERP integration",
      "Financial reporting",
      "Profit & loss analysis",
      "AI data assistant",
      "Mobile reporting",
    ],
  };
}

/** FAQPage schema for AEO — answer engines and rich results. */
export function faqPageSchema(items: readonly FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** BreadcrumbList schema for navigation context. */
export function breadcrumbSchema(
  items: ReadonlyArray<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** ContactPage schema for demo / contact page. */
export function contactPageSchema(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Strada Reports Demo",
    url,
    mainEntity: { "@id": `${siteConfig.url}/#organization` },
  };
}

/** Blog listing schema with BlogPosting entries. */
export function blogListingSchema({
  name,
  description,
  url,
  locale,
  posts,
}: {
  name: string;
  description: string;
  url: string;
  locale: string;
  posts: ReadonlyArray<{
    title: string;
    excerpt: string;
    url: string;
    datePublished: string;
    author: string;
    image?: string | null;
  }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name,
    description,
    url,
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    publisher: { "@id": `${siteConfig.url}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: post.url,
      datePublished: post.datePublished,
      author: { "@type": "Person", name: post.author },
      image: post.image
        ? post.image.startsWith("http")
          ? post.image
          : `${siteConfig.url}${post.image}`
        : undefined,
    })),
  };
}

/** Article schema for blog posts. */
export function articleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author,
  locale,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  locale: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: image ? (image.startsWith("http") ? image : `${siteConfig.url}${image}`) : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    inLanguage: locale === "tr" ? "tr-TR" : "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

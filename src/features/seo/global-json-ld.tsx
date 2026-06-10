import {
  JsonLdScript,
  organizationSchema,
  websiteSchema,
} from "@/features/seo/json-ld";

interface GlobalJsonLdProps {
  locale: string;
}

/** Site-wide Organization + WebSite structured data (GEO + SEO). */
export function GlobalJsonLd({ locale }: GlobalJsonLdProps) {
  return (
    <JsonLdScript
      data={[
        organizationSchema(),
        websiteSchema(locale),
      ]}
    />
  );
}

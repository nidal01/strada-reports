import { getTranslations } from "next-intl/server";
import { FaqSection } from "@/components/sections/faq";
import { JsonLdScript, faqPageSchema, type FaqItem } from "@/features/seo/json-ld";

type FaqPageKey = "home" | "solutions" | "about" | "contact";

interface PageFaqProps {
  page: FaqPageKey;
}

/** Localised FAQ section with FAQPage JSON-LD for AEO. */
export async function PageFaq({ page }: PageFaqProps) {
  const t = await getTranslations({ namespace: `faq.${page}` });
  const items = t.raw("items") as readonly FaqItem[];

  return (
    <>
      <JsonLdScript data={faqPageSchema(items)} />
      <FaqSection
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        items={items}
      />
    </>
  );
}

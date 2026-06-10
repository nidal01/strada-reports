import { getTranslations } from "next-intl/server";
import type { SolutionSlug } from "@/features/solutions/data";
import { FaqSection } from "@/components/sections/faq";
import { JsonLdScript, faqPageSchema, type FaqItem } from "@/features/seo/json-ld";

interface SolutionFaqProps {
  slug: SolutionSlug;
}

type SolutionFaqContent = {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: readonly FaqItem[];
};

/** Module-specific FAQ with FAQPage JSON-LD on solution detail pages. */
export async function SolutionFaq({ slug }: SolutionFaqProps) {
  const t = await getTranslations({ namespace: `solutionFaq.${slug}` });
  const faq = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    subtitle: t("subtitle"),
    items: t.raw("items") as readonly FaqItem[],
  } satisfies SolutionFaqContent;

  return (
    <>
      <JsonLdScript data={faqPageSchema(faq.items)} />
      <FaqSection
        eyebrow={faq.eyebrow}
        title={faq.title}
        subtitle={faq.subtitle}
        items={faq.items}
        className="border-t border-[var(--border)]"
      />
    </>
  );
}

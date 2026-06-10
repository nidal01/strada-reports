import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/features/seo/json-ld";

interface FaqSectionProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  items: readonly FaqItem[];
  className?: string;
}

/**
 * FAQ section — semantic Q&A for AEO. Uses native <details> so answers are
 * visible to crawlers without JavaScript. No scroll-reveal wrapper — avoids
 * opacity:0 stuck state that made text invisible.
 */
export function FaqSection({
  eyebrow,
  title,
  subtitle,
  items,
  className,
}: FaqSectionProps) {
  return (
    <section
      className={cn("faq-section py-16 sm:py-24", className)}
      aria-labelledby="faq-heading"
    >
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <div className="faq-list mx-auto mt-12 max-w-3xl">
          {items.map((item, index) => (
            <details key={item.question} className="faq-item group">
              <summary
                className="faq-question"
                id={index === 0 ? "faq-heading" : undefined}
              >
                <span>{item.question}</span>
                <span className="faq-icon" aria-hidden="true">+</span>
              </summary>
              <div className="faq-answer">
                <p>{item.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}

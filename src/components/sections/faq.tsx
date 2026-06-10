import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
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
 * visible to crawlers without JavaScript.
 */
export function FaqSection({
  eyebrow,
  title,
  subtitle,
  items,
  className,
}: FaqSectionProps) {
  return (
    <section className={cn("py-16 sm:py-24", className)} aria-labelledby="faq-heading">
      <Container>
        <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} />

        <Reveal className="mx-auto mt-12 max-w-3xl">
          <div className="divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)]">
            {items.map((item, index) => (
              <details key={item.question} className="group">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-medium text-[var(--foreground)] transition-colors hover:text-brand-400 [&::-webkit-details-marker]:hidden"
                  id={index === 0 ? "faq-heading" : undefined}
                >
                  <span className="text-base sm:text-lg">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-[var(--muted)] sm:text-base">
                  <p>{item.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

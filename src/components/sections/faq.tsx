import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer } from "@/lib/motion";
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

        <Reveal
          as="div"
          variants={staggerContainer(0.05, 0.12)}
          className="mx-auto mt-12 max-w-3xl divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-surface/30"
        >
          {items.map((item, index) => (
            <Reveal key={item.question}>
              <details className="group">
                <summary
                  className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-medium text-white transition-colors hover:text-brand-200 [&::-webkit-details-marker]:hidden"
                  id={index === 0 ? "faq-heading" : undefined}
                >
                  <span className="text-base sm:text-lg">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-slate-400 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-6 pb-5 text-sm leading-relaxed text-slate-400 sm:text-base">
                  <p>{item.answer}</p>
                </div>
              </details>
            </Reveal>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}

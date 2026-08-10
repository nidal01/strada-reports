import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

/**
 * Enterprise social proof: a four-up animated stats band.
 */
export function SocialProof() {
  const t = useTranslations("socialProof");
  const stats = t.raw("stats") as ReadonlyArray<{ value: string; label: string }>;

  return (
    <section className="border-y border-[var(--border)] bg-surface/40 py-16">
      <Container>
        <Reveal>
          <p className="text-center text-sm font-medium text-slate-500">
            {t("title")}
          </p>
        </Reveal>

        <dl className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal as="div" key={s.label} delay={i * 0.08} className="text-center">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {s.value}
                </span>
                <span className="mt-1 block text-sm text-slate-500">{s.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}

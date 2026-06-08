import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/motion/reveal";

/** Customer names drawn from the real Strada reference dashboards. */
const CUSTOMERS = [
  "İnebolu Yapı İnşaat",
  "Dörtyol Limited",
  "Boyran Beton A.Ş.",
  "Belen İnşaat",
  "İskenderun Beton",
  "Antakya Beton",
  "Örtyol Limited",
] as const;

/**
 * Enterprise social proof: a four-up animated stats band over a continuous,
 * accessibility-friendly logo marquee (duplicated track, CSS-driven, paused for
 * reduced-motion users via the global media query).
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

        {/* Stats */}
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

        {/* Marquee */}
        <div
          className="relative mt-14 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
          }}
        >
          <div className="flex w-max animate-[marquee_38s_linear_infinite] gap-12">
            {[...CUSTOMERS, ...CUSTOMERS].map((name, i) => (
              <span
                key={`${name}-${i}`}
                aria-hidden={i >= CUSTOMERS.length}
                className="whitespace-nowrap text-base font-medium text-slate-600 transition-colors hover:text-slate-300"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

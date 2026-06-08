import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";

/**
 * Compact hero used at the top of inner pages (Solutions / About / Contact).
 * Shares the home hero's ambient backdrop language at a smaller scale.
 */
export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-12 sm:pt-44 sm:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid mask-radial-faded opacity-60" />
        <div className="absolute left-1/2 top-[-20%] h-96 w-[50rem] -translate-x-1/2 rounded-full bg-brand-700/20 blur-[110px]" />
      </div>
      <Container className="max-w-3xl text-center">
        <Reveal>
          <Badge variant="brand">{eyebrow}</Badge>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-slate-400">
            {subtitle}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

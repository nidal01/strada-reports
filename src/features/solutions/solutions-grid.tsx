import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer } from "@/lib/motion";
import { SOLUTIONS, type SolutionSlug } from "./data";

async function loadSolutionTitles() {
  return Promise.all(
    SOLUTIONS.map(async (solution) => {
      const tc = await getTranslations(`solutionContent.${solution.slug}`);
      return {
        slug: solution.slug,
        title: tc("title"),
        tagline: tc("tagline"),
      };
    }),
  );
}

/**
 * Grid of all Strada solutions with links to their SEO detail pages.
 */
export async function SolutionsGrid() {
  const t = await getTranslations("solutionDetail");
  const tCat = await getTranslations("solutionDetail.categories");
  const titles = await loadSolutionTitles();
  const titleMap = Object.fromEntries(titles.map((item) => [item.slug, item]));

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow={t("grid.eyebrow")}
          title={t("grid.title")}
          subtitle={t("grid.subtitle")}
        />

        <Reveal
          as="div"
          variants={staggerContainer(0.06, 0.08)}
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {SOLUTIONS.map((solution) => {
            const Icon = solution.icon;
            const content = titleMap[solution.slug]!;
            const categoryLabel =
              solution.category === "tools" ? tCat("tools") : tCat("reports");

            return (
              <Reveal key={solution.slug}>
                <Link
                  href={{
                    pathname: "/solutions/[slug]",
                    params: { slug: solution.slug },
                  }}
                  className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-surface/40 p-5 transition-colors duration-300 hover:border-brand-500/30 hover:bg-surface/70"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/15 to-sky-accent/10 text-brand-300 transition-transform duration-300 group-hover:scale-105">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border border-[var(--border)] bg-surface-2/60 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                      {categoryLabel}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold text-white group-hover:text-brand-200">
                    {content.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-400">
                    {content.tagline}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors duration-300 group-hover:text-brand-300">
                    {t("learnMore")}
                    <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </Reveal>
      </Container>
    </section>
  );
}

/** Compact related-solutions row for detail pages. */
export async function RelatedSolutions({ slugs }: { slugs: readonly SolutionSlug[] }) {
  const t = await getTranslations("solutionDetail");
  const titles = await Promise.all(
    slugs.map(async (slug) => {
      const tc = await getTranslations(`solutionContent.${slug}`);
      return { slug, title: tc("title"), tagline: tc("tagline") };
    }),
  );
  const titleMap = Object.fromEntries(titles.map((item) => [item.slug, item]));

  return (
    <section className="border-t border-[var(--border)] py-16 sm:py-20">
      <Container>
        <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {t("relatedTitle")}
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {slugs.map((slug) => {
            const solution = SOLUTIONS.find((s) => s.slug === slug)!;
            const Icon = solution.icon;
            const content = titleMap[slug]!;

            return (
              <Link
                key={slug}
                href={{ pathname: "/solutions/[slug]", params: { slug } }}
                className="group flex items-start gap-4 rounded-2xl border border-[var(--border)] bg-surface/40 p-5 transition-colors hover:border-brand-500/30"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-300">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-brand-200">
                    {content.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">{content.tagline}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

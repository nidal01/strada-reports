import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { Calendar, Sparkles } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/motion/reveal";
import { BlogMarkdown } from "@/features/blog/markdown";
import { getPublishedPostBySlug } from "@/features/blog/posts";
import { seedDemoPostsIfEmpty } from "@/features/blog/seed";
import { siteConfig } from "@/lib/site";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug, locale);
  if (!post) return {};

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;

  const canonical = getPathname({
    locale: locale as Locale,
    href: { pathname: "/blog/[slug]", params: { slug } },
  });

  const languages = Object.fromEntries(
    routing.locales.map((loc) => [
      loc,
      `${siteConfig.url}${getPathname({
        locale: loc,
        href: { pathname: "/blog/[slug]", params: { slug } },
      })}`,
    ]),
  );

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  await seedDemoPostsIfEmpty();
  const post = await getPublishedPostBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("blog");

  return (
    <>
      <Container className="pt-28 sm:pt-32">
        <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/blog" className="transition-colors hover:text-brand-300">
                {t("breadcrumb")}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-300" aria-current="page">
              {post.title}
            </li>
          </ol>
        </nav>
      </Container>

      <article className="pb-16 sm:pb-20">
        <Container className="max-w-3xl">
          <Reveal>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="size-4" />
                <time dateTime={post.publishedAt ?? post.createdAt}>
                  {(post.publishedAt ?? post.createdAt).slice(0, 10)}
                </time>
              </span>
              <span>{post.author}</span>
              {post.aiGenerated ? (
                <span className="inline-flex items-center gap-1 text-brand-300">
                  <Sparkles className="size-4" />
                  AI
                </span>
              ) : null}
            </div>

            <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-slate-400">{post.excerpt}</p>

            {post.tags.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[var(--border)] bg-surface/40 px-3 py-1 text-xs text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
          </Reveal>

          <Reveal delay={0.1} className="mt-12">
            <BlogMarkdown content={post.content} />
          </Reveal>
        </Container>
      </article>

      <CtaBanner />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import { Calendar, Eye, Sparkles } from "lucide-react";
import { routing, type Locale } from "@/i18n/routing";
import { Container } from "@/components/ui/container";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Reveal } from "@/components/motion/reveal";
import { BlogPostTracker } from "@/features/blog/blog-post-tracker";
import { BlogMarkdown } from "@/features/blog/markdown";
import { getPublishedPostBySlug } from "@/features/blog/posts";
import { seedDemoPostsIfEmpty } from "@/features/blog/seed";
import { BlogTableOfContents } from "@/features/blog/table-of-contents";
import { extractHeadings } from "@/features/blog/toc";
import { siteConfig } from "@/lib/site";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamic = "force-dynamic";

function parseRobots(value: string): Metadata["robots"] {
  const lower = value.toLowerCase();
  return {
    index: !lower.includes("noindex"),
    follow: !lower.includes("nofollow"),
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPublishedPostBySlug(slug, locale);
  if (!post) return {};

  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? post.excerpt;
  const ogImage = post.ogImage ?? post.coverImage ?? undefined;

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

  const keywords = post.focusKeyword
    ? [post.focusKeyword, ...post.tags]
    : post.tags.length > 0
      ? post.tags
      : undefined;

  return {
    title,
    description,
    keywords,
    robots: parseRobots(post.robots),
    alternates: {
      canonical: post.canonicalUrl ?? `${siteConfig.url}${canonical}`,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${siteConfig.url}${canonical}`,
      publishedTime: post.publishedAt ?? undefined,
      authors: [post.author],
      tags: post.tags,
      images: ogImage ? [{ url: ogImage, alt: title }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
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
  const headings = extractHeadings(post.content);

  return (
    <>
      <BlogPostTracker postId={post.id} />

      <article className="pb-16 sm:pb-20">
        <Container className="pt-28 sm:pt-32">
          <nav aria-label="Breadcrumb" className="mb-10 text-sm text-slate-500 sm:mb-14">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/blog" className="transition-colors hover:text-brand-300">
                  {t("breadcrumb")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="line-clamp-1 text-slate-300" aria-current="page">
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="mx-auto max-w-5xl lg:grid lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[240px_minmax(0,1fr)]">
            <BlogTableOfContents
              headings={headings}
              labels={{ title: t("toc"), toggle: t("tocToggle") }}
            />

            <div className="min-w-0 max-w-3xl lg:max-w-none">
              <Reveal>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="size-4" />
                    <time dateTime={post.publishedAt ?? post.createdAt}>
                      {(post.publishedAt ?? post.createdAt).slice(0, 10)}
                    </time>
                  </span>
                  <span>{post.author}</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="size-4" />
                    {t("views", { count: post.viewCount })}
                  </span>
                  {post.aiGenerated ? (
                    <span className="inline-flex items-center gap-1 text-brand-300">
                      <Sparkles className="size-4" />
                      AI
                    </span>
                  ) : null}
                </div>

                <h1 className="mt-6 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
                  {post.title}
                </h1>
                <p className="mt-5 text-lg leading-relaxed text-slate-400">{post.excerpt}</p>

                {post.coverImage ? (
                  <figure className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-surface/40">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      width={1200}
                      height={675}
                      className="aspect-[16/9] w-full object-cover"
                      sizes="(max-width: 1024px) 100vw, 768px"
                      priority
                    />
                  </figure>
                ) : null}

                {post.tags.length > 0 ? (
                  <div className="mt-8 flex flex-wrap gap-2">
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

              <div className="mt-10 border-t border-[var(--border)] pt-10 sm:mt-12 sm:pt-12">
                <BlogMarkdown content={post.content} headings={headings} />
              </div>
            </div>
          </div>
        </Container>
      </article>

      <CtaBanner />
    </>
  );
}

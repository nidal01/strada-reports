import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { JsonLdScript, blogListingSchema, breadcrumbSchema } from "@/features/seo/json-ld";
import { Calendar, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { listPosts } from "@/features/blog/posts";
import { seedDemoPostsIfEmpty } from "@/features/blog/seed";

type Params = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.blog" });
  return { title: t("title"), description: t("description") };
}

export default async function BlogPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const meta = await getTranslations({ locale, namespace: "metadata.blog" });

  await seedDemoPostsIfEmpty();
  const posts = await listPosts({ locale, status: "published", limit: 50 });

  const blogUrl = `${siteConfig.url}${getPathname({ locale: locale as Locale, href: "/blog" })}`;
  const homeUrl = `${siteConfig.url}${getPathname({ locale: locale as Locale, href: "/" })}`;

  const schemaPosts = posts.map((post) => ({
    title: post.title,
    excerpt: post.excerpt,
    url: `${siteConfig.url}${getPathname({
      locale: locale as Locale,
      href: { pathname: "/blog/[slug]", params: { slug: post.slug } },
    })}`,
    datePublished: post.publishedAt ?? post.createdAt,
    author: post.author,
    image: post.coverImage ?? post.ogImage,
  }));

  return (
    <>
      <JsonLdScript
        data={[
          blogListingSchema({
            name: t("pageTitle"),
            description: meta("description"),
            url: blogUrl,
            locale,
            posts: schemaPosts,
          }),
          breadcrumbSchema([
            { name: locale === "tr" ? "Ana Sayfa" : "Home", url: homeUrl },
            { name: t("breadcrumb"), url: blogUrl },
          ]),
        ]}
      />
      <PageHero eyebrow={t("eyebrow")} title={t("pageTitle")} subtitle={t("pageSubtitle")} />

      <section className="pb-20 sm:pb-28">
        <Container>
          {posts.length === 0 ? (
            <p className="text-center text-slate-400">{t("empty")}</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.05}>
                  <Link
                    href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-surface/40 transition-colors hover:border-brand-500/30"
                  >
                    {post.coverImage ? (
                      <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--border)]">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Calendar className="size-3.5" />
                      <time dateTime={post.publishedAt ?? post.createdAt}>
                        {(post.publishedAt ?? post.createdAt).slice(0, 10)}
                      </time>
                      {post.aiGenerated ? (
                        <span className="inline-flex items-center gap-1 text-brand-300">
                          <Sparkles className="size-3" />
                          AI
                        </span>
                      ) : null}
                      </div>
                      <h2 className="mt-4 text-xl font-semibold text-white group-hover:text-brand-200">
                        {post.title}
                      </h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                        {post.excerpt}
                      </p>
                      {post.tags.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[11px] font-medium text-slate-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}

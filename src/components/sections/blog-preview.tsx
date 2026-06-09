import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Calendar, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { staggerContainer } from "@/lib/motion";
import { listPosts } from "@/features/blog/posts";

/**
 * Homepage section — latest published blog posts for the active locale (live from Supabase).
 */
export async function BlogPreview({ locale }: { locale: string }) {
  const posts = await listPosts({ locale, status: "published", limit: 3 });
  const t = await getTranslations("blog");

  if (posts.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-dots opacity-30 mask-radial-faded"
      />
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

        <Reveal
          as="div"
          variants={staggerContainer(0.08, 0.1)}
          className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {posts.map((post) => (
            <Reveal key={post.id}>
              <Link
                href={{ pathname: "/blog/[slug]", params: { slug: post.slug } }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-surface/40 transition-colors hover:border-brand-500/30 hover:bg-surface/70"
              >
                {post.coverImage ? (
                  <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-[var(--border)]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 33vw"
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
                  <h3 className="mt-4 text-lg font-semibold text-white group-hover:text-brand-200">
                    {post.title}
                  </h3>
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
                  <span className="mt-4 text-sm font-medium text-brand-300">
                    {t("readMore")} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </Reveal>

        <Reveal className="mt-10 text-center">
          <Link
            href="/blog"
            className="text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
          >
            {t("viewAll")} →
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

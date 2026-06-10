import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { listPosts } from "@/features/blog/posts";
import { SOLUTION_SLUGS } from "@/features/solutions/data";
import { siteConfig } from "@/lib/site";

type StaticHref = "/" | "/solutions" | "/blog" | "/about" | "/contact";

const STATIC_ROUTES: readonly StaticHref[] = [
  "/",
  "/solutions",
  "/blog",
  "/about",
  "/contact",
] as const;

const STATIC_META: Record<
  StaticHref,
  { changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }
> = {
  "/": { changeFrequency: "weekly", priority: 1 },
  "/solutions": { changeFrequency: "monthly", priority: 0.9 },
  "/blog": { changeFrequency: "weekly", priority: 0.8 },
  "/about": { changeFrequency: "monthly", priority: 0.7 },
  "/contact": { changeFrequency: "monthly", priority: 0.8 },
};

/** Build absolute URL; homepage has no trailing slash. */
function absoluteUrl(locale: Locale, href: StaticHref | { pathname: "/solutions/[slug]"; params: { slug: string } } | { pathname: "/blog/[slug]"; params: { slug: string } }): string {
  const path = getPathname({ locale, href });
  if (path === "/") return siteConfig.url;
  return `${siteConfig.url}${path}`;
}

/** hreflang alternates for all locales + x-default (Turkish). */
function buildAlternates(
  resolve: (locale: Locale) => string,
): NonNullable<MetadataRoute.Sitemap[number]["alternates"]> {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, resolve(locale)]),
  ) as Record<string, string>;
  languages["x-default"] = resolve(routing.defaultLocale);
  return { languages };
}

function staticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.flatMap((href) => {
    const { changeFrequency, priority } = STATIC_META[href];
    return routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      changeFrequency,
      priority,
      alternates: buildAlternates((loc) => absoluteUrl(loc, href)),
    }));
  });
}

function solutionEntries(): MetadataRoute.Sitemap {
  return SOLUTION_SLUGS.flatMap((slug) => {
    const href = { pathname: "/solutions/[slug]" as const, params: { slug } };
    return routing.locales.map((locale) => ({
      url: absoluteUrl(locale, href),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: buildAlternates((loc) => absoluteUrl(loc, href)),
    }));
  });
}

function blogAlternates(
  slug: string,
  availableLocales: readonly Locale[],
): NonNullable<MetadataRoute.Sitemap[number]["alternates"]> {
  const href = { pathname: "/blog/[slug]" as const, params: { slug } };
  const languages = Object.fromEntries(
    availableLocales.map((locale) => [locale, absoluteUrl(locale, href)]),
  ) as Record<string, string>;
  const defaultLocale: Locale = availableLocales.includes(routing.defaultLocale)
    ? routing.defaultLocale
    : (availableLocales[0] ?? routing.defaultLocale);
  languages["x-default"] = absoluteUrl(defaultLocale, href);
  return { languages };
}

function blogEntries(
  posts: Awaited<ReturnType<typeof listPosts>>,
): MetadataRoute.Sitemap {
  const slugLocales = new Map<string, Locale[]>();
  for (const post of posts) {
    const locales = slugLocales.get(post.slug) ?? [];
    if (!locales.includes(post.locale)) locales.push(post.locale);
    slugLocales.set(post.slug, locales);
  }

  const seen = new Set<string>();

  return posts.flatMap((post) => {
    const key = `${post.locale}:${post.slug}`;
    if (seen.has(key)) return [];
    seen.add(key);

    const href = { pathname: "/blog/[slug]" as const, params: { slug: post.slug } };
    const availableLocales = slugLocales.get(post.slug) ?? [post.locale];

    return {
      url: absoluteUrl(post.locale, href),
      lastModified: new Date(post.updatedAt ?? post.publishedAt ?? post.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: blogAlternates(post.slug, availableLocales),
    };
  });
}

/** Multilingual sitemap — TR + EN entries with hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts({ status: "published", limit: 500 });

  return [...staticEntries(), ...solutionEntries(), ...blogEntries(posts)];
}

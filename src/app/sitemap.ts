import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { siteConfig } from "@/lib/site";
import { listPublishedSlugs } from "@/features/blog/posts";
import { seedDemoPostsIfEmpty } from "@/features/blog/seed";
import { SOLUTION_SLUGS } from "@/features/solutions/data";

const PATHS = ["", "/cozumler", "/blog", "/hakkimizda", "/iletisim"] as const;
const EN_PATHS: Record<string, string> = {
  "": "",
  "/cozumler": "/solutions",
  "/blog": "/blog",
  "/hakkimizda": "/about",
  "/iletisim": "/contact",
};

function solutionEntry(slug: string): MetadataRoute.Sitemap[number] {
  const base = siteConfig.url;
  const trPath = `/cozumler/${slug}`;
  const enPath = `/en/solutions/${slug}`;

  return {
    url: `${base}${trPath}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: {
      languages: {
        tr: `${base}${trPath}`,
        en: `${base}${enPath}`,
      },
    },
  };
}

function blogEntry(slug: string, locale: string): MetadataRoute.Sitemap[number] {
  const base = siteConfig.url;
  const prefix = locale === "tr" ? "" : "/en";
  const url = `${base}${prefix}/blog/${slug}`;

  return {
    url,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
    alternates: {
      languages: { [locale]: url },
    },
  };
}

/** Multilingual sitemap with hreflang alternates for every route. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticPages = PATHS.map((trPath) => {
    const enPath = `/en${EN_PATHS[trPath] ?? trPath}`;
    return {
      url: `${base}${trPath || "/"}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: trPath === "" ? 1 : 0.8,
      alternates: {
        languages: {
          tr: `${base}${trPath || "/"}`,
          en: `${base}${enPath}`,
        },
      },
    };
  });

  const solutionPages = SOLUTION_SLUGS.map(solutionEntry);

  await seedDemoPostsIfEmpty();
  const blogSlugs = await listPublishedSlugs();
  const blogPages = blogSlugs.map(({ slug, locale }) => blogEntry(slug, locale));

  return [...staticPages, ...solutionPages, ...blogPages];
}

void routing;

import type { MetadataRoute } from "next";
import { escapeXml } from "@/lib/utils";

const SITEMAP_NS = "http://www.sitemaps.org/schemas/sitemap/0.9";
const XHTML_NS = "http://www.w3.org/1999/xhtml";

function formatDate(date: Date | string | undefined): string | undefined {
  if (!date) return undefined;
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString();
}

/** Pretty-printed XML sitemap with optional XSL stylesheet for browsers. */
export function buildSitemapXml(
  entries: MetadataRoute.Sitemap,
  opts?: { stylesheet?: string },
): string {
  const lines: string[] = [
    '<?xml version="1.0" encoding="UTF-8"?>',
  ];

  if (opts?.stylesheet) {
    lines.push(`<?xml-stylesheet type="text/xsl" href="${escapeXml(opts.stylesheet)}"?>`);
  }

  lines.push(
    `<urlset xmlns="${SITEMAP_NS}" xmlns:xhtml="${XHTML_NS}">`,
  );

  for (const entry of entries) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(entry.url)}</loc>`);

    const lastmod = formatDate(entry.lastModified);
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);

    if (entry.changeFrequency) {
      lines.push(`    <changefreq>${entry.changeFrequency}</changefreq>`);
    }

    if (entry.priority !== undefined) {
      lines.push(`    <priority>${entry.priority.toFixed(1)}</priority>`);
    }

    const languages = entry.alternates?.languages;
    if (languages) {
      for (const [lang, href] of Object.entries(languages)) {
        if (!href) continue;
        lines.push(
          `    <xhtml:link rel="alternate" hreflang="${escapeXml(lang)}" href="${escapeXml(href)}" />`,
        );
      }
    }

    lines.push("  </url>");
  }

  lines.push("</urlset>");
  return `${lines.join("\n")}\n`;
}

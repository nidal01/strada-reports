import { getSitemapEntries } from "@/lib/sitemap-data";
import { buildSitemapXml } from "@/lib/sitemap-xml";

export const dynamic = "force-dynamic";

/** Formatted XML sitemap with browser-friendly XSL stylesheet. */
export async function GET() {
  const entries = await getSitemapEntries();
  const xml = buildSitemapXml(entries, { stylesheet: "/sitemap.xsl" });

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

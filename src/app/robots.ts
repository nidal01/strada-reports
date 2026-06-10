import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/admin/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "Google-Extended", "anthropic-ai", "ClaudeBot", "PerplexityBot"],
        allow: ["/", "/llms.txt"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

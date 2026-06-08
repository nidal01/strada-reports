import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Finansal Raporlama Platformu`,
    short_name: siteConfig.name,
    description:
      "ERP verinizi gerçek zamanlı finansal içgörüye dönüştüren kurumsal raporlama platformu.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      { src: "/favicon.png", sizes: "64x64", type: "image/png" },
      { src: "/favicon.png", sizes: "192x192", type: "image/png" },
    ],
  };
}

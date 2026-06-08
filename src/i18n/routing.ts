import { defineRouting } from "next-intl/routing";

/**
 * Centralised i18n routing config.
 * `tr` is the default locale (strada.tr is a Turkish-first product); `en` is
 * provided for international enterprise prospects. Localised pathnames keep the
 * URLs idiomatic in each language while sharing a single route tree.
 */
export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/solutions": {
      tr: "/cozumler",
      en: "/solutions",
    },
    "/solutions/[slug]": {
      tr: "/cozumler/[slug]",
      en: "/solutions/[slug]",
    },
    "/about": {
      tr: "/hakkimizda",
      en: "/about",
    },
    "/contact": {
      tr: "/iletisim",
      en: "/contact",
    },
    "/blog": {
      tr: "/blog",
      en: "/blog",
    },
    "/blog/[slug]": {
      tr: "/blog/[slug]",
      en: "/blog/[slug]",
    },
  },
});

export type Locale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;

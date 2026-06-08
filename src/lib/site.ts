/**
 * Global, locale-independent site configuration. Human-readable copy lives in
 * the `messages/*` bundles; this file only holds structural constants (URLs,
 * route keys, contact details, social handles).
 */
export const siteConfig = {
  name: "Strada",
  domain: "strada.tr",
  url: "https://strada.tr",
  /** Strada uygulama girişi (navbar "Giriş Yap"). */
  appUrl: "https://staging.strada.tr/",
  email: "info@strada.tr",
  phone: "+90 212 561 20 30",
  // og image lives in /public
  ogImage: "/og.png",
  favicon: "/favicon.png",
  social: {
    linkedin: "https://www.linkedin.com/company/strada",
    x: "https://x.com/strada",
    instagram: "https://www.instagram.com/strada",
  },
} as const;

/** Static routes used in the primary navigation (excludes dynamic segments). */
export type NavPathname = "/" | "/solutions" | "/blog" | "/about" | "/contact";

/** Primary navigation — labels resolve from the `nav` message namespace. */
export const primaryNav: ReadonlyArray<{
  key: "solutions" | "blog" | "about" | "contact";
  href: NavPathname;
}> = [
  { key: "solutions", href: "/solutions" },
  { key: "blog", href: "/blog" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
];

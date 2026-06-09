import { useTranslations } from "next-intl";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { Container } from "@/components/ui/container";
import { siteConfig } from "@/lib/site";
import { NewsletterForm } from "@/components/layout/newsletter-form";

/**
 * Structural corporate footer: brand + tagline, three link columns, a
 * newsletter capture, social links and a legal sub-bar. Server-rendered for SEO
 * (only the newsletter input is a client island).
 */
export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const columns = [
    {
      heading: t("product"),
      links: [
        { label: t("links.solutions"), href: "/solutions" as const },
        { label: t("links.modules"), href: "/solutions" as const },
        { label: t("links.integrations"), href: "/solutions" as const },
        { label: t("links.security"), href: "/about" as const },
      ],
    },
    {
      heading: t("company"),
      links: [
        { label: t("links.about"), href: "/about" as const },
        { label: t("links.contact"), href: "/contact" as const },
        { label: t("links.demo"), href: "/contact" as const },
        { label: t("links.careers"), href: "/about" as const },
      ],
    },
    {
      heading: t("legal"),
      links: [
        { label: t("links.privacy"), href: "/about" as const },
        { label: t("links.terms"), href: "/about" as const },
        { label: t("links.kvkk"), href: "/about" as const },
      ],
    },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-[var(--border)]">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-brand-600/10 blur-3xl"
      />
      <Container className="relative py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Link href="/" aria-label="Strada — ana sayfa">
              <Logo />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              {t("tagline")}
            </p>
            <div className="mt-4 flex max-w-sm flex-col gap-3 text-sm text-slate-500">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-300" aria-hidden="true" />
                <span>{siteConfig.address}</span>
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Mail className="size-4 shrink-0 text-brand-300" aria-hidden="true" />
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2.5 transition-colors hover:text-white"
              >
                <Phone className="size-4 shrink-0 text-brand-300" aria-hidden="true" />
                {siteConfig.phone}
              </a>
            </div>

            <div className="mt-8 max-w-sm">
              <h3 className="text-sm font-semibold text-white">{t("newsletterTitle")}</h3>
              <p className="mt-1 text-sm text-slate-500">{t("newsletterDesc")}</p>
              <NewsletterForm
                placeholder={t("newsletterPlaceholder")}
                cta={t("newsletterCta")}
              />
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {columns.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <h3 className="text-sm font-semibold text-white">{col.heading}</h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link, i) => (
                    <li key={`${col.heading}-${i}`}>
                      <Link
                        href={link.href}
                        className="text-sm text-slate-400 transition-colors duration-200 hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Legal sub-bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-500">
            © {year} {siteConfig.name}. {t("rights")} · {t("madeIn")}
          </p>
          <div className="flex items-center gap-3">
            <a
              href={siteConfig.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] text-slate-400 transition-colors duration-200 hover:border-brand-500/40 hover:text-white"
            >
              <Linkedin className="size-4" />
            </a>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex size-9 items-center justify-center rounded-lg border border-[var(--border)] text-slate-400 transition-colors duration-200 hover:border-brand-500/40 hover:text-white"
            >
              <Instagram className="size-4" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check, Mail, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/features/contact/contact-form";
import { siteConfig } from "@/lib/site";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.contact" });
  return { title: t("title"), description: t("description") };
}

/** Contact / Request Demo — value column + the interactive demo-request form. */
export default async function ContactPage({ params }: Params) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const highlights = t.raw("highlights") as readonly string[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} subtitle={t("subtitle")} />

      <section className="pb-12 sm:pb-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Value column */}
            <Reveal className="lg:col-span-5">
              <ul className="flex flex-col gap-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-positive-500/15 text-positive-400">
                      <Check className="size-3.5" />
                    </span>
                    <span className="text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3 border-t border-[var(--border)] pt-8">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                >
                  <Mail className="size-4 text-brand-300" />
                  {siteConfig.email}
                </a>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-3 text-slate-300 transition-colors hover:text-white"
                >
                  <Phone className="size-4 text-brand-300" />
                  {siteConfig.phone}
                </a>
              </div>
            </Reveal>

            {/* Form column */}
            <Reveal delay={0.1} className="lg:col-span-7">
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}

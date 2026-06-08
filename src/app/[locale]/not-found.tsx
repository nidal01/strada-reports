import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

/** Localised 404 within the active locale segment. */
export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <span className="text-gradient text-7xl font-semibold tracking-tight sm:text-8xl">
        404
      </span>
      <h1 className="mt-6 text-2xl font-semibold text-white">{t("title")}</h1>
      <p className="mt-3 max-w-md text-slate-400">{t("subtitle")}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t("cta")}</Link>
      </Button>
    </Container>
  );
}

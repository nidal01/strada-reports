import { getRequestConfig } from "next-intl/server";
import { routing, type Locale } from "./routing";

/**
 * Per-request i18n config consumed by the next-intl plugin. Falls back to the
 * default locale when the requested one is unsupported, then lazily loads the
 * matching message bundle.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

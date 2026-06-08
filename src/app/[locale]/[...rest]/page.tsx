import { notFound } from "next/navigation";

/**
 * Catch-all that triggers the localised `not-found` UI for any unmatched path
 * within a locale segment (the next-intl-recommended pattern when the app has
 * no root layout above `[locale]`).
 */
export default function CatchAllNotFound() {
  notFound();
}

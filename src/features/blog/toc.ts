import { slugify } from "./slug";
import type { TocHeading } from "./types";

/** Markdown içeriğinden h2/h3 başlıklarını çıkarır ve benzersiz anchor id'leri üretir. */
export function extractHeadings(content: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const usedIds = new Map<string, number>();

  for (const line of content.split("\n")) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    const text = (h2?.[1] ?? h3?.[1])?.trim();
    if (!text) continue;

    const base = slugify(text) || "section";
    const count = (usedIds.get(base) ?? 0) + 1;
    usedIds.set(base, count);
    const id = count > 1 ? `${base}-${count}` : base;

    headings.push({ level: h2 ? 2 : 3, text, id });
  }

  return headings;
}

/** Başlık metnine karşılık gelen anchor id'sini döner. */
export function headingIdForText(text: string, headings: TocHeading[]): string | undefined {
  const normalized = text.trim();
  return headings.find((h) => h.text === normalized)?.id;
}

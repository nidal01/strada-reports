import {
  Boxes,
  Replace,
  FileSpreadsheet,
  Receipt,
  Wallet,
  BarChart3,
  ClipboardList,
  Scale,
  type LucideIcon,
} from "lucide-react";

/**
 * Canonical registry of Strada solutions. Slugs are stable, shared across
 * locales (the brand domain is Turkish), and used for routing + SSG. All
 * human-readable copy lives in the `solutionContent.<slug>` message namespace;
 * this file only holds structural metadata (icon, illustrative screenshot,
 * category and related-solution graph).
 */
export type SolutionSlug =
  | "stok-yonetimi"
  | "stok-donusturucu"
  | "fatura-donusturucu"
  | "gider-raporu"
  | "gelir-raporu"
  | "satis-raporu"
  | "siparis-raporu"
  | "kar-zarar-raporu";

export type SolutionCategory = "tools" | "reports";

export interface SolutionMeta {
  slug: SolutionSlug;
  icon: LucideIcon;
  category: SolutionCategory;
  /** Illustrative screenshot from /public/product. */
  image: { src: string; w: number; h: number };
  /** Slugs of related solutions surfaced at the bottom of the detail page. */
  related: SolutionSlug[];
}

const IMG = {
  stok: { src: "/product/stok-satislari-v2.png", w: 2880, h: 1800 },
  stokTool: { src: "/product/stok-satislari-v2.png", w: 2880, h: 1800 },
  faturaTool: { src: "/product/fatura-donusturucu.png", w: 1024, h: 576 },
  gider: { src: "/product/gider-raporu.png", w: 2880, h: 3668 },
  gelir: { src: "/product/gelir-raporu.png", w: 2880, h: 5118 },
  satis: { src: "/product/satis-raporu.png", w: 2880, h: 3338 },
  siparis: { src: "/product/siparis-raporu.png", w: 2880, h: 1800 },
  karZarar: { src: "/product/kar-zarar-raporu.png", w: 2880, h: 3338 },
} as const;

export const SOLUTIONS: readonly SolutionMeta[] = [
  {
    slug: "stok-yonetimi",
    icon: Boxes,
    category: "tools",
    image: IMG.stok,
    related: ["stok-donusturucu", "siparis-raporu", "satis-raporu"],
  },
  {
    slug: "stok-donusturucu",
    icon: Replace,
    category: "tools",
    image: IMG.stokTool,
    related: ["stok-yonetimi", "fatura-donusturucu", "satis-raporu"],
  },
  {
    slug: "fatura-donusturucu",
    icon: FileSpreadsheet,
    category: "tools",
    image: IMG.faturaTool,
    related: ["gider-raporu", "stok-donusturucu", "gelir-raporu"],
  },
  {
    slug: "gider-raporu",
    icon: Receipt,
    category: "reports",
    image: IMG.gider,
    related: ["gelir-raporu", "kar-zarar-raporu", "fatura-donusturucu"],
  },
  {
    slug: "gelir-raporu",
    icon: Wallet,
    category: "reports",
    image: IMG.gelir,
    related: ["gider-raporu", "kar-zarar-raporu", "satis-raporu"],
  },
  {
    slug: "satis-raporu",
    icon: BarChart3,
    category: "reports",
    image: IMG.satis,
    related: ["siparis-raporu", "gelir-raporu", "stok-yonetimi"],
  },
  {
    slug: "siparis-raporu",
    icon: ClipboardList,
    category: "reports",
    image: IMG.siparis,
    related: ["satis-raporu", "stok-yonetimi", "kar-zarar-raporu"],
  },
  {
    slug: "kar-zarar-raporu",
    icon: Scale,
    category: "reports",
    image: IMG.karZarar,
    related: ["gelir-raporu", "gider-raporu", "satis-raporu"],
  },
] as const;

/** Fast lookup by slug. */
export const SOLUTION_MAP: Record<SolutionSlug, SolutionMeta> = Object.fromEntries(
  SOLUTIONS.map((s) => [s.slug, s]),
) as Record<SolutionSlug, SolutionMeta>;

export const SOLUTION_SLUGS: readonly SolutionSlug[] = SOLUTIONS.map((s) => s.slug);

export function getSolution(slug: string): SolutionMeta | undefined {
  return SOLUTION_MAP[slug as SolutionSlug];
}

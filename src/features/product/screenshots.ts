/**
 * Canonical product screenshot registry — single source for showcase,
 * solution pages, and use-case sections.
 */
export type ReportCategory = "finance" | "sales" | "stock" | "ledger" | "concept";

export interface ProductScreenshot {
  id: string;
  src: string;
  w: number;
  h: number;
  category: ReportCategory;
  /** i18n key suffix under showcase.items.<id> */
  i18nKey: string;
  previewPosition?: string;
}

export const REPORT_CATEGORIES: readonly ReportCategory[] = [
  "finance",
  "sales",
  "stock",
  "ledger",
  "concept",
] as const;

export const PRODUCT_SCREENSHOTS: readonly ProductScreenshot[] = [
  {
    id: "gelir-gider-trendi",
    src: "/product/gelir-gider-trendi.png",
    w: 2880,
    h: 2252,
    category: "finance",
    i18nKey: "incomeExpenseTrend",
  },
  {
    id: "kar-zarar-raporu",
    src: "/product/kar-zarar-raporu.png",
    w: 2880,
    h: 3338,
    category: "finance",
    i18nKey: "profitLoss",
  },
  {
    id: "gelir-raporu",
    src: "/product/gelir-raporu.png",
    w: 2880,
    h: 5118,
    category: "finance",
    i18nKey: "income",
  },
  {
    id: "gider-raporu",
    src: "/product/gider-raporu.png",
    w: 2880,
    h: 3668,
    category: "finance",
    i18nKey: "expense",
  },
  {
    id: "finansal-durum",
    src: "/product/finansal-durum.png",
    w: 2880,
    h: 4538,
    category: "finance",
    i18nKey: "financialStatus",
  },
  {
    id: "satis-trendi",
    src: "/product/satis-trendi.png",
    w: 2880,
    h: 3338,
    category: "sales",
    i18nKey: "salesTrend",
  },
  {
    id: "satis-raporu",
    src: "/product/satis-raporu-v2.png",
    w: 1024,
    h: 576,
    category: "sales",
    i18nKey: "salesReport",
  },
  {
    id: "siparis-raporu",
    src: "/product/siparis-raporu.png",
    w: 2880,
    h: 1800,
    category: "sales",
    i18nKey: "orders",
  },
  {
    id: "musteri-dagilimi",
    src: "/product/musteri-dagilimi-v2.png",
    w: 2880,
    h: 1800,
    category: "sales",
    i18nKey: "customerMix",
    previewPosition: "object-[center_18%]",
  },
  {
    id: "stok-satislari",
    src: "/product/stok-satislari-v2.png",
    w: 2880,
    h: 1800,
    category: "stock",
    i18nKey: "stockSales",
  },
  {
    id: "cariler",
    src: "/product/cariler.png",
    w: 2880,
    h: 3054,
    category: "ledger",
    i18nKey: "accounts",
  },
  {
    id: "pexels-dashboard-overview",
    src: "/product/pexels-dashboard-overview.jpg",
    w: 940,
    h: 625,
    category: "concept",
    i18nKey: "dashboardOverview",
  },
  {
    id: "pexels-financial-graphs",
    src: "/product/pexels-financial-graphs.jpg",
    w: 940,
    h: 627,
    category: "concept",
    i18nKey: "financialGraphs",
  },
  {
    id: "pexels-multi-monitor",
    src: "/product/pexels-multi-monitor.jpg",
    w: 940,
    h: 627,
    category: "concept",
    i18nKey: "multiMonitor",
  },
  {
    id: "pexels-analyst-charts",
    src: "/product/pexels-analyst-charts.jpg",
    w: 940,
    h: 627,
    category: "concept",
    i18nKey: "analystCharts",
  },
  {
    id: "media-erp-sync",
    src: "/product/media-erp-sync.png",
    w: 1024,
    h: 576,
    category: "concept",
    i18nKey: "erpSync",
  },
  {
    id: "media-workspace",
    src: "/product/media-workspace.png",
    w: 1024,
    h: 768,
    category: "concept",
    i18nKey: "workspace",
  },
  {
    id: "media-data-viz",
    src: "/product/media-data-viz.png",
    w: 1024,
    h: 576,
    category: "concept",
    i18nKey: "dataViz",
  },
] as const;

export const SHOWCASE_HERO_ID = "gelir-gider-trendi";

export function getScreenshot(id: string): ProductScreenshot | undefined {
  return PRODUCT_SCREENSHOTS.find((s) => s.id === id);
}

export function getScreenshotsByCategory(
  category: ReportCategory | "all",
): readonly ProductScreenshot[] {
  if (category === "all") return PRODUCT_SCREENSHOTS;
  return PRODUCT_SCREENSHOTS.filter((s) => s.category === category);
}

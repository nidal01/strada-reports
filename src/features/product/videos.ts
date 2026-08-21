/**
 * Canonical product video registry — homepage showcase + media page.
 */
export interface ProductVideo {
  id: string;
  src: string;
  /** i18n key under videoShowcase.sections.* and media.videos.* */
  i18nKey: string;
}

export const PRODUCT_VIDEOS: readonly ProductVideo[] = [
  {
    id: "strada-reports-final",
    src: "/product/strada-reports-final.mp4",
    i18nKey: "reportsOverview",
  },
  {
    id: "strada-analiz",
    src: "/product/strada-analiz.mp4",
    i18nKey: "salesAnalysis",
  },
  {
    id: "strada-yonetici",
    src: "/product/strada-yonetici.mp4",
    i18nKey: "executiveDashboard",
  },
  {
    id: "strada-karlilik",
    src: "/product/strada-karlilik.mp4",
    i18nKey: "profitability",
  },
] as const;

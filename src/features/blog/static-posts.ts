import type { BlogPost } from "./types";

const TS = "2026-01-15T10:00:00.000Z";

/** Read-only demo posts — Vercel'de Supabase yokken gösterilir. */
export const STATIC_DEMO_POSTS: readonly BlogPost[] = [
  {
    id: "post_demo_tr",
    slug: "dia-erp-entegrasyonu-ile-finansal-raporlama",
    locale: "tr",
    title: "DIA ERP Entegrasyonu ile Finansal Raporlama Nasıl Dönüşür?",
    excerpt:
      "ERP verinizi manuel tablolardan kurtarın. DIA entegrasyonu ile gerçek zamanlı finansal raporlama süreçlerini keşfedin.",
    content: `## ERP Verisi Neden Dağınık Kalır?

Çoğu şirket, DIA ERP'de doğru veriyi tutar ancak yönetime sunarken Excel'e döner. Bu süreç hem yavaş hem de hataya açıktır.

## Strada ile Gerçek Zamanlı Senkronizasyon

Strada, DIA ERP'deki kasa, banka, cari ve stok hareketlerini otomatik olarak çeker. Manuel aktarım, kopyala-yapıştır ve gecikme ortadan kalkar.

### Temel Faydalar

- **Anlık görünürlük:** Yönetim her an güncel veriyi görür
- **Hata azaltma:** Tek doğruluk kaynağından beslenen raporlar
- **Hızlı karar:** Aylık kapanışlar günler değil dakikalar sürer

## Sonuç

DIA ERP yatırımınızı güçlendirmek için üzerine modern bir raporlama katmanı ekleyin. Strada ile finansal netliği herkes için erişilebilir kılın.`,
    coverImage: null,
    status: "published",
    metaTitle: "DIA ERP Entegrasyonu ile Finansal Raporlama | Strada",
    metaDescription:
      "DIA ERP verinizi gerçek zamanlı finansal raporlara dönüştürün. Strada ile entegrasyon, otomasyon ve yönetim raporları tek platformda.",
    canonicalUrl: null,
    ogImage: null,
    focusKeyword: "DIA ERP finansal raporlama",
    robots: "index,follow",
    tags: ["DIA ERP", "finansal raporlama", "entegrasyon"],
    viewCount: 0,
    readCount: 0,
    author: "Strada",
    aiGenerated: false,
    publishedAt: TS,
    createdAt: TS,
    updatedAt: TS,
  },
  {
    id: "post_demo_en",
    slug: "real-time-erp-reporting-with-dia",
    locale: "en",
    title: "How DIA ERP Integration Transforms Financial Reporting",
    excerpt:
      "Move beyond manual spreadsheets. Discover real-time financial reporting workflows with DIA ERP integration.",
    content: `## Why ERP Data Stays Scattered

Most companies keep accurate data in DIA ERP but revert to Excel when presenting to management. This process is slow and error-prone.

## Real-Time Sync with Strada

Strada automatically pulls cash, bank, account and inventory movements from DIA ERP. Manual transfers, copy-paste and delays disappear.

### Key Benefits

- **Instant visibility:** Management sees up-to-date data at all times
- **Fewer errors:** Reports fed from a single source of truth
- **Faster decisions:** Month-end closes take minutes, not days

## Conclusion

Amplify your DIA ERP investment with a modern reporting layer on top. Make financial clarity accessible to everyone with Strada.`,
    coverImage: null,
    status: "published",
    metaTitle: "DIA ERP Integration for Financial Reporting | Strada",
    metaDescription:
      "Turn your DIA ERP data into real-time financial reports. Integration, automation and management dashboards in one platform.",
    canonicalUrl: null,
    ogImage: null,
    focusKeyword: "DIA ERP financial reporting",
    robots: "index,follow",
    tags: ["DIA ERP", "financial reporting", "integration"],
    viewCount: 0,
    readCount: 0,
    author: "Strada",
    aiGenerated: false,
    publishedAt: TS,
    createdAt: TS,
    updatedAt: TS,
  },
];

export function filterStaticPosts(opts?: {
  locale?: string;
  status?: string;
  limit?: number;
}): BlogPost[] {
  let posts = [...STATIC_DEMO_POSTS];
  if (opts?.locale) posts = posts.filter((p) => p.locale === opts.locale);
  if (opts?.status) posts = posts.filter((p) => p.status === opts.status);
  if (opts?.limit) posts = posts.slice(0, opts.limit);
  return posts;
}

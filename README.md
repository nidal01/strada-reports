# Strada — Kurumsal Finansal Raporlama Platformu

Ultra-premium, kurumsal düzeyde, yüksek dönüşümlü pazarlama sitesi. **strada.tr** —
DIA ERP entegrasyonu ile teklif, sipariş ve finansal raporlama süreçlerini tek
platformda toplayan SaaS ürününün web platformu.

## Tech Stack

| Katman | Teknoloji |
| --- | --- |
| Framework | Next.js 15 (App Router) · React 19 |
| Dil | TypeScript (strict, `noUncheckedIndexedAccess`) |
| Stil | Tailwind CSS v4 (CSS-first `@theme`) + CSS değişkenleri |
| Animasyon | Framer Motion 12 |
| UI | shadcn-tarzı bespoke primitives + Radix Slot |
| İkonlar | lucide-react |
| i18n | next-intl (TR varsayılan, EN) — lokalize pathname'ler |
| Form | React Hook Form + Zod |
| Font | Geist Sans / Geist Mono (self-hosted) |

## Komutlar

```bash
npm run dev        # geliştirme sunucusu (http://localhost:3000)
npm run build      # production build (SSG)
npm run start      # production sunucusu
npm run typecheck  # tsc --noEmit
```

## Mimari

Feature-based, `src/` altında:

```
src/
├── app/
│   ├── [locale]/              # lokalize root (html/body burada)
│   │   ├── layout.tsx         # navbar + footer + i18n provider + metadata
│   │   ├── page.tsx           # Home (Enterprise Gateway akışı)
│   │   ├── solutions/         # Çözümler (lokalize: /cozumler)
│   │   ├── about/             # Hakkımızda (lokalize: /hakkimizda)
│   │   ├── contact/           # İletişim / Demo (lokalize: /iletisim)
│   │   ├── [...rest]/         # catch-all → lokalize 404
│   │   ├── loading.tsx        # skeleton route UI
│   │   └── not-found.tsx
│   ├── globals.css            # DESIGN SYSTEM (tokens, utilities, keyframes)
│   ├── sitemap.ts · robots.ts · manifest.ts
├── components/
│   ├── brand/                 # Logo (crisp inline SVG)
│   ├── ui/                    # Button, Badge, Input, Card, Skeleton…
│   ├── layout/                # Navbar (glass), Footer, LanguageSwitcher
│   ├── motion/                # Reveal (scroll-triggered)
│   └── sections/              # Hero, SocialProof, FeaturesBento, Modules,
│                              # Testimonials, CtaBanner, PageHero
├── features/
│   └── contact/               # schema (Zod) + contact-form (RHF, animated)
├── i18n/                      # routing · request · navigation
├── lib/                       # utils (cn) · site config · motion presets
└── middleware.ts              # next-intl locale routing
messages/                      # tr.json · en.json (tüm metin içeriği)
public/brand · public/product  # logo + ürün görselleri
```

## Tasarım Sistemi

- **Estetik:** Deep-slate OLED zemin (`#020617`) + luminous elektrik-mavi marka
  aksanı (Strada logosundan türetildi) + zümrüt "pozitif veri" ikincil rengi.
- **Tokenlar:** `globals.css` içinde `@theme` (renkler, radii, easing, z-index).
- **Utilities:** `.glass`, `.glass-strong`, `.gradient-border`, `.text-gradient`,
  `.glow-brand`, `.bg-grid`, `.bg-dots`, `.shimmer`, `.mask-radial-faded`.
- **Erişilebilirlik:** görünür focus ring, skip-link, `prefers-reduced-motion`,
  semantik HTML, aria etiketleri, 44px+ dokunma hedefleri.
- **Performans:** SSG, sıfır-CLS (skeleton + rezerve alanlar), `optimizePackageImports`.

## Sonraki Adımlar (Phase 2)

- Contact formunu gerçek server action / e-posta sağlayıcısına bağlayın.
- `/og.png` (1200×630) OpenGraph görseli ekleyin.
- `next/image` ile gerçek ürün ekran görüntülerini Solutions/About'a yerleştirin.
- shadcn/ui MCP ile ek bileşenler (dialog, accordion, pricing tablosu).
- Analytics + form submission rate-limiting.

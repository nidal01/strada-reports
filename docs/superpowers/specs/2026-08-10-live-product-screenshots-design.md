# Live product screenshots on marketing site

Date: 2026-08-10  
Status: approved (pending user review of this file)

## Goal

Replace homepage and solutions-page product visuals with fresh screenshots taken from a live Strada Reports demo tenant on `app.strada.tr`, so marketing reflects the current product UI and seeded demo data.

## Scope

### In

- Replace these assets under `public/product/` (same filenames):
  - `finansal-durum.png`
  - `gelir-gider-trendi.png`
  - `satis-trendi.png`
  - `cariler.png`
  - `musteri-dagilimi.png`
  - `stok-satislari.png`
- Update homepage `HeroPanel`: remove the hand-built DOM mockup; show a framed live screenshot (`finansal-durum.png`).
- Keep Product Showcase layout (1 hero image + 2 supporting images).
- Refresh `alt` / caption copy in `messages/tr.json` and `messages/en.json` only if the captured screens differ meaningfully from existing descriptions.
- Solutions pages continue to reference the same `/product/*` paths via `src/features/solutions/data.ts` — no path changes required.

### Out

- Embedding live iframes or authenticated API-driven dashboards.
- Changing marketing layout, section order, or CTA flows.
- Committing or storing demo credentials in the repo, env files, or docs.
- Updating `mobil-app.jpeg` (mobile marketing asset; not in the six report screenshots).

## Approach

Static PNG replacement (Option 1 from brainstorm). Capture once from the demo tenant; serve via `next/image` as today.

## Capture requirements

- Source: production app at `https://app.strada.tr` (demo tenant).
- Login credentials supplied out-of-band by the operator; never written into git.
- Target width ~1400px (retina-friendly); PNG format.
- Prefer the report content area; keep framing consistent across shots (same viewport width).
- Crop or hide ephemeral UI chrome (toasts, cursors) when possible.
- Do not include PII beyond the demo seed data already intended for public demos.

### Screen → file mapping

| Asset | Report / view |
| --- | --- |
| `finansal-durum.png` | Finansal durum / overview dashboard (hero) |
| `gelir-gider-trendi.png` | Aylık gelir–gider trendi |
| `satis-trendi.png` | Satış trendi |
| `cariler.png` | Tüm cariler / ledger |
| `musteri-dagilimi.png` | Müşteri dağılımı |
| `stok-satislari.png` | Stok satışları |

## UI changes

### Hero

- Replace `src/components/sections/hero-panel.tsx` mock chart/metrics with an image-based panel:
  - Reuse the existing glass / gradient border treatment from Product Showcase browser chrome where it fits the hero.
  - `next/image` pointing at `/product/finansal-durum.png` with explicit width/height to avoid CLS.
- Remove obsolete hardcoded customer bar labels from the mock.

### Showcase & solutions

- No structural component changes unless image intrinsic dimensions change enough to warrant updating `width`/`height` props.
- After capture, measure PNG dimensions and update `width`/`height` in `product-showcase.tsx` and `solutions/data.ts` if they diverge from current values.

## Verification

- Local or production preview: hero shows the new finansal durum shot.
- Showcase shows three new shots in the existing grid.
- Solutions pages that reference product images render the new assets.
- No credentials appear in `git status` / diffs.
- Images are optimized enough for marketing (reasonable file size; not multi‑MB uncompressed dumps if avoidable).

## Rollout

1. Capture screenshots with automation or manual browser.
2. Overwrite `public/product/*.png`.
3. Update HeroPanel + dimension props / copy as needed.
4. Visual QA on homepage + one solutions detail page.
5. Deploy marketing site when approved.

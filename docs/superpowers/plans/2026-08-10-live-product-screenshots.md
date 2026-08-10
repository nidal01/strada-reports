# Live Product Screenshots Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace homepage hero mockup and all six marketing product PNGs with live screenshots from the demo tenant on `app.strada.tr`.

**Architecture:** Capture report screens via Playwright against production app, overwrite `public/product/*.png` in place, replace `HeroPanel` DOM mock with a framed `next/image` of `finansal-durum.png`. Solutions pages keep existing `/product/*` paths.

**Tech Stack:** Playwright (npx), Next.js 15, `next/image`, next-intl messages, Framer Motion hero shell.

## Global Constraints

- Never commit demo credentials (tenant, username, password) to git, docs, scripts checked in, or `.env*`.
- Keep filenames: `finansal-durum.png`, `gelir-gider-trendi.png`, `satis-trendi.png`, `cariler.png`, `musteri-dagilimi.png`, `stok-satislari.png`.
- Target ~1400px wide PNGs; update `width`/`height` props after measuring.
- Out of scope: `mobil-app.jpeg`, iframes, live API dashboards.

---

### Task 1: Capture live screenshots into `public/product/`

**Files:**
- Create (local only, gitignored if needed): `scripts/capture-demo-screenshots.mjs`
- Overwrite: `public/product/finansal-durum.png`
- Overwrite: `public/product/gelir-gider-trendi.png`
- Overwrite: `public/product/satis-trendi.png`
- Overwrite: `public/product/cariler.png`
- Overwrite: `public/product/musteri-dagilimi.png`
- Overwrite: `public/product/stok-satislari.png`

**Interfaces:**
- Consumes: Operator-supplied env vars `DEMO_TENANT`, `DEMO_USER`, `DEMO_PASS` (shell only)
- Produces: Six PNG files under `public/product/` ready for `next/image`

- [ ] **Step 1: Discover login + report routes in the live app**

Run Playwright codegen or a probe script against `https://app.strada.tr/login` to learn:
- Input selectors for tenant / username / password
- Post-login URLs for: finansal durum, gelir-gider trendi, satış trendi, cariler, müşteri dağılımı, stok satışları

Record the six absolute paths (e.g. `/reports/...`) in the capture script comments.

- [ ] **Step 2: Write capture script (credentials via env only)**

Create `scripts/capture-demo-screenshots.mjs` that:
1. Reads `DEMO_TENANT`, `DEMO_USER`, `DEMO_PASS` from env (exit 1 if missing)
2. Launches Chromium at viewport `1400x900` (deviceScaleFactor 2 if file size stays reasonable)
3. Logs in
4. Visits each report URL, waits for chart/table network idle / visible selector
5. Screenshots the main content region (prefer a report container selector; fallback full page)
6. Writes to the six `public/product/*.png` paths

Do **not** hardcode the password in the file.

- [ ] **Step 3: Run capture**

```bash
cd /Users/nidalirfanuymaz/Desktop/strada-reports
DEMO_TENANT='…' DEMO_USER='…' DEMO_PASS='…' npx playwright install chromium
DEMO_TENANT='…' DEMO_USER='…' DEMO_PASS='…' node scripts/capture-demo-screenshots.mjs
```

Expected: six PNGs overwritten; script exits 0.

- [ ] **Step 4: Verify files exist and look like real reports**

```bash
ls -la public/product/*.png
sips -g pixelWidth -g pixelHeight public/product/*.png
```

Open each PNG (Read tool / Preview) and confirm charts/tables are visible, not a login error page.

- [ ] **Step 5: Leave credentials out of git**

```bash
git status
```

Expected: only `public/product/*.png` (+ later code) dirty; no credential files. If `scripts/capture-demo-screenshots.mjs` is useful, keep it credential-free and commit in a later task; otherwise delete after capture.

---

### Task 2: Replace HeroPanel mock with screenshot

**Files:**
- Modify: `src/components/sections/hero-panel.tsx` (full rewrite)
- Possibly modify: `messages/tr.json` / `messages/en.json` hero keys only if unused sync/panel strings become dead (optional cleanup)

**Interfaces:**
- Consumes: `/product/finansal-durum.png` from Task 1; `useTranslations("hero")` for `syncTag` / `panelTitle` if still shown
- Produces: `HeroPanel` React component rendering framed product image

- [ ] **Step 1: Rewrite `HeroPanel` to image-based panel**

Replace the metrics/bars mock with:

```tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

export function HeroPanel() {
  const t = useTranslations("hero");

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, rotateX: 6 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
      style={{ perspective: 1200 }}
      className="glass-strong gradient-border relative w-full overflow-hidden rounded-2xl shadow-[0_40px_120px_-30px_rgba(2,6,23,0.9)]"
    >
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-surface-2/60 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-slate-400/40" />
          <span className="size-2.5 rounded-full bg-slate-400/40" />
          <span className="size-2.5 rounded-full bg-slate-400/40" />
        </div>
        <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-medium text-slate-500">
          <RefreshCw className="size-3" />
          {t("syncTag")}
        </span>
      </div>
      <Image
        src="/product/finansal-durum.png"
        alt={t("panelTitle")}
        width={1400}
        height={910}
        sizes="(max-width: 1024px) 100vw, 560px"
        className="w-full"
        priority
      />
    </motion.div>
  );
}
```

Adjust `width`/`height` to measured PNG dimensions from Task 1.

- [ ] **Step 2: Smoke-check Hero still imports cleanly**

```bash
npx tsc --noEmit
```

Expected: no errors from `hero-panel.tsx`.

- [ ] **Step 3: Visual check**

Run `npm run dev`, open `/tr`, confirm hero shows the live finansal durum screenshot inside the glass frame.

---

### Task 3: Sync image dimensions + captions

**Files:**
- Modify: `src/components/sections/product-showcase.tsx` (width/height if changed)
- Modify: `src/features/solutions/data.ts` (w/h map)
- Modify: `messages/tr.json` (`showcase.alt.*`, `showcase.cap.*`) only if screenshots differ
- Modify: `messages/en.json` (same keys)

**Interfaces:**
- Consumes: measured PNG sizes from Task 1
- Produces: Correct CLS-safe dimensions and accurate alt/captions

- [ ] **Step 1: Update numeric dimensions**

From `sips` output, set matching `width`/`height` (or `w`/`h`) in showcase + solutions data for each of the six files.

- [ ] **Step 2: Update alt/captions if needed**

If the captured screens still match “Gelir–Gider”, “Satış Trendi”, “Cariler”, leave copy. Otherwise update TR/EN strings to describe the visible report.

- [ ] **Step 3: Verify showcase + solutions pages**

Open `/tr` (showcase section) and one solutions page that uses product images; confirm no broken images and layout stable.

---

### Task 4: Cleanup + verification

**Files:**
- Delete or keep: `scripts/capture-demo-screenshots.mjs` (keep only if credential-free)
- No credential artifacts

- [ ] **Step 1: Ensure no secrets in tree**

Run the credential scan from the Task 4 brief (patterns for demo tenant, user, password env name, and known password prefix). Exclude `.git/` and `.superpowers/`.

Expected: no matches in tracked source files.

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: success.

- [ ] **Step 3: Deploy when operator asks**

`vercel --prod --yes` only if explicitly requested.

---

## Spec coverage

| Spec requirement | Task |
| --- | --- |
| Replace six PNGs | Task 1 |
| Hero mock → screenshot | Task 2 |
| Keep showcase layout / paths | Task 3 (dimensions only) |
| Update alt/captions if needed | Task 3 |
| No credentials in repo | Task 1 + 4 |
| Measure dimensions | Task 1 + 3 |
| Out: mobil-app, iframes | Not scheduled |

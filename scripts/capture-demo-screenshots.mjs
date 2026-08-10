/**
 * Capture live demo tenant report screenshots for marketing site.
 *
 * Usage (credentials via shell env only — never commit):
 *   DEMO_TENANT='…' DEMO_USER='…' DEMO_PASS='…' node scripts/capture-demo-screenshots.mjs
 *
 * Report routes (relative to /{tenant}/):
 *   finansal-durum.png      → /admin/overview  (/finance disabled on demo tenant)
 *   gelir-gider-trendi.png  → /reports/profit-loss
 *   satis-trendi.png        → /reports/sales
 *   cariler.png             → /reports/receivables
 *   musteri-dagilimi.png    → /reports/income
 *   stok-satislari.png      → /reports/stock
 */
import { chromium } from "playwright";
import { mkdir } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BASE_URL = "https://app.strada.tr";

const tenant = process.env.DEMO_TENANT;
const username = process.env.DEMO_USER;
const password = process.env.DEMO_PASS;

if (!tenant || !username || !password) {
  console.error("Missing DEMO_TENANT, DEMO_USER, or DEMO_PASS env vars");
  process.exit(1);
}

/** @typedef {'bar' | 'area' | 'pie' | 'table' | 'page'} ChartKind */

/** @type {Array<{ file: string; path: string; waitFor?: string; chart?: ChartKind; minSeries?: number }>} */
const TARGETS = [
  {
    file: "finansal-durum.png",
    path: "/admin/overview",
    waitFor: "text=Genel bakış",
    chart: "page",
  },
  {
    file: "gelir-gider-trendi.png",
    path: "/reports/profit-loss",
    waitFor: "text=Aylık Gelir-Gider Trendi",
    chart: "bar",
    minSeries: 4,
  },
  {
    file: "satis-trendi.png",
    path: "/reports/sales",
    waitFor: "text=Satış Trendi",
    chart: "bar",
    minSeries: 3,
  },
  {
    file: "cariler.png",
    path: "/reports/receivables",
    waitFor: "text=Tüm Cariler",
    chart: "table",
  },
  {
    file: "musteri-dagilimi.png",
    path: "/reports/income",
    waitFor: "text=Müşteri Dağılımı",
    chart: "pie",
    minSeries: 2,
  },
  {
    file: "stok-satislari.png",
    path: "/reports/stock",
    waitFor: "table",
    chart: "table",
  },
];

async function login(page) {
  await page.goto(`${BASE_URL}/login`, { waitUntil: "domcontentloaded" });
  await page.locator("#tenant_code").fill(tenant);
  await page.locator("#username").fill(username);
  await page.locator("#password").fill(password);
  await page.locator('[data-test="login-button"]').click();

  await page.waitForURL((url) => !url.pathname.endsWith("/login"), {
    timeout: 30_000,
  });

  if (page.url().includes("/select-company")) {
    await page.locator(".divide-y button").first().click();
    await page.getByRole("button", { name: "Devam et" }).click();
    await page.waitForURL(/\/dashboard/, { timeout: 15_000 });
  }
}

async function waitForSpinners(page) {
  const spinner = page.locator('[class*="animate-spin"]').first();
  if (await spinner.isVisible().catch(() => false)) {
    await spinner.waitFor({ state: "hidden", timeout: 60_000 }).catch(() => {});
  }
}

/**
 * Wait until Recharts (or similar) has rendered visible series — not just empty grid/axes.
 */
async function waitForChartSeries(page, kind, minSeries = 1) {
  if (kind === "page" || kind === "table") return;

  const timeout = 90_000;
  await page.waitForFunction(
    ({ kind, minSeries }) => {
      const minSize = 3;

      const visibleBars = () => {
        const nodes = document.querySelectorAll(
          ".recharts-bar-rectangle, .recharts-bar rect, .recharts-bar .recharts-rectangle",
        );
        let count = 0;
        for (const node of nodes) {
          const box = node.getBoundingClientRect();
          if (box.width >= minSize && box.height >= minSize) count++;
        }
        return count;
      };

      const visibleAreas = () => {
        const curves = document.querySelectorAll(
          ".recharts-area-curve, .recharts-area-area, .recharts-line-curve",
        );
        for (const curve of curves) {
          const d = curve.getAttribute("d") ?? "";
          if (d.length > 40) return true;
        }
        return false;
      };

      const visiblePie = () => {
        const sectors = document.querySelectorAll(".recharts-pie-sector, .recharts-sector");
        let count = 0;
        for (const sector of sectors) {
          const d = sector.getAttribute("d") ?? "";
          if (d.length > 10) count++;
        }
        return count;
      };

      if (kind === "bar") {
        const bars = visibleBars();
        if (bars >= minSeries) return true;
        if (visibleAreas()) return true;
        return false;
      }

      if (kind === "area") return visibleAreas();

      if (kind === "pie") return visiblePie() >= minSeries;

      return visibleBars() >= minSeries || visibleAreas() || visiblePie() >= minSeries;
    },
    { kind, minSeries },
    { timeout },
  );
}

async function waitForReportReady(page, target) {
  await page.waitForLoadState("networkidle", { timeout: 60_000 }).catch(() => {});
  await waitForSpinners(page);

  if (target.waitFor) {
    await page
      .locator(target.waitFor)
      .first()
      .waitFor({ state: "visible", timeout: 60_000 });
  }

  if (target.chart && target.chart !== "page" && target.chart !== "table") {
    await waitForChartSeries(page, target.chart, target.minSeries ?? 1);
  }

  // Let Recharts finish layout/animation paint
  await page.waitForTimeout(2000);
}

async function screenshotMainContent(page, outPath) {
  const candidates = [
    page.locator("main").first(),
    page.locator('[role="main"]').first(),
    page.locator('[data-testid="main-content"]').first(),
    page.locator(".main-content").first(),
  ];

  for (const locator of candidates) {
    if (await locator.isVisible().catch(() => false)) {
      await locator.screenshot({ path: outPath });
      return "main";
    }
  }

  console.warn("  ⚠ main content not found — falling back to full page");
  await page.screenshot({ path: outPath, fullPage: true });
  return "fullPage";
}

async function screenshotReport(page, target) {
  const url = `${BASE_URL}/${tenant}${target.path}`;
  console.log(`→ ${target.file} (${url})`);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await waitForReportReady(page, target);

  const outPath = join(ROOT, "public", "product", target.file);
  await mkdir(dirname(outPath), { recursive: true });
  const mode = await screenshotMainContent(page, outPath);

  console.log(`  ✓ ${outPath} (${mode})`);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1400, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    console.log("Logging in…");
    await login(page);
    console.log(`Logged in (${page.url()})`);

    for (const target of TARGETS) {
      await screenshotReport(page, target);
    }

    console.log("\nDone — 6 screenshots written to public/product/");
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

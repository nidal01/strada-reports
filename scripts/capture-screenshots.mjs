import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../public/product");

const company = process.env.STRADA_COMPANY;
const user = process.env.STRADA_USER;
const pass = process.env.STRADA_PASS;

if (!company || !user || !pass) {
  console.error("Missing credentials env vars");
  process.exit(1);
}

/** slug filename -> nav link text hints (Turkish) */
const CAPTURE_MAP = [
  { file: "gelir-gider-trendi", hints: ["gelir", "gider", "trend", "kâr", "kar / zarar", "kar-zarar"] },
  { file: "kar-zarar-raporu", hints: ["kâr", "kar", "zarar", "profit"] },
  { file: "gelir-raporu", hints: ["gelir rapor", "gelir"] },
  { file: "gider-raporu", hints: ["gider rapor", "gider", "masraf"] },
  { file: "satis-trendi", hints: ["satış trend", "satis trend", "satış"] },
  { file: "satis-raporu", hints: ["satış rapor", "satis rapor"] },
  { file: "siparis-raporu", hints: ["sipariş", "siparis"] },
  { file: "cariler", hints: ["cari", "cariler", "tüm cari"] },
  { file: "musteri-dagilimi", hints: ["müşteri", "musteri", "dağılım", "dagilim"] },
  { file: "stok-satislari", hints: ["stok sat", "stok"] },
  { file: "finansal-durum", hints: ["finansal durum", "kasa", "banka", "genel bakış"] },
];

async function loginAndEnter(page) {
  await page.goto("https://app.strada.tr", { waitUntil: "networkidle", timeout: 60000 });
  await page.fill("#tenant_code", company);
  await page.fill("#username", user);
  await page.fill("#password", pass);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/select-company|dashboard/, { timeout: 30000 });
  if (page.url().includes("select-company")) {
    await page.locator("button, a, [role='button']").filter({ hasText: /seç/i }).first().click();
    await page.waitForTimeout(1500);
  }
  if (!page.url().includes("dashboard")) {
    await page.goto(`https://app.strada.tr/${company}/dashboard`, { waitUntil: "networkidle", timeout: 30000 });
  }
  await page.waitForTimeout(2000);
  // aggressively dismiss changelog / modal / notification overlays
  await dismissOverlays(page);
}

/**
 * Close any changelog dialog, notification banner, or modal overlay that
 * might be covering report content. Tries multiple selector strategies.
 */
async function dismissOverlays(page) {
  const strategies = [
    // 1. Buttons with common dismiss labels
    () => page.getByRole("button", { name: /tamam|close|kapat|dismiss|anladım|got it/i }).first().click({ timeout: 1500 }),
    // 2. Dialog close button (X icon in top-right)
    () => page.locator('[data-state="open"] button[aria-label*="Close"], [data-state="open"] button[aria-label*="Kapat"]').first().click({ timeout: 1500 }),
    // 3. Generic dialog overlay click-to-dismiss
    () => page.locator('[data-slot="dialog-overlay"], [data-state="open"][aria-hidden="true"]').first().click({ timeout: 1500 }),
    // 4. Any visible close/X button inside a modal/dialog
    () => page.locator('div[role="dialog"] button:has(svg), [data-state="open"] button:has(svg)').first().click({ timeout: 1500 }),
    // 5. Escape key
    () => page.keyboard.press("Escape"),
  ];

  for (const strategy of strategies) {
    try {
      await strategy();
      await page.waitForTimeout(300);
    } catch {
      // strategy didn't match — continue
    }
  }

  // Final check: if any dialog overlay is still visible, try Escape again
  const overlayStillOpen = await page.locator('[data-state="open"]').count();
  if (overlayStillOpen > 0) {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
  }
}

async function getClickables(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll("a[href], button, [role='menuitem'], [role='link']")]
      .map((el) => ({
        text: (el.textContent ?? "").trim().replace(/\s+/g, " "),
        href: el instanceof HTMLAnchorElement ? el.href : "",
        tag: el.tagName,
      }))
      .filter((x) => x.text.length > 1 && x.text.length < 100),
  );
}

async function openSection(page, sectionName) {
  const link = page.getByRole("link", { name: new RegExp(sectionName, "i") }).first();
  if (await link.count()) {
    await link.click();
    await page.waitForTimeout(2500);
    await dismissOverlays(page);
    return true;
  }
  const btn = page.getByRole("button", { name: new RegExp(sectionName, "i") }).first();
  if (await btn.count()) {
    await btn.click();
    await page.waitForTimeout(2500);
    await dismissOverlays(page);
    return true;
  }
  return false;
}

async function capture(page, filename) {
  const out = path.join(OUT, `${filename}.png`);
  await dismissOverlays(page);
  // Give charts/tables a moment to hydrate after the route becomes interactive.
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out, fullPage: true });
  console.log("✓", filename);
}

async function tryCaptureByHints(page, file, hints) {
  const items = await getClickables(page);
  const match = items.find((item) =>
    hints.some((h) => item.text.toLowerCase().includes(h.toLowerCase())),
  );
  if (!match) return false;

  try {
    if (match.href && !match.href.endsWith("#")) {
      await page.goto(match.href, { waitUntil: "networkidle", timeout: 30000 });
    } else {
      await page.getByText(match.text, { exact: false }).first().click();
      await page.waitForTimeout(2500);
    }
    await dismissOverlays(page);
    await capture(page, file);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  try {
    await loginAndEnter(page);
    await capture(page, "dashboard-home");

    const sections = ["Finansal Raporlar", "Teklif", "Üretim"];
    for (const section of sections) {
      await openSection(page, section);
      const items = await getClickables(page);
      console.log(`\n--- ${section} (${page.url()}) ---`);
      console.log(items.slice(0, 30).map((i) => i.text).join(" | "));

      for (const { file, hints } of CAPTURE_MAP) {
        await tryCaptureByHints(page, file, hints);
      }
    }

    // Direct URL attempts for common report paths
    const base = `https://app.strada.tr/${company}`;
    const paths = [
      "reports/income-expense-trend",
      "reports/sales-trend",
      "reports/accounts",
      "reports/customers",
      "reports/stock-sales",
      "reports/financial-status",
      "reports/profit-loss",
      "reports/income",
      "reports/expense",
      "reports/orders",
      "financial-reports",
      "reports",
    ];
    for (const p of paths) {
      try {
        await page.goto(`${base}/${p}`, { waitUntil: "networkidle", timeout: 15000 });
        if (!page.url().includes("login")) {
          const slug = p.split("/").pop() ?? p;
          await capture(page, `_probe-${slug}`);
        }
      } catch {
        /* ignore */
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

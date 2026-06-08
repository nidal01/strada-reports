import type { Locale } from "@/i18n/routing";
import { callGemini, parseGeminiJson } from "./gemini";
import { createTopics, hasTopicsForWeek } from "./topics";
import type { BlogTopic, BlogTopicInput } from "./types";

const TOPICS_PER_WEEK = 14; // günde 2 yazı × 7 gün

const SYSTEM = `Sen Strada adlı B2B SaaS platformu için içerik stratejisti olarak çalışıyorsun.
Strada: DIA ERP entegrasyonlu kurumsal finansal raporlama, stok yönetimi, fatura dönüştürücü ve yönetim panelleri sunar.
Hedef kitle: Türkiye'deki üretim, inşaat ve dağıtım şirketlerinin finans/operasyon yöneticileri.
Yanıtlarını yalnızca geçerli JSON olarak ver.`;

interface PlannedTopic {
  title: string;
  keywords: string[];
  imageQuery: string;
  scheduledDate: string;
  notes?: string;
}

interface PlannerResult {
  topics: PlannedTopic[];
}

function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day; // Pazartesi
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function buildPlannerPrompt(weekStart: string, locale: Locale): string {
  const lang = locale === "tr" ? "Türkçe" : "English";
  const endDate = addDays(weekStart, 6);
  const slots: string[] = [];
  for (let d = 0; d < 7; d++) {
    const date = addDays(weekStart, d);
    slots.push(`${date} (sabah)`, `${date} (akşam)`);
  }

  return `${lang} dilinde ${TOPICS_PER_WEEK} adet blog konusu planla.
Hafta: ${weekStart} — ${endDate}
Her gün 2 yazı (sabah + akşam) için toplam 14 konu üret.

Konular şunları kapsamalı (tekrar etme):
- DIA ERP entegrasyonu ve finansal raporlama
- Kâr/zarar, gelir/gider, satış ve sipariş raporları
- Stok yönetimi, envanter optimizasyonu
- Excel/fatura otomasyonu, dijital dönüşüm
- İnşaat ve üretim sektörü ERP kullanımı
- KOBİ'lerde veri odaklı yönetim

Her konu için:
- title: çekici, SEO uyumlu başlık (max 90 karakter)
- keywords: 4-6 anahtar kelime (birincil SEO kelimesi ilk sırada)
- imageQuery: İngilizce stok fotoğraf arama terimi (ör. "financial dashboard office")
- scheduledDate: YYYY-MM-DD (${weekStart} ile ${endDate} arası, günde 2 farklı konu)
- notes: opsiyonel kısa editör notu

Zamanlama sırası:
${slots.map((s, i) => `${i + 1}. ${s}`).join("\n")}

JSON formatı:
{
  "topics": [
    {
      "title": "...",
      "keywords": ["...", "..."],
      "imageQuery": "...",
      "scheduledDate": "YYYY-MM-DD",
      "notes": "..."
    }
  ]
}`;
}

/** Haftalık blog konularını Gemini ile üretir ve Supabase'e kaydeder. */
export async function generateWeeklyTopics(
  locale: Locale = "tr",
  opts?: { force?: boolean },
): Promise<BlogTopic[]> {
  const weekStart = getWeekStart();

  if (!opts?.force && (await hasTopicsForWeek(weekStart, locale))) {
    throw new Error(`Bu hafta (${weekStart}) için konular zaten mevcut`);
  }

  const raw = await callGemini(buildPlannerPrompt(weekStart, locale), SYSTEM);
  const parsed = parseGeminiJson<PlannerResult>(raw);

  if (!parsed.topics?.length) {
    throw new Error("Gemini konu listesi üretemedi");
  }

  const inputs: BlogTopicInput[] = parsed.topics.slice(0, TOPICS_PER_WEEK).map((t) => ({
    title: t.title.trim(),
    locale,
    keywords: t.keywords.map((k) => k.trim()).filter(Boolean),
    imageQuery: t.imageQuery?.trim() || "business finance technology",
    scheduledDate: t.scheduledDate,
    weekStart,
    notes: t.notes?.trim() || null,
    status: "pending",
  }));

  return createTopics(inputs);
}

export { getWeekStart };

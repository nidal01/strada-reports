/** gemini-2.0-flash Haziran 2026'da kapatıldı — güncel Flash modelleri kullanın. */
const DEFAULT_MODEL = "gemini-2.5-flash";

const FALLBACK_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-3-flash",
  "gemini-3.1-flash-lite",
] as const;

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY tanımlı değil");
  return key;
}

function getPrimaryModel(): string {
  const configured = process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  // Eski/kapatılmış modelleri otomatik yönlendir
  if (configured.startsWith("gemini-2.0") || configured.startsWith("gemini-1.5")) {
    return DEFAULT_MODEL;
  }
  return configured;
}

function getModelChain(): string[] {
  const primary = getPrimaryModel();
  const rest = FALLBACK_MODELS.filter((m) => m !== primary);
  return [primary, ...rest];
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string; code?: number };
};

function parseRetrySeconds(message: string): number | null {
  const m = message.match(/retry in ([\d.]+)s/i);
  return m ? Math.ceil(parseFloat(m[1]!) + 1) : null;
}

function isQuotaOrRateLimit(message: string, status: number): boolean {
  const lower = message.toLowerCase();
  return (
    status === 429 ||
    lower.includes("quota") ||
    lower.includes("rate limit") ||
    lower.includes("resource exhausted")
  );
}

function isModelUnavailable(message: string, status: number): boolean {
  const lower = message.toLowerCase();
  return (
    status === 404 ||
    lower.includes("not found") ||
    lower.includes("shut down") ||
    (lower.includes("limit: 0") && lower.includes("free_tier"))
  );
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callGeminiOnce(
  model: string,
  prompt: string,
  system?: string,
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${getApiKey()}`;

  const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];
  if (system) {
    contents.push({ role: "user", parts: [{ text: system }] });
    contents.push({
      role: "model",
      parts: [{ text: "Anladım. Talimatlara uygun JSON yanıt vereceğim." }],
    });
  }
  contents.push({ role: "user", parts: [{ text: prompt }] });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.75,
        responseMimeType: "application/json",
      },
    }),
  });

  const data = (await res.json()) as GeminiResponse;
  const errMsg = data.error?.message ?? `Gemini API hatası: ${res.status}`;

  if (!res.ok) {
    const err = new Error(errMsg) as Error & { status?: number; retryAfter?: number };
    err.status = res.status;
    const retry = parseRetrySeconds(errMsg);
    if (retry) err.retryAfter = retry;
    throw err;
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini boş yanıt döndü");
  return text;
}

/** Google Gemini ile JSON üretir — model fallback ve rate-limit retry ile. */
export async function callGemini(prompt: string, system?: string): Promise<string> {
  const models = getModelChain();
  let lastError: Error | null = null;

  for (const model of models) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        return await callGeminiOnce(model, prompt, system);
      } catch (err) {
        const error = err as Error & { status?: number; retryAfter?: number };
        lastError = error;

        if (isModelUnavailable(error.message, error.status ?? 0)) {
          console.warn(`[gemini] Model kullanılamıyor (${model}), sonraki deneniyor…`);
          break;
        }

        if (isQuotaOrRateLimit(error.message, error.status ?? 0)) {
          const wait = error.retryAfter ?? 60;
          if (attempt === 0) {
            console.warn(`[gemini] Kota/rate limit (${model}), ${wait}s bekleniyor…`);
            await sleep(wait * 1000);
            continue;
          }
          break;
        }

        throw error;
      }
    }
  }

  throw new Error(
    lastError?.message ??
      "Gemini kotası doldu. GEMINI_MODEL=gemini-2.5-flash ayarlayın veya faturalandırmayı etkinleştirin.",
  );
}

/** JSON bloğunu markdown fence içinden veya ham olarak parse eder. */
export function parseGeminiJson<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const json = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(json) as T;
}

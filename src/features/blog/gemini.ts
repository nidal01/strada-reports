const DEFAULT_MODEL = "gemini-2.0-flash";

function getApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY tanımlı değil");
  return key;
}

function getModel(): string {
  return process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
}

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
  error?: { message?: string };
};

/** Google Gemini ile JSON veya metin üretir. */
export async function callGemini(prompt: string, system?: string): Promise<string> {
  const model = getModel();
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
  if (!res.ok) {
    throw new Error(data.error?.message ?? `Gemini API hatası: ${res.status}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini boş yanıt döndü");
  return text;
}

/** JSON bloğunu markdown fence içinden veya ham olarak parse eder. */
export function parseGeminiJson<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const json = fenced?.[1]?.trim() ?? trimmed;
  return JSON.parse(json) as T;
}

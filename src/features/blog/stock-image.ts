/** Ücretsiz stok görsel — Pexels API veya konuya göre yedek havuz. */
export async function fetchStockImage(query: string): Promise<string | null> {
  const q = query.trim() || "business finance dashboard";
  const pexelsKey = process.env.PEXELS_API_KEY;

  if (pexelsKey) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape`,
        { headers: { Authorization: pexelsKey }, next: { revalidate: 86400 } },
      );
      if (res.ok) {
        const data = (await res.json()) as {
          photos?: Array<{ src?: { large2x?: string; large?: string } }>;
        };
        const url = data.photos?.[0]?.src?.large2x ?? data.photos?.[0]?.src?.large;
        if (url) return url;
      }
    } catch {
      /* fallback */
    }
  }

  return pickFallbackImage(q);
}

const FALLBACK_IMAGES = [
  "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=1600",
  "https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=1600",
] as const;

function pickFallbackImage(query: string): string {
  let hash = 0;
  for (let i = 0; i < query.length; i++) {
    hash = (hash + query.charCodeAt(i) * (i + 1)) % FALLBACK_IMAGES.length;
  }
  return FALLBACK_IMAGES[hash] ?? FALLBACK_IMAGES[0];
}

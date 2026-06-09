import type { Locale } from "@/i18n/routing";
import { callGemini, parseGeminiJson } from "./gemini";
import { createPost } from "./posts";
import { fetchStockImage } from "./stock-image";
import { markTopicUsed, pickNextPendingTopic } from "./topics";
import { slugify } from "./slug";
import { countWords, MIN_BLOG_WORDS } from "./word-count";
import type { BlogPost, BlogTopic, GenerateBlogInput } from "./types";

const SYSTEM = `Sen Strada markası için B2B SaaS içerik yazarısın.
Strada Reports, DIA ERP entegrasyonlu kurumsal finansal raporlama platformudur.
Profesyonel, SEO odaklı, bilgilendirici blog yazıları üretirsin.
Strada Reports'u doğal şekilde öner; aşırı reklam yapma.
Yanıtın yalnızca geçerli JSON olmalı.`;

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  tags: string[];
  imageQuery?: string;
}

function buildPrompt(topic: string, locale: Locale, keywords: string[]): string {
  const lang = locale === "tr" ? "Türkçe" : "English";
  const kw = keywords.length ? keywords.join(", ") : topic;

  return `${lang} dilinde aşağıdaki konuda blog yazısı yaz:

Konu: "${topic}"
Anahtar kelimeler: ${kw}

Gereksinimler:
- content: Markdown formatında EN AZ ${MIN_BLOG_WORDS} kelime (zorunlu)
- En az 5 adet ## ana başlık ve altında ### alt başlıklar kullan
- Giriş paragrafı, somut örnekler, madde işaretli listeler ve sonuç bölümü olsun
- Hedef kitle: Türkiye'deki üretim, inşaat ve dağıtım şirketlerinin CFO/COO/CEO'ları
- DIA ERP, finansal raporlama, stok yönetimi ve dijital dönüşüm bağlamında yaz
- Strada Reports'u çözüm olarak doğal biçimde 1-2 kez an

JSON formatı:
{
  "title": "string (max 80 karakter)",
  "excerpt": "string (max 220 karakter)",
  "content": "string (markdown, min ${MIN_BLOG_WORDS} kelime)",
  "metaTitle": "string (SEO başlık, max 60 karakter)",
  "metaDescription": "string (SEO açıklama, max 155 karakter)",
  "focusKeyword": "string (birincil anahtar kelime)",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "imageQuery": "string (İngilizce stok fotoğraf arama terimi)"
}`;
}

function parseGenerated(raw: string): GeneratedArticle {
  const parsed = parseGeminiJson<GeneratedArticle>(raw);
  if (!parsed.title || !parsed.content) {
    throw new Error("Gemini yanıtı geçersiz");
  }
  return parsed;
}

async function generateArticle(
  topic: string,
  locale: Locale,
  keywords: string[],
): Promise<GeneratedArticle> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const prompt =
      attempt === 0
        ? buildPrompt(topic, locale, keywords)
        : `${buildPrompt(topic, locale, keywords)}\n\nÖNEMLİ: Önceki deneme ${MIN_BLOG_WORDS} kelimenin altındaydı. Bu sefer kesinlikle en az ${MIN_BLOG_WORDS} kelime yaz.`;

    const raw = await callGemini(prompt, SYSTEM);
    const article = parseGenerated(raw);
    const words = countWords(article.content);

    if (words >= MIN_BLOG_WORDS) return article;
    lastError = new Error(`Yazı çok kısa: ${words} kelime (min ${MIN_BLOG_WORDS})`);
  }

  throw lastError ?? new Error("Blog yazısı üretilemedi");
}

/** Gemini ile blog yazısı üretir, stok görsel ekler ve kaydeder. */
export async function generateBlogPost(input: GenerateBlogInput): Promise<BlogPost> {
  const keywords = input.keywords ?? [];
  const article = await generateArticle(input.topic, input.locale, keywords);

  const imageQuery = input.imageQuery ?? article.imageQuery ?? keywords[0] ?? input.topic;
  const coverImage = await fetchStockImage(imageQuery);

  const slug = slugify(article.title);
  const post = await createPost({
    slug,
    locale: input.locale,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    coverImage,
    status: input.publish ? "published" : "draft",
    metaTitle: article.metaTitle,
    metaDescription: article.metaDescription,
    canonicalUrl: null,
    ogImage: coverImage,
    focusKeyword: article.focusKeyword ?? keywords[0] ?? null,
    robots: "index,follow",
    tags: article.tags,
    author: "Strada",
    aiGenerated: true,
  });

  if (input.topicId) {
    await markTopicUsed(input.topicId, post.id);
  }

  return post;
}

/** Cron: sıradaki bekleyen konudan yayınlanmış blog üretir. */
export async function generateBlogFromQueue(locale: Locale = "tr"): Promise<{
  post: BlogPost;
  topic: BlogTopic;
} | null> {
  const topic = await pickNextPendingTopic(locale);
  if (!topic) return null;

  const post = await generateBlogPost({
    topic: topic.title,
    locale: topic.locale,
    keywords: topic.keywords,
    imageQuery: topic.imageQuery ?? undefined,
    publish: true,
    topicId: topic.id,
  });

  return { post, topic };
}

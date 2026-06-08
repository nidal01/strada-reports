import type { Locale } from "@/i18n/routing";
import { slugify } from "./slug";
import { createPost } from "./posts";
import type { BlogPost, GenerateBlogInput } from "./types";

const TOPICS_TR = [
  "DIA ERP entegrasyonu ile finansal raporlama",
  "Kâr/zarar raporunu yönetime sunmanın en iyi yolları",
  "Stok yönetimi ve envanter optimizasyonu",
  "İnşaat sektöründe dijital dönüşüm",
  "Gerçek zamanlı finansal veri ile karar alma",
  "Excel faturalarını ERP'ye otomatik aktarma",
  "Satış raporları ile bölgesel büyüme stratejisi",
  "KOBİ'ler için kurumsal raporlama araçları",
] as const;

const TOPICS_EN = [
  "Financial reporting with DIA ERP integration",
  "How to present P&L reports to management",
  "Inventory management and optimisation",
  "Digital transformation in construction",
  "Data-driven decision making with real-time finance",
  "Automating Excel invoice imports to ERP",
  "Regional growth strategy with sales reports",
  "Enterprise reporting tools for SMBs",
] as const;

interface GeneratedArticle {
  title: string;
  excerpt: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
}

async function callOpenAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY tanımlı değil");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a B2B SaaS content writer for Strada, an enterprise financial reporting platform integrated with DIA ERP in Turkey. Write professional, SEO-friendly blog posts. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API hatası: ${res.status} ${err}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };
  return data.choices[0]?.message?.content ?? "";
}

function buildPrompt(topic: string, locale: Locale, keywords: string[]): string {
  const lang = locale === "tr" ? "Turkish" : "English";
  const kw = keywords.length ? `Keywords: ${keywords.join(", ")}.` : "";

  return `Write a blog post in ${lang} about: "${topic}".
${kw}
Target audience: finance directors, operations managers and CEOs of manufacturing/construction companies in Turkey.
Mention Strada naturally as a solution (ERP reporting, DIA integration, financial dashboards) without being overly promotional.

Return JSON with this exact shape:
{
  "title": "string (max 80 chars)",
  "excerpt": "string (max 200 chars)",
  "content": "string (markdown, 800-1200 words, use ## headings and bullet lists)",
  "metaTitle": "string (SEO title, max 60 chars)",
  "metaDescription": "string (SEO description, max 155 chars)",
  "tags": ["tag1", "tag2", "tag3"]
}`;
}

function parseGenerated(raw: string): GeneratedArticle {
  const parsed = JSON.parse(raw) as GeneratedArticle;
  if (!parsed.title || !parsed.content) {
    throw new Error("AI yanıtı geçersiz");
  }
  return parsed;
}

/** Generate and optionally publish a blog post via OpenAI. */
export async function generateBlogPost(input: GenerateBlogInput): Promise<BlogPost> {
  const raw = await callOpenAI(buildPrompt(input.topic, input.locale, input.keywords ?? []));
  const article = parseGenerated(raw);
  const slug = slugify(article.title);

  return createPost({
    slug,
    locale: input.locale,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: null,
    status: input.publish ? "published" : "draft",
    metaTitle: article.metaTitle,
    metaDescription: article.metaDescription,
    tags: article.tags,
    author: "Strada",
    aiGenerated: true,
  });
}

/** Pick a rotating topic for scheduled cron generation. */
export function pickCronTopic(locale: Locale): string {
  const topics = locale === "tr" ? TOPICS_TR : TOPICS_EN;
  const index = new Date().getUTCDay() % topics.length;
  return topics[index] ?? topics[0]!;
}

import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { generateBlogFromQueue } from "@/features/blog/ai-generate";
import { generateWeeklyTopics } from "@/features/blog/topic-planner";
import { countWords } from "@/features/blog/word-count";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Ücretsiz Gemini kotası için varsayılan 1; GEMINI_POSTS_PER_CRON=2 ile artırılabilir. */
const POSTS_PER_RUN = Math.min(
  Math.max(Number(process.env.GEMINI_POSTS_PER_CRON ?? "1") || 1, 1),
  2,
);

/** Vercel Cron (Hobby: günde 1 kez, 14:35 TR / 11:35 UTC) — Pazartesi konu planı + blog yazısı. */
export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const topicsCreated: string[] = [];
  const postsCreated: Array<{
    postId: string;
    topicId: string;
    title: string;
    slug: string;
    wordCount: number;
  }> = [];

  try {
    // Pazartesi: haftalık konu planı (zaten varsa atla)
    if (new Date().getUTCDay() === 1) {
      try {
        const topics = await generateWeeklyTopics("tr");
        topicsCreated.push(...topics.map((t) => t.id));
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (!msg.includes("zaten mevcut")) throw err;
      }
    }

    for (let i = 0; i < POSTS_PER_RUN; i++) {
      if (i > 0) {
        // RPM limiti için istekler arası bekleme
        await new Promise((r) => setTimeout(r, 65_000));
      }
      const result = await generateBlogFromQueue("tr");
      if (!result) break;

      postsCreated.push({
        postId: result.post.id,
        topicId: result.topic.id,
        title: result.post.title,
        slug: result.post.slug,
        wordCount: countWords(result.post.content),
      });
    }

    return NextResponse.json({
      ok: true,
      topicsCreated: topicsCreated.length,
      topicIds: topicsCreated,
      postsCreated: postsCreated.length,
      posts: postsCreated,
      message:
        postsCreated.length === 0
          ? "Bekleyen konu yok — admin panelden haftalık konu üretin"
          : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { generateBlogFromQueue } from "@/features/blog/ai-generate";
import { countWords } from "@/features/blog/word-count";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Manuel test — üretim cron'u: /api/cron/blog-pipeline (günde 1×, 2 yazı). */
export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const result = await generateBlogFromQueue("tr");

    if (!result) {
      return NextResponse.json({
        ok: true,
        skipped: true,
        message: "Bekleyen konu yok — haftalık konu cron'unu çalıştırın",
      });
    }

    return NextResponse.json({
      ok: true,
      postId: result.post.id,
      topicId: result.topic.id,
      title: result.post.title,
      slug: result.post.slug,
      wordCount: countWords(result.post.content),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

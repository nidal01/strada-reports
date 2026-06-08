import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { generateBlogPost, pickCronTopic } from "@/features/blog/ai-generate";

export const dynamic = "force-dynamic";

/** Vercel Cron — haftalık otomatik blog yazısı üretir (TR + EN). */
export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  try {
    const [trPost, enPost] = await Promise.all([
      generateBlogPost({
        topic: pickCronTopic("tr"),
        locale: "tr",
        publish: true,
        keywords: ["Strada", "DIA ERP", "finansal raporlama"],
      }),
      generateBlogPost({
        topic: pickCronTopic("en"),
        locale: "en",
        publish: true,
        keywords: ["Strada", "DIA ERP", "financial reporting"],
      }),
    ]);

    return NextResponse.json({
      ok: true,
      created: [trPost.id, enPost.id],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cron başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/auth";
import { generateWeeklyTopics } from "@/features/blog/topic-planner";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

/** Vercel Cron — haftada bir gelecek 7 gün için 14 blog konusu üretir. */
export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "1";

  try {
    const topics = await generateWeeklyTopics("tr", { force });
    return NextResponse.json({
      ok: true,
      count: topics.length,
      weekStart: topics[0]?.weekStart,
      topicIds: topics.map((t) => t.id),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Konu üretimi başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

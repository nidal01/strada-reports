import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateWeeklyTopics } from "@/features/blog/topic-planner";
import { createTopic, listTopics } from "@/features/blog/topics";

const createSchema = z.object({
  title: z.string().min(5),
  locale: z.enum(["tr", "en"]).default("tr"),
  keywords: z.array(z.string()).default([]),
  imageQuery: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  weekStart: z.string(),
  notes: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const weekStart = searchParams.get("weekStart") ?? undefined;
  const status = searchParams.get("status") as "pending" | "used" | "skipped" | null;

  const topics = await listTopics({
    weekStart,
    status: status ?? undefined,
    limit: 100,
  });

  return NextResponse.json({ topics });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const body = await request.json();

  if (body.action === "generate-week") {
    try {
      const topics = await generateWeeklyTopics(body.locale ?? "tr", {
        force: Boolean(body.force),
      });
      return NextResponse.json({ topics }, { status: 201 });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Konu üretimi başarısız";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const topic = await createTopic({
    ...parsed.data,
    imageQuery: parsed.data.imageQuery ?? null,
    scheduledDate: parsed.data.scheduledDate ?? null,
    notes: parsed.data.notes ?? null,
  });

  return NextResponse.json({ topic }, { status: 201 });
}

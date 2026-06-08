import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { deleteTopic, getTopicById, updateTopic } from "@/features/blog/topics";

const updateSchema = z.object({
  title: z.string().min(5).optional(),
  locale: z.enum(["tr", "en"]).optional(),
  keywords: z.array(z.string()).optional(),
  imageQuery: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  status: z.enum(["pending", "used", "skipped"]).optional(),
  notes: z.string().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const topic = await getTopicById(id);
  if (!topic) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ topic });
}

export async function PATCH(request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const { id } = await params;
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const topic = await updateTopic(id, parsed.data);
  if (!topic) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ topic });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deleteTopic(id);
  if (!ok) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

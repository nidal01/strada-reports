import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { generateBlogPost } from "@/features/blog/ai-generate";

const schema = z.object({
  topic: z.string().min(5),
  locale: z.enum(["tr", "en"]).default("tr"),
  keywords: z.array(z.string()).optional(),
  publish: z.boolean().default(false),
});

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const post = await generateBlogPost(parsed.data);
    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "AI üretimi başarısız";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

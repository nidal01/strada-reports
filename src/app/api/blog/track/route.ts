import { NextResponse } from "next/server";
import { z } from "zod";
import { incrementPostRead, incrementPostView, getPostById } from "@/features/blog/posts";

const schema = z.object({
  postId: z.string().min(1),
  type: z.enum(["view", "read"]),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const { postId, type } = parsed.data;
  const post = await getPostById(postId);
  if (!post || post.status !== "published") {
    return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  }

  try {
    if (type === "view") await incrementPostView(postId);
    else await incrementPostRead(postId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Sayaç güncellenemedi" }, { status: 500 });
  }
}

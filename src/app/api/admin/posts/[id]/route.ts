import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { deletePost, getPostById, updatePost } from "@/features/blog/posts";
import { slugify } from "@/features/blog/slug";

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().optional(),
  locale: z.enum(["tr", "en"]).optional(),
  excerpt: z.string().optional(),
  content: z.string().min(10).optional(),
  coverImage: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
  focusKeyword: z.string().nullable().optional(),
  robots: z.string().optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  aiGenerated: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ post });
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

  const data = { ...parsed.data };
  if (data.slug) data.slug = slugify(data.slug);

  const post = await updatePost(id, data);
  if (!post) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deletePost(id);
  if (!ok) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

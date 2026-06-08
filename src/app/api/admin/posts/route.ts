import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminAuthenticated } from "@/lib/auth";
import { createPost, listPosts } from "@/features/blog/posts";
import { slugify } from "@/features/blog/slug";

const createSchema = z.object({
  title: z.string().min(3),
  slug: z.string().optional(),
  locale: z.enum(["tr", "en"]),
  excerpt: z.string().default(""),
  content: z.string().min(10),
  coverImage: z.string().nullable().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
  focusKeyword: z.string().nullable().optional(),
  robots: z.string().default("index,follow"),
  tags: z.array(z.string()).default([]),
  author: z.string().default("Strada"),
  aiGenerated: z.boolean().default(false),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  const posts = await listPosts({ limit: 200 });
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const post = await createPost({
    ...data,
    slug: data.slug ? slugify(data.slug) : slugify(data.title),
    coverImage: data.coverImage ?? null,
    metaTitle: data.metaTitle ?? null,
    metaDescription: data.metaDescription ?? null,
    canonicalUrl: data.canonicalUrl ?? null,
    ogImage: data.ogImage ?? null,
    focusKeyword: data.focusKeyword ?? null,
  });

  return NextResponse.json({ post }, { status: 201 });
}

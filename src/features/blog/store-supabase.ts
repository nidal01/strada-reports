import { createSupabaseAdmin } from "@/lib/supabase/server";
import type { BlogPost, BlogPostInput } from "./types";

type Row = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: string | null;
  focus_keyword: string | null;
  robots: string | null;
  tags: string[] | unknown;
  author: string;
  ai_generated: boolean;
  view_count: number;
  read_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

function mapRow(row: Row): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    locale: row.locale as BlogPost["locale"],
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    coverImage: row.cover_image,
    status: row.status as BlogPost["status"],
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    canonicalUrl: row.canonical_url,
    ogImage: row.og_image,
    focusKeyword: row.focus_keyword,
    robots: row.robots ?? "index,follow",
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    author: row.author,
    aiGenerated: row.ai_generated,
    viewCount: row.view_count ?? 0,
    readCount: row.read_count ?? 0,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function newId() {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function rowFromInput(input: BlogPostInput, id: string, ts: string, publishedAt: string | null) {
  return {
    id,
    slug: input.slug,
    locale: input.locale,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    cover_image: input.coverImage,
    status: input.status,
    meta_title: input.metaTitle,
    meta_description: input.metaDescription,
    canonical_url: input.canonicalUrl,
    og_image: input.ogImage,
    focus_keyword: input.focusKeyword,
    robots: input.robots ?? "index,follow",
    tags: input.tags,
    author: input.author,
    ai_generated: input.aiGenerated,
    published_at: publishedAt,
    updated_at: ts,
  };
}

export async function supabaseListPosts(opts?: {
  locale?: string;
  status?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  const supabase = createSupabaseAdmin();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(opts?.limit ?? 100);

  if (opts?.locale) query = query.eq("locale", opts.locale);
  if (opts?.status) query = query.eq("status", opts.status);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data as Row[]).map(mapRow);
}

export async function supabaseGetPostById(id: string): Promise<BlogPost | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data as Row) : null;
}

export async function supabaseGetPostBySlug(slug: string, locale: string): Promise<BlogPost | null> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("locale", locale)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? mapRow(data as Row) : null;
}

export async function supabaseCreatePost(input: BlogPostInput): Promise<BlogPost> {
  const supabase = createSupabaseAdmin();
  const id = newId();
  const ts = new Date().toISOString();
  const publishedAt =
    input.status === "published" ? (input.publishedAt ?? ts) : (input.publishedAt ?? null);

  const { data, error } = await supabase
    .from("blog_posts")
    .insert(rowFromInput(input, id, ts, publishedAt))
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as Row);
}

export async function supabaseUpdatePost(
  id: string,
  input: Partial<BlogPostInput>,
): Promise<BlogPost | null> {
  const current = await supabaseGetPostById(id);
  if (!current) return null;

  const ts = new Date().toISOString();
  let publishedAt = current.publishedAt;
  if (input.status === "published") {
    publishedAt = input.publishedAt ?? current.publishedAt ?? ts;
  } else if (input.status === "draft") {
    publishedAt = null;
  } else if (input.publishedAt !== undefined) {
    publishedAt = input.publishedAt;
  }

  const merged: BlogPostInput = {
    slug: input.slug ?? current.slug,
    locale: input.locale ?? current.locale,
    title: input.title ?? current.title,
    excerpt: input.excerpt ?? current.excerpt,
    content: input.content ?? current.content,
    coverImage: input.coverImage !== undefined ? input.coverImage : current.coverImage,
    status: input.status ?? current.status,
    metaTitle: input.metaTitle !== undefined ? input.metaTitle : current.metaTitle,
    metaDescription:
      input.metaDescription !== undefined ? input.metaDescription : current.metaDescription,
    canonicalUrl: input.canonicalUrl !== undefined ? input.canonicalUrl : current.canonicalUrl,
    ogImage: input.ogImage !== undefined ? input.ogImage : current.ogImage,
    focusKeyword: input.focusKeyword !== undefined ? input.focusKeyword : current.focusKeyword,
    robots: input.robots ?? current.robots,
    tags: input.tags ?? current.tags,
    author: input.author ?? current.author,
    aiGenerated: input.aiGenerated ?? current.aiGenerated,
  };

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .update(rowFromInput(merged, id, ts, publishedAt))
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data as Row);
}

export async function supabaseDeletePost(id: string): Promise<boolean> {
  const supabase = createSupabaseAdmin();
  const { error, count } = await supabase.from("blog_posts").delete({ count: "exact" }).eq("id", id);
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

export async function supabaseListPublishedSlugs(): Promise<Array<{ slug: string; locale: string }>> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("slug, locale")
    .eq("status", "published");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function supabaseIncrementCounter(
  id: string,
  type: "view" | "read",
): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.rpc("increment_blog_counter", {
    post_id: id,
    counter_type: type,
  });
  if (error) throw new Error(error.message);
}

import type { BlogPost, BlogPostInput } from "./types";
import { ensureBlogSchema, getSql } from "./db";

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
  tags: string[] | unknown;
  author: string;
  ai_generated: boolean;
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
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    author: row.author,
    aiGenerated: row.ai_generated,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function newId() {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function pgListPosts(opts?: {
  locale?: string;
  status?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  await ensureBlogSchema();
  const sql = getSql();

  const rows = (await sql`
    SELECT * FROM blog_posts
    WHERE (${opts?.locale ?? null}::text IS NULL OR locale = ${opts?.locale ?? null})
      AND (${opts?.status ?? null}::text IS NULL OR status = ${opts?.status ?? null})
    ORDER BY COALESCE(published_at, created_at) DESC
    LIMIT ${opts?.limit ?? 100}
  `) as Row[];

  return rows.map(mapRow);
}

export async function pgGetPostById(id: string): Promise<BlogPost | null> {
  await ensureBlogSchema();
  const sql = getSql();
  const rows = (await sql`SELECT * FROM blog_posts WHERE id = ${id} LIMIT 1`) as Row[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function pgGetPostBySlug(slug: string, locale: string): Promise<BlogPost | null> {
  await ensureBlogSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT * FROM blog_posts
    WHERE slug = ${slug} AND locale = ${locale} AND status = 'published'
    LIMIT 1
  `) as Row[];
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function pgCreatePost(input: BlogPostInput): Promise<BlogPost> {
  await ensureBlogSchema();
  const sql = getSql();
  const id = newId();
  const ts = new Date().toISOString();
  const publishedAt =
    input.status === "published" ? (input.publishedAt ?? ts) : (input.publishedAt ?? null);

  const rows = (await sql`
    INSERT INTO blog_posts (
      id, slug, locale, title, excerpt, content, cover_image, status,
      meta_title, meta_description, tags, author, ai_generated, published_at
    ) VALUES (
      ${id}, ${input.slug}, ${input.locale}, ${input.title}, ${input.excerpt},
      ${input.content}, ${input.coverImage}, ${input.status},
      ${input.metaTitle}, ${input.metaDescription}, ${JSON.stringify(input.tags)},
      ${input.author}, ${input.aiGenerated}, ${publishedAt}
    )
    RETURNING *
  `) as Row[];

  return mapRow(rows[0]!);
}

export async function pgUpdatePost(
  id: string,
  input: Partial<BlogPostInput>,
): Promise<BlogPost | null> {
  const current = await pgGetPostById(id);
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

  await ensureBlogSchema();
  const sql = getSql();

  const rows = (await sql`
    UPDATE blog_posts SET
      slug = ${input.slug ?? current.slug},
      locale = ${input.locale ?? current.locale},
      title = ${input.title ?? current.title},
      excerpt = ${input.excerpt ?? current.excerpt},
      content = ${input.content ?? current.content},
      cover_image = ${input.coverImage !== undefined ? input.coverImage : current.coverImage},
      status = ${input.status ?? current.status},
      meta_title = ${input.metaTitle !== undefined ? input.metaTitle : current.metaTitle},
      meta_description = ${input.metaDescription !== undefined ? input.metaDescription : current.metaDescription},
      tags = ${JSON.stringify(input.tags ?? current.tags)},
      author = ${input.author ?? current.author},
      ai_generated = ${input.aiGenerated ?? current.aiGenerated},
      published_at = ${publishedAt},
      updated_at = ${ts}
    WHERE id = ${id}
    RETURNING *
  `) as Row[];

  return rows[0] ? mapRow(rows[0]) : null;
}

export async function pgDeletePost(id: string): Promise<boolean> {
  await ensureBlogSchema();
  const sql = getSql();
  const rows = (await sql`DELETE FROM blog_posts WHERE id = ${id} RETURNING id`) as {
    id: string;
  }[];
  return rows.length > 0;
}

export async function pgListPublishedSlugs(): Promise<Array<{ slug: string; locale: string }>> {
  await ensureBlogSchema();
  const sql = getSql();
  const rows = (await sql`
    SELECT slug, locale FROM blog_posts WHERE status = 'published'
  `) as Array<{ slug: string; locale: string }>;
  return rows;
}

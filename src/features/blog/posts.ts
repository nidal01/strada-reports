import { hasDatabase } from "./db";
import * as json from "./store-json";
import * as pg from "./store-postgres";
import type { BlogPost, BlogPostInput } from "./types";

const usePg = () => hasDatabase();

export async function listPosts(opts?: {
  locale?: string;
  status?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  return usePg() ? pg.pgListPosts(opts) : json.jsonListPosts(opts);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  return usePg() ? pg.pgGetPostById(id) : json.jsonGetPostById(id);
}

export async function getPublishedPostBySlug(
  slug: string,
  locale: string,
): Promise<BlogPost | null> {
  return usePg() ? pg.pgGetPostBySlug(slug, locale) : json.jsonGetPostBySlug(slug, locale);
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  return usePg() ? pg.pgCreatePost(input) : json.jsonCreatePost(input);
}

export async function updatePost(
  id: string,
  input: Partial<BlogPostInput>,
): Promise<BlogPost | null> {
  return usePg() ? pg.pgUpdatePost(id, input) : json.jsonUpdatePost(id, input);
}

export async function deletePost(id: string): Promise<boolean> {
  return usePg() ? pg.pgDeletePost(id) : json.jsonDeletePost(id);
}

export async function listPublishedSlugs(): Promise<Array<{ slug: string; locale: string }>> {
  if (usePg()) return pg.pgListPublishedSlugs();
  const posts = await json.jsonListPosts({ status: "published" });
  return posts.map((p) => ({ slug: p.slug, locale: p.locale }));
}

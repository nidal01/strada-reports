import { useSupabase } from "./env";
import * as json from "./store-json";
import * as sb from "./store-supabase";
import type { BlogPost, BlogPostInput } from "./types";

const useSb = () => useSupabase();

export async function listPosts(opts?: {
  locale?: string;
  status?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  return useSb() ? sb.supabaseListPosts(opts) : json.jsonListPosts(opts);
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  return useSb() ? sb.supabaseGetPostById(id) : json.jsonGetPostById(id);
}

export async function getPublishedPostBySlug(
  slug: string,
  locale: string,
): Promise<BlogPost | null> {
  return useSb() ? sb.supabaseGetPostBySlug(slug, locale) : json.jsonGetPostBySlug(slug, locale);
}

export async function createPost(input: BlogPostInput): Promise<BlogPost> {
  return useSb() ? sb.supabaseCreatePost(input) : json.jsonCreatePost(input);
}

export async function updatePost(
  id: string,
  input: Partial<BlogPostInput>,
): Promise<BlogPost | null> {
  return useSb() ? sb.supabaseUpdatePost(id, input) : json.jsonUpdatePost(id, input);
}

export async function deletePost(id: string): Promise<boolean> {
  return useSb() ? sb.supabaseDeletePost(id) : json.jsonDeletePost(id);
}

export async function listPublishedSlugs(): Promise<Array<{ slug: string; locale: string }>> {
  if (useSb()) return sb.supabaseListPublishedSlugs();
  const posts = await json.jsonListPosts({ status: "published" });
  return posts.map((p) => ({ slug: p.slug, locale: p.locale }));
}

export async function incrementPostView(id: string): Promise<void> {
  if (!useSb()) return;
  await sb.supabaseIncrementCounter(id, "view");
}

export async function incrementPostRead(id: string): Promise<void> {
  if (!useSb()) return;
  await sb.supabaseIncrementCounter(id, "read");
}

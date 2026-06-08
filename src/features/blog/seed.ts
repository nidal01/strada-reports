import { isWritableJsonStore } from "./env";
import { STATIC_DEMO_POSTS } from "./static-posts";
import { jsonCreatePost, jsonListPosts } from "./store-json";

/** Seed demo posts when running locally without Supabase. */
export async function seedDemoPostsIfEmpty(): Promise<void> {
  if (!isWritableJsonStore()) return;

  const existing = await jsonListPosts();
  if (existing.length > 0) return;

  for (const post of STATIC_DEMO_POSTS) {
    await jsonCreatePost({
      slug: post.slug,
      locale: post.locale,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      status: post.status,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      canonicalUrl: post.canonicalUrl,
      ogImage: post.ogImage,
      focusKeyword: post.focusKeyword,
      robots: post.robots,
      tags: [...post.tags],
      author: post.author,
      aiGenerated: post.aiGenerated,
      publishedAt: post.publishedAt,
    });
  }
}

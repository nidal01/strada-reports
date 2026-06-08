import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { isWritableJsonStore } from "./env";
import { filterStaticPosts } from "./static-posts";
import type { BlogPost, BlogPostInput } from "./types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "blog-posts.json");

async function readStore(): Promise<BlogPost[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw) as BlogPost[];
  } catch {
    return [];
  }
}

async function writeStore(posts: BlogPost[]): Promise<void> {
  if (!isWritableJsonStore()) {
    throw new Error("Blog store is read-only in production. Set SUPABASE_URL.");
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
}

function now() {
  return new Date().toISOString();
}

function newId() {
  return `post_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export async function jsonListPosts(opts?: {
  locale?: string;
  status?: string;
  limit?: number;
}): Promise<BlogPost[]> {
  let posts = await readStore();
  if (posts.length === 0 && !isWritableJsonStore()) {
    return filterStaticPosts(opts);
  }
  if (opts?.locale) posts = posts.filter((p) => p.locale === opts.locale);
  if (opts?.status) posts = posts.filter((p) => p.status === opts.status);
  posts.sort((a, b) => {
    const da = a.publishedAt ?? a.createdAt;
    const db = b.publishedAt ?? b.createdAt;
    return db.localeCompare(da);
  });
  if (opts?.limit) posts = posts.slice(0, opts.limit);
  return posts;
}

export async function jsonGetPostById(id: string): Promise<BlogPost | null> {
  const posts = await readStore();
  return posts.find((p) => p.id === id) ?? null;
}

export async function jsonGetPostBySlug(
  slug: string,
  locale: string,
): Promise<BlogPost | null> {
  const posts = await readStore();
  const fromFile = posts.find(
    (p) => p.slug === slug && p.locale === locale && p.status === "published",
  );
  if (fromFile) return fromFile;
  if (!isWritableJsonStore()) {
    return (
      filterStaticPosts({ locale, status: "published" }).find((p) => p.slug === slug) ?? null
    );
  }
  return null;
}

export async function jsonCreatePost(input: BlogPostInput): Promise<BlogPost> {
  const posts = await readStore();
  const ts = now();
  const post: BlogPost = {
    id: newId(),
    ...input,
    robots: input.robots ?? "index,follow",
    viewCount: 0,
    readCount: 0,
    publishedAt:
      input.status === "published" ? (input.publishedAt ?? ts) : (input.publishedAt ?? null),
    createdAt: ts,
    updatedAt: ts,
  };
  posts.unshift(post);
  await writeStore(posts);
  return post;
}

export async function jsonUpdatePost(
  id: string,
  input: Partial<BlogPostInput>,
): Promise<BlogPost | null> {
  const posts = await readStore();
  const idx = posts.findIndex((p) => p.id === id);
  if (idx === -1) return null;

  const current = posts[idx]!;
  const ts = now();
  const next: BlogPost = {
    ...current,
    ...input,
    id: current.id,
    viewCount: current.viewCount,
    readCount: current.readCount,
    createdAt: current.createdAt,
    updatedAt: ts,
    publishedAt:
      input.status === "published"
        ? (input.publishedAt ?? current.publishedAt ?? ts)
        : input.status === "draft"
          ? null
          : (input.publishedAt ?? current.publishedAt),
  };
  posts[idx] = next;
  await writeStore(posts);
  return next;
}

export async function jsonDeletePost(id: string): Promise<boolean> {
  const posts = await readStore();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) return false;
  await writeStore(next);
  return true;
}

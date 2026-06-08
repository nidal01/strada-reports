import { neon } from "@neondatabase/serverless";
import { useDatabase } from "./env";

let initialized = false;

export { useDatabase as hasDatabase };

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL tanımlı değil");
  return neon(url);
}

/** Idempotent schema bootstrap — safe to call on every cold start. */
export async function ensureBlogSchema(): Promise<void> {
  if (!useDatabase() || initialized) return;

  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL,
      locale TEXT NOT NULL DEFAULT 'tr',
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL,
      cover_image TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      meta_title TEXT,
      meta_description TEXT,
      tags JSONB NOT NULL DEFAULT '[]',
      author TEXT NOT NULL DEFAULT 'Strada',
      ai_generated BOOLEAN NOT NULL DEFAULT false,
      published_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (slug, locale)
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_locale_status ON blog_posts (locale, status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts (published_at DESC)`;

  initialized = true;
}

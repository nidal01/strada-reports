-- Strada Blog — Supabase şeması
-- Supabase Dashboard → SQL Editor'da çalıştırın.

CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'tr',
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  og_image TEXT,
  focus_keyword TEXT,
  robots TEXT NOT NULL DEFAULT 'index,follow',
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  author TEXT NOT NULL DEFAULT 'Strada',
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  read_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (slug, locale)
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_locale_status ON blog_posts (locale, status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts (published_at DESC NULLS LAST);

-- Atomik sayaç artırma (görüntülenme / okunma)
CREATE OR REPLACE FUNCTION increment_blog_counter(post_id TEXT, counter_type TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF counter_type = 'view' THEN
    UPDATE blog_posts SET view_count = view_count + 1, updated_at = NOW() WHERE id = post_id;
  ELSIF counter_type = 'read' THEN
    UPDATE blog_posts SET read_count = read_count + 1, updated_at = NOW() WHERE id = post_id;
  END IF;
END;
$$;

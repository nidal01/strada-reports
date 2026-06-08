-- Haftalık blog konu planı (admin'de düzenlenebilir)
CREATE TABLE IF NOT EXISTS blog_topics (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'tr',
  keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_query TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'used', 'skipped')),
  scheduled_date DATE,
  week_start DATE NOT NULL,
  post_id TEXT REFERENCES blog_posts(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blog_topics_status_scheduled
  ON blog_topics (status, scheduled_date NULLS LAST);

CREATE INDEX IF NOT EXISTS idx_blog_topics_week_locale
  ON blog_topics (week_start, locale);

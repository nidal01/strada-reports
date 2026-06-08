import type { Locale } from "@/i18n/routing";

export type BlogPostStatus = "draft" | "published";

export interface BlogPost {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: BlogPostStatus;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  focusKeyword: string | null;
  robots: string;
  tags: string[];
  author: string;
  aiGenerated: boolean;
  viewCount: number;
  readCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BlogPostInput = Pick<
  BlogPost,
  | "slug"
  | "locale"
  | "title"
  | "excerpt"
  | "content"
  | "coverImage"
  | "status"
  | "metaTitle"
  | "metaDescription"
  | "canonicalUrl"
  | "ogImage"
  | "focusKeyword"
  | "robots"
  | "tags"
  | "author"
  | "aiGenerated"
> & {
  publishedAt?: string | null;
};

export interface GenerateBlogInput {
  topic: string;
  locale: Locale;
  keywords?: string[];
  publish?: boolean;
}

export interface TocHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

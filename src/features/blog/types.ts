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
  tags: string[];
  author: string;
  aiGenerated: boolean;
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

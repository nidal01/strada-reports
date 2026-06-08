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

export type BlogTopicStatus = "pending" | "used" | "skipped";

export interface BlogTopic {
  id: string;
  title: string;
  locale: Locale;
  keywords: string[];
  imageQuery: string | null;
  status: BlogTopicStatus;
  scheduledDate: string | null;
  weekStart: string;
  postId: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type BlogTopicInput = Pick<
  BlogTopic,
  "title" | "locale" | "keywords" | "imageQuery" | "weekStart"
> & {
  status?: BlogTopicStatus;
  scheduledDate?: string | null;
  notes?: string | null;
};

export interface GenerateBlogInput {
  topic: string;
  locale: Locale;
  keywords?: string[];
  imageQuery?: string;
  publish?: boolean;
  topicId?: string;
}

export interface TocHeading {
  level: 2 | 3;
  text: string;
  id: string;
}

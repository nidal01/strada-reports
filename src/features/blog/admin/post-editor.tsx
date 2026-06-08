"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { BlogPost } from "@/features/blog/types";

type FormState = {
  title: string;
  slug: string;
  locale: "tr" | "en";
  excerpt: string;
  content: string;
  coverImage: string;
  status: "draft" | "published";
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  focusKeyword: string;
  robots: string;
  tags: string;
  author: string;
};

function toForm(post?: BlogPost): FormState {
  return {
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    locale: post?.locale ?? "tr",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    coverImage: post?.coverImage ?? "",
    status: post?.status ?? "draft",
    metaTitle: post?.metaTitle ?? "",
    metaDescription: post?.metaDescription ?? "",
    canonicalUrl: post?.canonicalUrl ?? "",
    ogImage: post?.ogImage ?? "",
    focusKeyword: post?.focusKeyword ?? "",
    robots: post?.robots ?? "index,follow",
    tags: post?.tags.join(", ") ?? "",
    author: post?.author ?? "Strada",
  };
}

export function PostEditor({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => toForm(post));
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      coverImage: form.coverImage || null,
      metaTitle: form.metaTitle || null,
      metaDescription: form.metaDescription || null,
      canonicalUrl: form.canonicalUrl || null,
      ogImage: form.ogImage || null,
      focusKeyword: form.focusKeyword || null,
      robots: form.robots || "index,follow",
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(post ? `/api/admin/posts/${post.id}` : "/api/admin/posts", {
        method: post ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Kayıt başarısız");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    if (!aiTopic.trim()) return;
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          locale: form.locale,
          publish: false,
        }),
      });
      const data = (await res.json()) as { post?: BlogPost; error?: string };
      if (!res.ok) throw new Error(data.error ?? "AI üretimi başarısız");

      if (data.post) {
        setForm(toForm(data.post));
        router.replace(`/admin/posts/${data.post.id}/edit`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI üretimi başarısız");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="space-y-8">
      {post ? (
        <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-surface/40 p-5 sm:grid-cols-3">
          <div>
            <p className="text-xs text-slate-500">Görüntülenme</p>
            <p className="mt-1 text-2xl font-semibold text-white">{post.viewCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Okunma</p>
            <p className="mt-1 text-2xl font-semibold text-white">{post.readCount}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Son güncelleme</p>
            <p className="mt-1 text-sm text-slate-300">{post.updatedAt.slice(0, 16).replace("T", " ")}</p>
          </div>
        </div>
      ) : null}

      {/* AI generator */}
      <div className="rounded-2xl border border-brand-500/20 bg-brand-500/5 p-6">
        <h2 className="text-lg font-semibold text-white">AI ile Yazı Üret</h2>
        <p className="mt-1 text-sm text-slate-400">
          Konu girin, OpenAI otomatik blog yazısı oluştursun. Taslak olarak kaydedilir.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Örn: DIA ERP ile stok yönetimi ipuçları"
            value={aiTopic}
            onChange={(e) => setAiTopic(e.target.value)}
          />
          <Button type="button" onClick={handleGenerate} disabled={generating}>
            {generating ? "Üretiliyor…" : "AI ile Üret"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {error ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Başlık</Label>
            <Input
              id="title"
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="otomatik-uretilir"
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="locale">Dil</Label>
            <select
              id="locale"
              value={form.locale}
              onChange={(e) => update("locale", e.target.value as "tr" | "en")}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-surface-2/60 px-4 text-sm text-white"
            >
              <option value="tr">Türkçe</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Durum</Label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => update("status", e.target.value as "draft" | "published")}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-surface-2/60 px-4 text-sm text-white"
            >
              <option value="draft">Taslak</option>
              <option value="published">Yayında</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Yazar</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => update("author", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Özet</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">İçerik (Markdown)</Label>
          <Textarea
            id="content"
            required
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
            rows={18}
            className="font-mono text-xs"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Etiketler (virgülle ayırın)</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => update("tags", e.target.value)}
            placeholder="DIA ERP, raporlama, finans"
          />
        </div>

        <details className="rounded-xl border border-[var(--border)] bg-surface/40 p-4">
          <summary className="cursor-pointer text-sm font-medium text-slate-300">
            SEO Ayarları
          </summary>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Başlık</Label>
              <Input
                id="metaTitle"
                value={form.metaTitle}
                onChange={(e) => update("metaTitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Açıklama</Label>
              <Textarea
                id="metaDescription"
                value={form.metaDescription}
                onChange={(e) => update("metaDescription", e.target.value)}
                rows={2}
                placeholder="Arama sonuçlarında görünen açıklama (max ~155 karakter)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focusKeyword">Odak Anahtar Kelime</Label>
              <Input
                id="focusKeyword"
                value={form.focusKeyword}
                onChange={(e) => update("focusKeyword", e.target.value)}
                placeholder="Örn: DIA ERP finansal raporlama"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="canonicalUrl">Canonical URL</Label>
              <Input
                id="canonicalUrl"
                value={form.canonicalUrl}
                onChange={(e) => update("canonicalUrl", e.target.value)}
                placeholder="https://strada.tr/blog/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="robots">Robots</Label>
              <select
                id="robots"
                value={form.robots}
                onChange={(e) => update("robots", e.target.value)}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-surface-2/60 px-4 text-sm text-white"
              >
                <option value="index,follow">index, follow</option>
                <option value="noindex,follow">noindex, follow</option>
                <option value="index,nofollow">index, nofollow</option>
                <option value="noindex,nofollow">noindex, nofollow</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="coverImage">Kapak Görseli URL</Label>
              <Input
                id="coverImage"
                value={form.coverImage}
                onChange={(e) => update("coverImage", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ogImage">Open Graph Görseli URL</Label>
              <Input
                id="ogImage"
                value={form.ogImage}
                onChange={(e) => update("ogImage", e.target.value)}
                placeholder="Boş bırakılırsa kapak görseli kullanılır"
              />
            </div>
          </div>
        </details>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Kaydediliyor…" : post ? "Güncelle" : "Kaydet"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/admin")}>
            İptal
          </Button>
        </div>
      </form>
    </div>
  );
}

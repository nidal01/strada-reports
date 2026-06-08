"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { BlogTopic } from "@/features/blog/types";

export function TopicEditor({ topic }: { topic: BlogTopic }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: topic.title,
    keywords: topic.keywords.join(", "),
    imageQuery: topic.imageQuery ?? "",
    scheduledDate: topic.scheduledDate ?? "",
    notes: topic.notes ?? "",
    status: topic.status,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/topics/${topic.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          keywords: form.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
          imageQuery: form.imageQuery || null,
          scheduledDate: form.scheduledDate || null,
          notes: form.notes || null,
          status: form.status,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Kayıt başarısız");
      router.push("/admin/topics");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kayıt başarısız");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="title">Konu Başlığı</Label>
        <Input
          id="title"
          required
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">Anahtar Kelimeler</Label>
        <Input
          id="keywords"
          value={form.keywords}
          onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))}
          placeholder="virgülle ayırın"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="scheduledDate">Planlanan Tarih</Label>
          <Input
            id="scheduledDate"
            type="date"
            value={form.scheduledDate}
            onChange={(e) => setForm((f) => ({ ...f, scheduledDate: e.target.value }))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Durum</Label>
          <select
            id="status"
            value={form.status}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                status: e.target.value as "pending" | "used" | "skipped",
              }))
            }
            className="h-11 w-full rounded-xl border border-[var(--border)] bg-surface-2/60 px-4 text-sm text-white"
          >
            <option value="pending">Bekliyor</option>
            <option value="used">Kullanıldı</option>
            <option value="skipped">Atlandı</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageQuery">Stok Görsel Arama Terimi (İngilizce)</Label>
        <Input
          id="imageQuery"
          value={form.imageQuery}
          onChange={(e) => setForm((f) => ({ ...f, imageQuery: e.target.value }))}
          placeholder="financial reporting dashboard"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Editör Notu</Label>
        <Textarea
          id="notes"
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Kaydediliyor…" : "Kaydet"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/topics")}>
          İptal
        </Button>
      </div>
    </form>
  );
}

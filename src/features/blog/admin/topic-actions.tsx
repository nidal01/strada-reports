"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function GenerateWeekTopicsButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick(force = false) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate-week", locale: "tr", force }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Üretim başarısız");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Üretim başarısız");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex gap-2">
        <Button type="button" onClick={() => handleClick(false)} disabled={loading}>
          {loading ? "Üretiliyor…" : "Haftalık Konuları Üret (Gemini)"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => handleClick(true)} disabled={loading}>
          Yeniden üret
        </Button>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

export function TopicStatusSelect({
  id,
  status,
}: {
  id: string;
  status: "pending" | "used" | "skipped";
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function onChange(next: "pending" | "used" | "skipped") {
    setValue(next);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/topics/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setValue(status);
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      disabled={saving}
      onChange={(e) => onChange(e.target.value as "pending" | "used" | "skipped")}
      className="h-9 rounded-lg border border-[var(--border)] bg-surface-2/60 px-2 text-xs text-white"
    >
      <option value="pending">Bekliyor</option>
      <option value="used">Kullanıldı</option>
      <option value="skipped">Atlandı</option>
    </select>
  );
}

export function DeleteTopicButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Bu konuyu silmek istediğinize emin misiniz?")) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/topics/${id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button type="button" variant="ghost" size="sm" onClick={handleDelete} disabled={loading}>
      Sil
    </Button>
  );
}

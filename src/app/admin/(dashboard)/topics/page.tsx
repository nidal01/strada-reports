import Link from "next/link";
import { listTopics } from "@/features/blog/topics";
import { getWeekStart } from "@/features/blog/topic-planner";
import {
  DeleteTopicButton,
  GenerateWeekTopicsButton,
  TopicStatusSelect,
} from "@/features/blog/admin/topic-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminTopicsPage() {
  const weekStart = getWeekStart();
  let topics: Awaited<ReturnType<typeof listTopics>> = [];
  let storeError: string | null = null;

  try {
    topics = await listTopics({ limit: 100 });
  } catch (err) {
    storeError = err instanceof Error ? err.message : "Konular yüklenemedi";
  }

  const thisWeek = topics.filter((t) => t.weekStart === weekStart);
  const pending = topics.filter((t) => t.status === "pending").length;

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog Konuları</h1>
          <p className="mt-1 text-sm text-slate-400">
            Haftalık plan · Bu hafta ({weekStart}): {thisWeek.length} konu · Bekleyen: {pending}
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Gemini haftada bir 14 konu üretir. Cron günde 1 kez çalışır ve 2 yazı oluşturur (Hobby
            plan uyumlu).
          </p>
        </div>
        <GenerateWeekTopicsButton />
      </div>

      <div className="mt-6 flex gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">← Yazılar</Link>
        </Button>
      </div>

      {storeError ? (
        <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {storeError}
          <p className="mt-2 text-xs text-amber-300/80">
            Supabase SQL Editor&apos;da <code>002_blog_topics.sql</code> migration&apos;ını çalıştırın.
          </p>
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-surface-2/60 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Konu</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Anahtar Kelimeler</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Tarih</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {topics.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                  Henüz konu yok. &quot;Haftalık Konuları Üret&quot; ile Gemini plan oluşturun.
                </td>
              </tr>
            ) : (
              topics.map((topic) => (
                <tr key={topic.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{topic.title}</div>
                    {topic.notes ? (
                      <div className="mt-1 text-xs text-slate-500">{topic.notes}</div>
                    ) : null}
                    {topic.postId ? (
                      <Link
                        href={`/admin/posts/${topic.postId}/edit`}
                        className="mt-1 inline-block text-xs text-brand-300 hover:underline"
                      >
                        Yazıyı düzenle →
                      </Link>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {topic.keywords.slice(0, 4).map((kw) => (
                        <Badge key={kw} variant="neutral" className="text-[10px]">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-500 sm:table-cell">
                    {topic.scheduledDate ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <TopicStatusSelect id={topic.id} status={topic.status} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/topics/${topic.id}/edit`}>Düzenle</Link>
                      </Button>
                      <DeleteTopicButton id={topic.id} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

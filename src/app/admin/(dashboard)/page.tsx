import Link from "next/link";
import { listPosts } from "@/features/blog/posts";
import { seedDemoPostsIfEmpty } from "@/features/blog/seed";
import { DeletePostButton } from "@/features/blog/admin/post-actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await seedDemoPostsIfEmpty();
  const posts = await listPosts({ limit: 200 });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Blog Yazıları</h1>
          <p className="mt-1 text-sm text-slate-400">
            {posts.length} yazı ·{" "}
            {process.env.SUPABASE_URL ? "Supabase" : "Yerel JSON (demo)"}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/posts/new">+ Yeni Yazı</Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-surface-2/60 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Başlık</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Dil</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Durum</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Görüntülenme</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Okunma</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Tarih</th>
              <th className="px-4 py-3 font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                  Henüz yazı yok. Yeni yazı ekleyin veya AI ile üretin.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{post.title}</div>
                    <div className="text-xs text-slate-500">/{post.slug}</div>
                    {post.aiGenerated ? (
                      <Badge variant="brand" className="mt-1">
                        AI
                      </Badge>
                    ) : null}
                  </td>
                  <td className="hidden px-4 py-3 uppercase text-slate-400 sm:table-cell">
                    {post.locale}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <Badge variant={post.status === "published" ? "brand" : "neutral"}>
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </Badge>
                  </td>
                  <td className="hidden px-4 py-3 text-slate-400 md:table-cell">{post.viewCount}</td>
                  <td className="hidden px-4 py-3 text-slate-400 lg:table-cell">{post.readCount}</td>
                  <td className="hidden px-4 py-3 text-slate-500 lg:table-cell">
                    {(post.publishedAt ?? post.createdAt).slice(0, 10)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/posts/${post.id}/edit`}>Düzenle</Link>
                      </Button>
                      <DeletePostButton id={post.id} />
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

import { PostEditor } from "@/features/blog/admin/post-editor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Yeni Blog Yazısı</h1>
      <p className="mt-1 text-sm text-slate-400">Manuel yazın veya AI ile otomatik üretin.</p>
      <div className="mt-8">
        <PostEditor />
      </div>
    </div>
  );
}

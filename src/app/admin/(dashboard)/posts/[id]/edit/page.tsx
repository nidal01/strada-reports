import { notFound } from "next/navigation";
import { getPostById } from "@/features/blog/posts";
import { PostEditor } from "@/features/blog/admin/post-editor";

type Params = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: Params) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-white">Yazıyı Düzenle</h1>
      <p className="mt-1 text-sm text-slate-400">{post.title}</p>
      <div className="mt-8">
        <PostEditor post={post} />
      </div>
    </div>
  );
}

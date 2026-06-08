import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicById } from "@/features/blog/topics";
import { TopicEditor } from "@/features/blog/admin/topic-editor";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export default async function EditTopicPage({ params }: Params) {
  const { id } = await params;
  let topic = null;
  try {
    topic = await getTopicById(id);
  } catch {
    notFound();
  }
  if (!topic) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center gap-3">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/topics">← Konular</Link>
        </Button>
        <h1 className="text-xl font-semibold text-white">Konu Düzenle</h1>
      </div>
      <TopicEditor topic={topic} />
    </div>
  );
}

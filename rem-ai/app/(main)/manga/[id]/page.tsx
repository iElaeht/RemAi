import { getMangaById } from "@/lib/mangadex";
import { notFound } from "next/navigation";
import MangaView from "@/components/manga/MangaView";
import Comments from "@/components/manga/comments/Comments";
import { supabasePublic } from "@/lib/supabase";
import { Comment } from "@/types/comment";

export default async function MangaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [manga, commentsResponse] = await Promise.all([
    getMangaById(id),
    supabasePublic
      .from("comments")
      .select("*")
      .eq("manga_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (!manga) notFound();

  const initialComments: Comment[] = commentsResponse.data || [];

  return (
    <main className="min-h-screen bg-[#0b1120] flex flex-col gap-12 pb-20 animate-in fade-in duration-500">
      
      {/* Sección Manga - Se mantiene igual */}
      <MangaView manga={manga} />

      {/* Sección Comentarios - Aquí aplicamos la nueva "carta" */}
      <section className="px-6 lg:px-32">
        <div className="max-w-5xl mx-auto">
            <Comments mangaId={id} initialComments={initialComments} />
        </div>
      </section>
    </main>
  );
}
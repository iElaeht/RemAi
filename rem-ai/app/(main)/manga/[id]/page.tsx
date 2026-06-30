import { getMangaById } from "@/lib/mangadex";
import { notFound } from "next/navigation";
import MangaView from "@/components/manga/MangaView";
import Comments from "@/components/manga/comments/Comments";
import { supabasePublic } from "@/lib/supabase";
import { Comment } from "@/types/comment";
import PageWrapper from "@/components/layout/PageWrapper";

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
    // Usamos PageWrapper para manejar el fondo, el padding y el contenedor central
    <PageWrapper>
      <div className="flex flex-col gap-12 animate-in fade-in duration-500">
        {/* Sección Manga */}
        <MangaView manga={manga} />

        {/* Sección Comentarios */}
        <section>
          <Comments mangaId={id} initialComments={initialComments} />
        </section>
      </div>
    </PageWrapper>
  );
}

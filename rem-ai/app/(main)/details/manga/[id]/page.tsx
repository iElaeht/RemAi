import { getMangaById, getSimilarMangas } from "@/lib/mangadex";
import { notFound } from "next/navigation";
import MangaView from "@/components/manga/MangaView";
import Comments from "@/components/manga/comments/Comments";
import SimilarMangas from "@/components/manga/similar/SimilarMangas";
import { supabasePublic } from "@/lib/supabase";
import { Comment } from "@/types/comment";
import { auth } from "@clerk/nextjs/server";
import { checkIsFavorite } from "@/actions/Favorites";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const manga = await getMangaById(resolvedParams.id);
  
  return {
    title: manga ? `${manga.title} | Mangas Rem` : "Manga | Mangas Rem",
    robots: {
      index: true,
      follow: true,
      nocache: false, 
    },
  };
}

export default async function MangaPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // 1. Obtenemos el usuario de Clerk y validamos si es favorito de manera eficiente
  const { userId } = await auth();

  // 2. Obtenemos el manga y el estado de favorito en paralelo
  const [manga, isFavorite] = await Promise.all([
    getMangaById(id),
    userId ? checkIsFavorite(userId, id) : Promise.resolve(false),
  ]);

  if (!manga) notFound();

  // 3. Ejecutamos comentarios y búsqueda de similares en paralelo
  const [commentsResponse, similarMangas] = await Promise.all([
    supabasePublic
      .from("comments")
      .select("*")
      .eq("manga_id", id)
      .order("created_at", { ascending: true }),
    getSimilarMangas(id, manga.tags || [], "manga"),
  ]);

  const initialComments: Comment[] = commentsResponse.data || [];
  
  return (
    <main className="bg-[#0b1120] min-h-screen text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12 animate-in fade-in duration-500">
        
        {/* Sección Manga (Con los props de favoritos inyectados) */}
        <MangaView 
          manga={manga} 
          userId={userId} 
          initialIsFavorite={isFavorite} 
        />

        {/* Sección Mangas Similares */}
        {similarMangas.length > 0 && (
          <section>
            <SimilarMangas mangas={similarMangas} contentType="manga" />
          </section>
        )}

        {/* Sección Comentarios */}
        <section>
          <Comments mangaId={id} initialComments={initialComments} />
        </section>
        
      </div>
    </main>
  );
}
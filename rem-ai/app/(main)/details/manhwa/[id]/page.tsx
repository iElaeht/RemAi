// rem-ai/app/(main)/details/manhwa/[id]/page.tsx
import { getMangaById, getSimilarMangas } from "@/lib/mangadex";
import { notFound } from "next/navigation";
import MangaView from "@/components/manga/MangaView";
import Comments from "@/components/manga/comments/Comments";
import SimilarMangas from "@/components/manga/similar/SimilarMangas";
import { supabasePublic } from "@/lib/supabase";
import { Comment } from "@/types/comment";
import { auth } from "@clerk/nextjs/server";
import { checkIsFavorite } from "@/actions/Favorites";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const manga = await getMangaById(id);
  
  return {
    title: manga ? `${manga.title} | MangasRem` : "Manhwa | MangasRem",
    robots: {
      index: true,
      follow: true,
      nocache: false, 
    },
  };
}

export default async function ManhwaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 1. Obtenemos el usuario autenticado
  const { userId } = await auth();

  // 2. Obtenemos el manhwa para tener sus tags y pasarle a la función de similares
  const manga = await getMangaById(id);
  if (!manga) notFound();

  // 3. Ejecutamos comentarios, búsqueda de similares y verificación de favoritos en paralelo
  const [commentsResponse, similarMangas, initialIsFavorite] = await Promise.all([
    supabasePublic
      .from("comments")
      .select("*")
      .eq("manga_id", id)
      .order("created_at", { ascending: true }),
    getSimilarMangas(id, manga.tags || [], "manhwa"),
    userId ? checkIsFavorite(userId, id) : Promise.resolve(false), // Verificamos si es favorito solo si hay usuario
  ]);

  const initialComments: Comment[] = commentsResponse.data || [];
  
  return (
    <main className="bg-[#0b1120] min-h-screen text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12 animate-in fade-in duration-500">
        
        {/* Sección Manga/Manhwa: Pasamos el userId e initialIsFavorite */}
        <MangaView 
          manga={manga} 
          userId={userId} 
          initialIsFavorite={initialIsFavorite} 
        />

        {/* Sección Similares */}
        {similarMangas.length > 0 && (
          <section>
            <SimilarMangas mangas={similarMangas} contentType="manhwa" />
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
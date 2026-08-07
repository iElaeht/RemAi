// components/manga/similar/SimilarMangas.tsx
import MangaSimilarCard from "./MangaSimilarCard";
import { MangaResponse } from "@/types/mangadex";

interface SimilarMangasProps {
  mangas: MangaResponse[];
  contentType?: string;
}

export default function SimilarMangas({ mangas, contentType = "manga" }: SimilarMangasProps) {
  if (!mangas || mangas.length === 0) return null;

  return (
    <section className="flex flex-col gap-6 py-4">
      {/* Título con diseño decorativo */}
      <div className="flex items-center gap-3 px-2">
        <div className="w-1.5 h-6 bg-pink-600 rounded-full" />
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Recomendados
        </h2>
      </div>
      
      {/* Carrusel con máscara de desvanecimiento */}
      <div className="flex gap-4 overflow-x-auto pb-6 px-2 hide-scroll-auto">
        {mangas.map((manga) => (
          <MangaSimilarCard 
            key={manga.id} 
            manga={manga} 
            currentType={contentType} // Inyectamos el contexto exacto a la tarjeta
          />
        ))}
      </div>
    </section>
  );
}
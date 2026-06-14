'use client';
import Image from 'next/image';

interface Manga {
  id: string;
  title: string;
  cover: string;
  genres: string[];
}

interface MangaGridProps {
  mangas: Manga[];
  isLoading: boolean;
}

export default function MangaGrid({ mangas, isLoading }: MangaGridProps) {
  return (
    /* Grid responsivo: 2 columnas en móvil, 4 en tablet, 6 en escritorio */
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 mb-16">
      {isLoading ? (
        /* Estado de carga: esqueleto visual animado */
        [...Array(12)].map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-[#111827] rounded-xl animate-pulse" />
        ))
      ) : (
        mangas.map((manga) => (
          <div key={manga.id} className="group flex flex-col gap-2">
            {/* Imagen con efecto hover y relación de aspecto fija para evitar deformaciones */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#111827] border border-white/5 transition-all hover:border-pink-500/50">
              <Image 
                src={manga.cover} 
                alt={manga.title} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            </div>

            <div className="flex flex-col px-1">
              <h3 className="text-[13px] font-bold truncate text-white" title={manga.title}>
                {manga.title}
              </h3>
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider truncate">
                {manga.genres?.length > 0 ? manga.genres.slice(0, 2).join(' • ') : 'Sin género'}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
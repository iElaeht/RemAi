'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Bookmark } from 'lucide-react';

interface Manga {
  id: string;
  title: string;
  cover: string;
  genres: string[];
  author?: string;
  rating?: string;
}

interface MangaGridProps {
  mangas: Manga[];
  isLoading: boolean;
}

const truncate = (text: string, limit: number) => 
  text.length > limit ? text.substring(0, limit) + "..." : text;

export default function MangaGrid({ mangas, isLoading }: MangaGridProps) {
  const basePath = '/details/manga';
  
  // Estado para rastrear qué imágenes fallaron al cargar y mostrar el placeholder
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    /* Ajustado el grid para pantallas grandes: ahora muestra hasta 7 u 8 columnas para que las cartas sean más compactas */
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4 mb-16">
      {isLoading ? (
        [...Array(24)].map((_, i) => (
          <div key={i} className="aspect-[3/4] bg-[#0e1422] rounded-xl animate-pulse" />
        ))
      ) : (
        mangas.map((manga) => {
          const hasError = imageErrors[manga.id];
          const coverSource = !hasError && manga.cover ? manga.cover : "/images/NoImage/placeholder-manga.jpg";

          return (
            <Link 
              key={manga.id} 
              href={`${basePath}/${manga.id}`}
              prefetch={false}
              className="group relative flex flex-col gap-1.5 p-2 rounded-xl bg-[#0e1422] border border-white/5 hover:border-pink-500/40 hover:bg-[#131b2e] transition-all duration-300 shadow-lg select-none"
            >
              {/* Contenedor de Imagen con Fallback */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900">
                <Image 
                  src={coverSource} 
                  alt={manga.title} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 12vw"
                  className="object-cover transition-opacity duration-300 group-hover:opacity-90" 
                  onError={() => handleImageError(manga.id)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity" />
              </div>

              {/* Detalles del Manga (Compactos) */}
              <div className="flex flex-col px-0.5 gap-1">
                <h3 className="text-xs font-bold text-gray-200 group-hover:text-pink-400 transition-colors line-clamp-1" title={manga.title}>
                  {truncate(manga.title, 20)}
                </h3>
                
                <div className="flex items-center justify-between text-[10px] text-neutral-400 group-hover:text-gray-300 transition-colors">
                  <span className="truncate max-w-[65px]">{truncate(manga.author || 'Desconocido', 10)}</span>
                  <span className="flex items-center gap-0.5 text-yellow-500/90 font-medium">
                    <Star size={9} fill="currentColor" /> {manga.rating || '0.0'}
                  </span>
                </div>

                {/* Géneros / Tags */}
                <div className="flex items-center gap-1 text-[9px] text-neutral-500 group-hover:text-neutral-400 transition-colors">
                  <Bookmark size={11} className="text-neutral-600 group-hover:text-pink-400 transition-colors shrink-0" />
                  <span className="truncate">
                    {manga.genres?.slice(0, 2).join(' • ') || 'Sin géneros'}
                  </span>
                </div>
              </div>
            </Link>
          );
        })
      )}
    </div>
  );
}
// components/library/ManhwaGrid.tsx
'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Star, Bookmark } from 'lucide-react';
import { getImageUrl } from '@/utils/image';

interface Manhwa {
  id: string;
  title: string;
  cover: string;
  genres: string[];
  author?: string;
  rating?: string;
}

interface ManhwaGridProps {
  manhwas: Manhwa[];
  isLoading: boolean;
}

const truncate = (text: string, limit: number) => 
  text.length > limit ? text.substring(0, limit) + "..." : text;

export default function ManhwaGrid({ manhwas, isLoading }: ManhwaGridProps) {
  const basePath = '/details/manhwa';
  
  // Estado para rastrear qué imágenes fallaron al cargar de la API
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3 sm:gap-4 mb-16">
      {isLoading ? (
        /* SKELETON LOADER PROFESIONAL PARA MANHWAS */
        [...Array(16)].map((_, i) => (
          <div 
            key={i} 
            className="flex flex-col gap-1.5 p-2 rounded-xl bg-[#170a0d] border border-white/5 animate-pulse select-none"
          >
            {/* Esqueleto de Imagen / Cover */}
            <div className="aspect-[3/4] rounded-lg bg-white/5 w-full" />

            {/* Esqueleto de Información */}
            <div className="flex flex-col px-0.5 gap-2 mt-1">
              {/* Título */}
              <div className="h-3.5 bg-white/10 rounded-md w-4/5" />
              
              {/* Autor y Rating */}
              <div className="flex items-center justify-between">
                <div className="h-2.5 bg-white/5 rounded-md w-1/2" />
                <div className="h-2.5 bg-yellow-500/10 rounded-md w-1/4" />
              </div>

              {/* Géneros */}
              <div className="h-2.5 bg-white/5 rounded-md w-3/4 mt-0.5" />
            </div>
          </div>
        ))
      ) : (
        manhwas.map((manhwa) => {
          const hasError = imageErrors[manhwa.id];
          const rawCover = !hasError && manhwa.cover ? manhwa.cover : "";
          const coverSource = getImageUrl(rawCover);

          return (
            <Link 
              key={manhwa.id} 
              href={`${basePath}/${manhwa.id}`}
              prefetch={false}
              className="group relative flex flex-col gap-1.5 p-2 rounded-xl bg-[#170a0d] border border-white/5 hover:border-red-500/40 hover:bg-[#200d11] transition-all duration-300 shadow-lg select-none"
            >
              {/* Contenedor de Imagen con <img> nativo */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-neutral-900">
                {coverSource ? (
                  <img 
                    src={coverSource} 
                    alt={manhwa.title} 
                    className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90"
                    onError={() => handleImageError(manhwa.id)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-neutral-500 text-center p-2">
                    Sin imagen
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-30 group-hover:opacity-10 transition-opacity pointer-events-none" />
              </div>

              {/* Detalles del Manhwa */}
              <div className="flex flex-col px-0.5 gap-1">
                <h3 className="text-xs font-bold text-gray-200 group-hover:text-red-400 transition-colors line-clamp-1" title={manhwa.title}>
                  {truncate(manhwa.title, 20)}
                </h3>
                
                <div className="flex items-center justify-between text-[10px] text-neutral-400 group-hover:text-gray-300 transition-colors">
                  <span className="truncate max-w-[65px]">{truncate(manhwa.author || 'Desconocido', 10)}</span>
                  <span className="flex items-center gap-0.5 text-yellow-500/90 font-medium">
                    <Star size={9} fill="currentColor" /> {manhwa.rating || '0.0'}
                  </span>
                </div>

                {/* Géneros / Tags */}
                <div className="flex items-center gap-1 text-[9px] text-neutral-500 group-hover:text-neutral-400 transition-colors">
                  <Bookmark size={11} className="text-neutral-600 group-hover:text-red-400 transition-colors shrink-0" />
                  <span className="truncate">
                    {manhwa.genres?.slice(0, 2).join(' • ') || 'Sin géneros'}
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
'use client';

import { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { MangaResponse } from "@/types/mangadex";
import { detectContentType } from "@/utils/mangaTypeDetector";

interface MangaSimilarCardProps {
  manga: MangaResponse;
  currentType?: string;
}

export default function MangaSimilarCard({ manga, currentType }: MangaSimilarCardProps) {
  const contentType = currentType || detectContentType(manga);
  const [hasError, setHasError] = useState(false);

  return (
    <Link 
      href={`/details/${contentType}/${manga.id}`}
      prefetch={false}
      className="group relative flex flex-col w-36 sm:w-40 md:w-44 flex-shrink-0"
      title={manga.title}
    >
      {/* Contenedor Principal tipo Poster con Borde y Sombra Azul */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-900 border border-white/10 shadow-lg group-hover:border-blue-500 group-hover:shadow-[0_8px_25px_-4px_rgba(59,130,246,0.4)] transition-all duration-300">
        
        {/* Imagen de Portada con Next/Image */}
        {!hasError && manga.coverUrl ? (
          <Image
            src={manga.coverUrl}
            alt={manga.title}
            fill
            unoptimized
            className="w-full h-full object-cover transition-opacity duration-300"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-neutral-500 text-center p-2">
            Sin imagen
          </div>
        )}

        {/* Degradado superior para el Rating */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/60 via-black/20 to-transparent opacity-80 pointer-events-none" />

        {/* Badge de Rating */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/15 shadow-sm">
          <span className="text-yellow-400 text-[10px]">★</span>
          <span className="text-white text-[11px] font-bold tracking-wide">{manga.rating.toFixed(1)}</span>
        </div>

        {/* 
          Título dinámico: 
          - En móvil: Siempre visible con su degradado inferior.
          - En PC (sm:): Oculto por defecto, y aparece elegantemente de abajo hacia arriba al pasar el mouse (group-hover).
        */}
        <div className="absolute inset-x-0 bottom-0 pt-12 pb-3 px-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent flex flex-col justify-end transition-all duration-300 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-200 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200 leading-tight">
            {manga.title}
          </h3>
        </div>

      </div>
    </Link>
  );
}
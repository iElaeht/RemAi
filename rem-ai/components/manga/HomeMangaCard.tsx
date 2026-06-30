"use client";
import Image from 'next/image';
import { MangaResponse } from '@/types/mangadex';
import { Star, User, Clock } from 'lucide-react';

interface HomeMangaCardProps {
  manga: MangaResponse;
}

export default function HomeMangaCard({ manga }: HomeMangaCardProps) {
  const statusLabel = manga.status === "completed" ? "Finalizado" : "En Emisión";

  return (
    <div 
      className="group relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 transition-all duration-300 select-none cursor-pointer"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Image
        src={manga.coverUrl}
        alt={manga.title}
        fill
        sizes="(max-width: 640px) 150px, 200px"
        draggable={false}
        className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
      
      {/* Contenedor de información con ajuste responsivo */}
      <div className="absolute bottom-3 left-3 right-3 pointer-events-none space-y-0.5 md:space-y-1">
        {/* Título: truncado para no romper el diseño en pantallas pequeñas */}
        <p className="text-xs md:text-sm font-bold text-white truncate drop-shadow-md">
          {manga.title}
        </p>
        
        {/* Autor: oculto en pantallas muy pequeñas para ganar espacio */}
        <p className="hidden sm:flex text-[9px] md:text-[10px] text-neutral-300 items-center gap-1">
          <User size={9} /> {manga.author || "Autor Desconocido"}
        </p>

        {/* Estado y Rating */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[8px] md:text-[9px] font-bold uppercase bg-neutral-800/90 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
            <Clock size={8} /> {statusLabel}
          </span>
          {manga.rating && (
            <span className="text-[8px] md:text-[9px] font-bold text-yellow-400 flex items-center gap-1">
              <Star size={8} fill="currentColor" /> {manga.rating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
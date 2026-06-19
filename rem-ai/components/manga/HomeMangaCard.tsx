"use client"; // Importante para manejar eventos de mouse
import Image from 'next/image';
import { MangaResponse } from '@/types/mangadex';

interface HomeMangaCardProps {
  manga: MangaResponse;
}

export default function HomeMangaCard({ manga }: HomeMangaCardProps) {
  return (
    <div 
      className="group relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 transition-all duration-300 select-none cursor-pointer"
      onContextMenu={(e) => e.preventDefault()} // Bloquea menú de clic derecho
    >
      {/* Imagen con bloqueo de arrastre y eventos de puntero */}
      <Image
        src={manga.coverUrl}
        alt={manga.title}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 20vw, 16vw"
        draggable={false} // Evita que se pueda arrastrar
        className="object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none"
      />
      
      {/* Degradado inferior */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Información básica */}
      <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
        <p className="text-sm font-bold text-white truncate drop-shadow-md">{manga.title}</p>
        <p className="text-[10px] text-sky-400 font-medium">Actualizado</p>
      </div>
    </div>
  );
}
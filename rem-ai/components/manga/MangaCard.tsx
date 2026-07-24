import React, { useState } from 'react';
import Link from 'next/link';
import { Star, User } from 'lucide-react';

interface MangaCardProps {
  id: string;
  title: string;
  coverUrl: string;
  author?: string;
  tags?: string[];
  rating?: number;
}

export default function MangaCard({ id, title, coverUrl, author, tags, rating }: MangaCardProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <Link 
      href={`/details/manga/${id}`}
      prefetch={false}
      className="block w-full space-y-3 group cursor-pointer"
    >
      {/* Contenedor Imagen */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-900 ring-1 ring-white/10">
        {!hasError ? (
          <img
            src={coverUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-[10px] text-neutral-500 text-center p-2">
            Sin imagen
          </div>
        )}
        {/* Degradado inferior sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Detalles del Manga */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1">
            <User size={10} />
            <span className="truncate max-w-[80px]">{author || 'Desconocido'}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-500 font-medium">
            <Star size={10} fill="currentColor" />
            {rating ? rating.toFixed(1) : 'N/A'}
          </div>
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <p className="text-[10px] text-neutral-500 line-clamp-1">
            {tags.slice(0, 2).join(' • ')}
          </p>
        )}
      </div>
    </Link>
  );
}
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, User } from 'lucide-react';

interface MangaCardProps {
  id: string;
  title: string;
  coverUrl: string;
  author?: string;
  status?: string; 
  tags?: string[];
  rating?: number; // Asegúrate de recibir esto
}

export default function MangaCard({ id, title, coverUrl, author, status, tags, rating }: MangaCardProps) {
  return (
    <Link 
      href={`/manga/${id}`}
      className="group block w-full space-y-3"
    >
      {/* Contenedor Imagen: Diseño moderno con borde fino */}
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-900 ring-1 ring-white/10 transition-all duration-300 group-hover:ring-white/30">
        <Image
          src={coverUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Degradado inferior para resaltar texto en caso de necesidad */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
      </div>

      {/* Detalles del Manga */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-neutral-300 transition-colors">
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
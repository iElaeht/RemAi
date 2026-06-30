'use client';
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

// Helpers para truncar
const truncate = (text: string, limit: number) => 
  text.length > limit ? text.substring(0, limit) + "..." : text;

export default function MangaGrid({ mangas, isLoading }: MangaGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
      {isLoading ? (
        [...Array(12)].map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-[#111827] rounded-xl animate-pulse" />
        ))
      ) : (
        mangas.map((manga) => (
          <div key={manga.id} className="group relative flex flex-col gap-3 select-none">
            
            {/* IMAGEN CON LINK */}
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-[#111827] border border-white/5 transition-all duration-300 group-hover:border-pink-500/50 shadow-lg">
              <Link href={`/manga/${manga.id}`}>
                <Image 
                  src={manga.cover} 
                  alt={manga.title} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </Link>
            </div>

            {/* INFO */}
            <div className="flex flex-col px-1 gap-1">
              <Link href={`/manga/${manga.id}`}>
                <h3 className="text-[13px] font-bold text-white hover:text-pink-500 transition-colors" title={manga.title}>
                  {truncate(manga.title, 20)}
                </h3>
              </Link>
              
              <div className="flex items-center gap-2 text-[10px] text-neutral-500 uppercase tracking-widest">
                <span className="truncate max-w-[80px]">{truncate(manga.author || 'Desconocido', 12)}</span>
                <span className="flex items-center gap-0.5 text-yellow-500">
                  <Star size={10} fill="currentColor" /> {manga.rating || '0.0'}
                </span>
              </div>

              {/* TAGS CON BOOKMARK */}
              <div className="flex items-center gap-1 mt-1 text-[10px] text-neutral-400 selection-none">
                <Bookmark size={10} />
                <span className="truncate ">
                  {manga.genres?.slice(0, 3).join(' • ') || 'Sin géneros'}
                  {manga.genres?.length > 3 && "..."}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
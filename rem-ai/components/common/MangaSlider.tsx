// components/manga/MangaSlider.tsx
'use client';
import React, { useCallback, useMemo, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MangaCard from '@/components/manga/MangaCard';
import { MangaResponse } from '@/types/mangadex';

interface Props { 
  title: string; 
  mangas: MangaResponse[]; 
}

export default function MangaSlider({ title, mangas }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps' 
  });

  const [isHovered, setIsHovered] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const displayMangas = useMemo(() => {
    if (mangas.length === 0) return [];
    return mangas.length < 6 ? [...mangas, ...mangas] : mangas;
  }, [mangas]);

  return (
    <section 
      className="py-8 relative select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Encabezado limpio */}
      <div className="flex items-center justify-between px-6 md:px-24 mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="w-1 h-8 bg-white rounded-full" /> {title}
        </h2>
      </div>

      <div className="relative mx-6 md:mx-24">
        {/* Botón Prev (Controlado por estado local para evitar efecto en cascada) */}
        <button 
          onClick={scrollPrev} 
          className={`absolute -left-12 top-1/3 p-2 bg-neutral-900/80 backdrop-blur-sm text-white rounded-full transition-all z-10 hidden md:block hover:bg-neutral-800 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronLeft size={24} />
        </button>
        
        {/* Lista de Mangas */}
        <div className="overflow-hidden touch-pan-x" ref={emblaRef}>
          <div className="flex -ml-4"> 
            {displayMangas.map((manga, index) => (
              <div 
                key={`${manga.id}-${index}`} 
                className="flex-[0_0_140px] md:flex-[0_0_200px] min-w-0 pl-4"
              >
                <MangaCard {...manga} />
              </div>
            ))}
          </div>
        </div>

        {/* Botón Next */}
        <button 
          onClick={scrollNext} 
          className={`absolute -right-12 top-1/3 p-2 bg-neutral-900/80 backdrop-blur-sm text-white rounded-full transition-all z-10 hidden md:block hover:bg-neutral-800 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MangaCard from '@/components/MangaCard';
import { MangaResponse } from '@/types/mangadex';
import { useCallback } from 'react';

interface Props { title: string; mangas: MangaResponse[]; }

export default function MangaSlider({ title, mangas }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start'
  });

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  return (
    <section className="py-8 relative group">
      <div className="flex items-center justify-between px-6 md:px-24 mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <div className="w-1 h-8 bg-red-500 rounded-full" /> {title}
        </h2>
        <button className="text-sm text-neutral-400 hover:text-white border border-neutral-700 px-4 py-1.5 rounded-full transition hover:bg-neutral-800">
          Mostrar Más
        </button>
      </div>

      <div className="relative mx-6 md:mx-24">
        <button 
          onClick={scrollPrev} 
          className="absolute -left-12 top-1/2 -translate-y-1/2 p-2 bg-neutral-900/80 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition z-10 hidden md:block"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="overflow-hidden" ref={emblaRef}>
          {/* 1. Eliminamos el 'gap-4' del padre */}
          {/* 2. Añadimos un margen negativo al padre para compensar el padding de los hijos */}
          <div className="flex -ml-4"> 
            {mangas.map((manga) => (
              /* 3. Aplicamos el espaciado como 'pl-4' (padding-left) en cada hijo */
              <div key={manga.id} className="flex-[0_0_200px] min-w-0 pl-4"> 
                <MangaCard {...manga} />
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={scrollNext} 
          className="absolute -right-12 top-1/2 -translate-y-1/2 p-2 bg-neutral-900/80 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition z-10 hidden md:block"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
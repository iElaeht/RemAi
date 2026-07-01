'use client';
import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import MangaCard from '@/components/manga/MangaCard';
import { MangaResponse } from '@/types/mangadex';

interface Props { 
  title: string; 
  mangas: MangaResponse[]; 
}

export default function HomeSlider({ title, mangas }: Props) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, dragFree: true, containScroll: 'trimSnaps' },
    [AutoScroll({ playOnInit: true, stopOnInteraction: false, speed: 0.8 })]
  );

  return (
    <section className="py-8 relative select-none">
      {/* Título alineado con el padding global */}
      <div className="flex items-center justify-between px-6 md:px-24 mb-6">
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-3">
          <div className="w-1 h-8 bg-sky-400 rounded-full" /> {title}
        </h2>
      </div>

      {/* Contenedor del carrusel con margen negativo para compensar el pl-4 de los hijos */}
      <div className="overflow-hidden px-6 md:px-24" ref={emblaRef}>
        <div className="flex -ml-4"> 
          {mangas.map((manga, index) => (
            <div 
              key={`${manga.id}-${index}`} 
              className="flex-[0_0_150px] md:flex-[0_0_210px] min-w-0 pl-4"
            >
              <MangaCard {...manga} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
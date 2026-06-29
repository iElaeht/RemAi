'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mangadexLoader from '@/utils/imageLoader';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, BookOpen, Star, Layers } from 'lucide-react';
import Link from 'next/link';
import { MangaResponse } from '@/types/mangadex';

export default function HeroCarousel({ featuredMangas }: { featuredMangas: MangaResponse[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev === featuredMangas.length - 1 ? 0 : prev + 1));
    }, 7000);
  }, [featuredMangas.length]);

  const changeSlide = useCallback((newIndex: number) => {
    setActiveIndex(newIndex);
    resetInterval();
  }, [resetInterval]);

  useEffect(() => {
    resetInterval();
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [resetInterval]);

  if (!featuredMangas || featuredMangas.length === 0) return null;

  return (
    <section className="relative h-[80vh] md:h-[70vh] w-full mb-8 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div 
          key={featuredMangas[activeIndex].id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-950"
        >
          {/* Fondo con blur */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm scale-105"
            style={{ backgroundImage: `url('${featuredMangas[activeIndex].coverUrl}')` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />
          
          {/* Contenido principal: Flex-col en móvil, Flex-row en md */}
          <div className="relative h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-24 gap-6 md:gap-12">
            <div className="w-32 md:w-[250px] aspect-[2/3] shadow-2xl rounded-lg overflow-hidden border border-white/10 shrink-0">
              <Image
              loader={mangadexLoader}
              width={300}
              height={450}
              src={featuredMangas[activeIndex].coverUrl} 
              className="w-full h-full object-cover" 
              alt={featuredMangas[activeIndex].title}
              unoptimized
              />
            </div>
            
            <div className="flex flex-col text-center md:text-left max-w-xl">
              <h1 className="text-3xl md:text-6xl font-black mb-2 tracking-tight line-clamp-2">
                {featuredMangas[activeIndex].title}
              </h1>
              <p className="text-sky-400 mb-4 italic text-sm md:text-lg">{featuredMangas[activeIndex].author}</p>
              <p className="text-neutral-400 text-sm md:text-lg mb-6 line-clamp-3 hidden md:block">
                {featuredMangas[activeIndex].description || "Sin descripción."}
              </p>
              
              <Link href={`/manga/${featuredMangas[activeIndex].id}`} className="mx-auto md:mx-0 w-fit px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition text-sm md:text-base">
                Leer ahora
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controles de navegación siempre visibles para mejor UX móvil */}
      <button onClick={() => changeSlide(activeIndex === 0 ? featuredMangas.length - 1 : activeIndex - 1)} className="absolute left-2 md:left-4 top-1/2 p-1 md:p-2 bg-black/40 text-white rounded-full z-20">
        <ChevronLeft size={24} />
      </button>
      <button onClick={() => changeSlide(activeIndex === featuredMangas.length - 1 ? 0 : activeIndex + 1)} className="absolute right-2 md:right-4 top-1/2 p-1 md:p-2 bg-black/40 text-white rounded-full z-20">
        <ChevronRight size={24} />
      </button>

      {/* Indicadores en la parte inferior */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {featuredMangas.map((_, i) => (
          <button key={i} onClick={() => changeSlide(i)} className="h-1 w-8 md:w-12 bg-white/20 rounded-full overflow-hidden">
            {activeIndex === i && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 7, ease: "linear" }} className="h-full bg-white" />}
          </button>
        ))}
      </div>
    </section>
  );
}
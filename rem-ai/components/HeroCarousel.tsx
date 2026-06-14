"use client";
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const getStatusLabel = (status?: string) => {
    const labels: Record<string, string> = {
      ongoing: 'En emisión',
      completed: 'Finalizado',
      hiatus: 'En pausa',
    };
    return labels[status || ''] || status || 'En curso';
  };

  // Si no hay mangas, no renderizamos nada
  if (!featuredMangas || featuredMangas.length === 0) return null;

  return (
    <section className="relative h-[70vh] w-full mb-12 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div 
          key={featuredMangas[activeIndex].id}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-neutral-950"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-105"
            style={{ backgroundImage: `url('${featuredMangas[activeIndex].coverUrl}')` }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/70 to-transparent" />
          
          <div className="absolute inset-0 flex items-center px-24 gap-12">
            <div className="w-[300px] h-[450px] shadow-2xl rounded-xl overflow-hidden shrink-0 border border-white/10">
              <img src={featuredMangas[activeIndex].coverUrl} className="w-full h-full object-cover" alt={featuredMangas[activeIndex].title} />
            </div>
            
            <div className="flex flex-col justify-center max-w-2xl">
              <h1 className="text-6xl font-black mb-1 tracking-tight">
                {featuredMangas[activeIndex].title}
              </h1>
              
              <p className="text-lg font-medium text-sky-400/90 mb-4 italic tracking-wide">
                {featuredMangas[activeIndex].author}
              </p>

              <p className="text-neutral-400 text-lg mb-6 line-clamp-3">
                {featuredMangas[activeIndex].description || "Sin descripción disponible."}
              </p>
              
              <div className="flex items-center gap-6 text-neutral-400 mb-8">
                <div className="flex items-center gap-2">
                  <BookOpen size={18} /> <span>{getStatusLabel(featuredMangas[activeIndex].status)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers size={18} /> <span>{featuredMangas[activeIndex].tags?.slice(0, 2).join(', ') || 'Manga'}</span>
                </div>
                <div className="flex items-center gap-2 text-amber-500">
                  <Star size={18} /> <span>Recomendado</span>
                </div>
              </div>

              <Link href={`/manga/${featuredMangas[activeIndex].id}`} className="w-fit px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-neutral-200 transition">
                Leer ahora
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button onClick={() => changeSlide(activeIndex === 0 ? featuredMangas.length - 1 : activeIndex - 1)} className="absolute left-4 top-1/2 p-2 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition rounded-full z-10">
        <ChevronLeft size={32} />
      </button>
      <button onClick={() => changeSlide(activeIndex === featuredMangas.length - 1 ? 0 : activeIndex + 1)} className="absolute right-4 top-1/2 p-2 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition rounded-full z-10">
        <ChevronRight size={32} />
      </button>

      <div className="absolute bottom-8 left-24 flex gap-2 z-10">
        {featuredMangas.map((_, i) => (
          <button key={i} onClick={() => changeSlide(i)} className="h-1 w-12 bg-white/20 rounded-full overflow-hidden">
            {activeIndex === i && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 7, ease: "linear" }} className="h-full bg-white" />}
          </button>
        ))}
      </div>
    </section>
  );
}
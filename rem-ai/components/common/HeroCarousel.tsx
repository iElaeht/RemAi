"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, User, Clock } from "lucide-react";
import Link from "next/link";
import { MangaResponse } from "@/types/mangadex";

export default function HeroCarousel({ featuredMangas }: { featuredMangas: MangaResponse[]; }) {
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
  const current = featuredMangas[activeIndex];

  return (
    // Reducimos altura ligeramente en mobile (h-[80vh]) para mejor encaje
    <section className="relative h-[80vh] md:h-[85vh] w-full overflow-hidden bg-neutral-950 select-none">
      <AnimatePresence mode="wait">
        <motion.div key={current.id} className="absolute inset-0">
          <div className="absolute inset-0 z-0">
            <Image src={current.coverUrl} alt="Background" fill className="object-cover transition-all duration-700" priority sizes="100vw"/>
            <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-3xl" />
          </div>

          {/* Ajustamos padding y gap para mobile */}
          <div className="relative h-full flex flex-col items-center justify-center px-4 md:px-24 pt-12 md:pt-0 gap-4 md:flex-row md:gap-12 z-20">
            
            {/* Imagen del manga ajustada para no ocupar tanto espacio vertical */}
            <div className="w-32 md:w-72 aspect-[2/3] shrink-0 shadow-2xl rounded-lg overflow-hidden border border-white/10">
              <Image src={current.coverUrl} width={400} height={600} alt={current.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col max-w-xl w-full text-center md:text-left">
              {/* Tags ocultos en pantallas muy pequeñas si es necesario, o más compactos */}
              <div className="hidden md:flex gap-2 mb-4 justify-center md:justify-start">
                {current.tags?.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="px-2 py-1 bg-white/10 text-white text-[10px] uppercase rounded-sm">{tag}</span>
                ))}
              </div>

              <h1 className="text-2xl md:text-6xl font-black mb-2 md:mb-4 tracking-tight leading-tight line-clamp-2">
                {current.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-neutral-400 text-xs md:text-sm mb-4">
                <span className="flex items-center gap-1"><User size={12} /> {current.author}</span>
                <span className="flex items-center gap-1 text-yellow-500"><Star size={12} fill="currentColor" /> {current.rating?.toFixed(1)}</span>
                <span className="flex items-center gap-1 px-1.5 bg-neutral-800 rounded uppercase text-[9px]"><Clock size={10} /> {current.status}</span>
              </div>

              <p className="hidden md:block text-neutral-400 text-sm md:text-lg line-clamp-3 mb-6 leading-relaxed">
                {current.description}
              </p>

              <Link href={`/manga/${current.id}`} className="mx-auto md:mx-0 w-fit px-6 py-2.5 bg-white text-neutral-950 font-bold rounded-sm text-sm hover:bg-neutral-200 transition-all">
                Leer ahora
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Botones de navegación reposicionados para no tapar contenido */}
      <button onClick={() => changeSlide(activeIndex === 0 ? featuredMangas.length - 1 : activeIndex - 1)} className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-40 transition">
        <ChevronLeft size={20} />
      </button>
      <button onClick={() => changeSlide(activeIndex === featuredMangas.length - 1 ? 0 : activeIndex + 1)} className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1.5 md:p-2 bg-white/10 hover:bg-white/20 text-white rounded-full z-40 transition">
        <ChevronRight size={20} />
      </button>

      {/* Indicadores más pequeños en mobile */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-30">
        {featuredMangas.map((_, i) => (
          <button key={i} onClick={() => changeSlide(i)} className="h-1 w-6 md:w-16 bg-white/10 rounded-full overflow-hidden">
            {activeIndex === i && <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 7, ease: "linear" }} className="h-full bg-white" />}
          </button>
        ))}
      </div>
    </section>
  );
}
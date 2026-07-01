"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MangaResponse } from "@/types/mangadex";
import { getMainManga } from "@/lib/mangadex";
import Footer from "@/components/layout/Footer";
import { ArrowRight, BookOpen } from "lucide-react";
import HomeSlider from "@/components/common/HomeSlider"; 

export default function HomePage() {
  const [mangas, setMangas] = useState<MangaResponse[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    async function loadMangas() {
      const data = await getMainManga();
      setMangas(data);
    }
    loadMangas();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-x-hidden select-none">
      {/* Navbar - Se mantiene igual */}
      <motion.nav
        className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-24 h-16 md:h-20 transition-all duration-300"
        animate={{
          backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.8)" : "rgba(0, 0, 0, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        }}
      >
        <div className="text-24 md:text-3xl font-black text-white">
          Rem<span className="text-sky-400">Ai</span>
        </div>
        <Link
          href="/discover"
          className="flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs md:text-sm font-medium transition-all"
        >
          <BookOpen size={12} /> Explorar
        </Link>
      </motion.nav>

      {/* Hero Section - Se mantiene igual */}
      <header className="relative h-[70vh] md:h-[85vh] flex items-center px-6 md:px-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-black/20" />
        </div>

        <div className="relative z-10 space-y-4 max-w-2xl mt-16">
          <h1 className="text-5xl md:text-9xl font-extrabold tracking-tighter text-white leading-[0.9]">
            Mangas <br />
            <span className="text-neutral-500">Rem.</span>
          </h1>
          <p className="text-sm md:text-lg text-neutral-400 max-w-sm font-light tracking-wide">
            Explora una curaduría seleccionada de los mejores mangas. La elegancia de leer sin distracciones.
          </p>
          <Link
            href="/discover"
            className="inline-flex px-6 py-3 border border-neutral-700 hover:border-white text-white transition-all items-center gap-3"
          >
            <span className="text-xs md:text-sm font-medium uppercase tracking-widest">Comenzar</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Sección Carrusel - AHORA CON HOME SLIDER */}
      <section className="py-12 md:py-20 relative z-20">
        {mangas.length > 0 ? (
          <HomeSlider title="Tendencias ahora" mangas={mangas} />
        ) : (
          <div className="px-6 md:px-24">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Tendencias ahora</h2>
            <div className="flex gap-4 md:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-[150px] md:w-[200px] aspect-[2/3] bg-neutral-900 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
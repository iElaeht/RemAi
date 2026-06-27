'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MangaResponse } from "@/types/mangadex";
import { getMainManga } from "@/lib/mangadex";
import HomeMangaCard from "@/components/manga/HomeMangaCard";
import Footer from "@/components/layout/Footer";
import { ArrowRight, BookOpen } from "lucide-react"; // Añadimos iconos para darle dinamismo

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
      {/* <- Navbar Minimalista -> */}
      <motion.nav
        className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-24 h-20 transition-all duration-300"
        animate={{
            backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.8)" : "rgba(0, 0, 0, 0)",
            backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black text-white tracking-tight">
            Rem<span className="text-sky-400">Ai</span>
          </div>
        </div>

        {/* Botón directo a la biblioteca */}
        <Link
          href="/discover"
          className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-all"
        >
          <BookOpen size={14} />
          Explorar Biblioteca
        </Link>
      </motion.nav>

      {/* <- Hero Section -> */}
      <header className="relative h-[80vh] flex items-center px-6 md:px-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-black/40" />
        </div>

        <div className="relative z-10 space-y-8 max-w-2xl mt-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
            Mangas Rem, <br/> <span className="text-sky-400">sin límites</span>.
          </h1>
          <p className="text-xl text-neutral-400 max-w-lg">
            Buscas Mangas? Encontraras los mejores mangas de todos los tiempos.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/discover" 
              className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
            >
              Comenzar a leer <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* <- Sección Carrusel (Igual que antes pero limpio) -> */}
      <section className="py-20 -mt-10 relative z-20">
        <h2 className="px-6 md:px-24 text-2xl font-bold mb-10">
          Tendencias ahora
        </h2>

        <div className="relative flex overflow-hidden px-6 md:px-24">
          <motion.div
            className="flex gap-6"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {mangas.length > 0 &&
              [...mangas, ...mangas].map((manga, index) => (
                <div key={`${manga.id}-${index}`} className="w-[200px] shrink-0">
                  <HomeMangaCard manga={manga} />
                </div>
              ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
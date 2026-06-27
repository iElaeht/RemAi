"use client";
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
          backgroundColor: isScrolled
            ? "rgba(10, 10, 10, 0.8)"
            : "rgba(0, 0, 0, 0)",
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

      {/* <- Hero Section Minimalista -> */}
      <header className="relative h-[85vh] flex items-center px-6 md:px-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/90 to-black/20" />
        </div>

        <div className="relative z-10 space-y-6 max-w-2xl mt-20">
          <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white leading-[0.85]">
            Mangas <br />
            <span className="text-neutral-500">Rem.</span>
          </h1>

          <p className="text-lg text-neutral-400 max-w-md font-light tracking-wide">
            Explora, descubre y sumérgete en una curaduría seleccionada de los
            mejores mangas. La elegancia de leer sin distracciones.
          </p>

          <div className="flex pt-6">
            <Link
              href="/discover"
              className="group relative px-6 py-3 border border-neutral-700 hover:border-white text-white transition-all duration-300 flex items-center gap-3"
            >
              <span className="text-sm font-medium uppercase tracking-widest">
                Comenzar a leer
              </span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
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
                <div
                  key={`${manga.id}-${index}`}
                  className="w-[200px] shrink-0"
                >
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

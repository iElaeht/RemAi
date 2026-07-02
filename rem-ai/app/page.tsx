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

      {/* Nueva sección: Beneficios / Experiencia */}
      <section className="py-20 px-6 md:px-24 bg-neutral-900/30">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Lectura sin distracciones</h2>
          <p className="text-neutral-400 text-lg">
            Hemos diseñado RemAi para que te centres en lo que importa: la historia. Sin publicidad intrusiva, sin interfaces cargadas, solo tú y tu manga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Curaduría IA", desc: "Algoritmos que entienden tus gustos y te recomiendan joyas ocultas." },
            { title: "Interfaz Fluida", desc: "Navegación minimalista diseñada para dispositivos móviles y escritorio." },
            { title: "Acceso Instantáneo", desc: "Servidores optimizados para que cada página cargue en milisegundos." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="p-8 border border-neutral-800 bg-neutral-900/50 rounded-2xl hover:border-sky-500/50 transition-colors"
            >
              <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
              <p className="text-neutral-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
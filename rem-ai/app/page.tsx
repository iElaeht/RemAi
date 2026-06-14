'use client';
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MangaResponse } from "@/types/mangadex";
import { getMainManga } from "@/lib/mangadex";
import HomeMangaCard from "@/components/HomeMangaCard";
import Footer from "@/components/Footer"; 

export default function HomePage() {
  const [mangas, setMangas] = useState<MangaResponse[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Detectar scroll para navbar
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
      
      {/* <- Navbar -> */}
      <motion.nav 
        initial={{ backgroundColor: "rgba(0,0,0,0)" }}
        animate={{ 
          backgroundColor: isScrolled ? "rgba(10, 10, 10, 0.8)" : "rgba(0, 0, 0, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)"
        }}
        className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-24 h-20 transition-all duration-300"
      >
        <div className="flex items-center gap-3">
          {/* Imagen de Rem integrada */}
          <div className="text-3xl font-black text-white tracking-tight">
            Rem<span className="text-sky-400">Ai</span>
          </div>
          <div className="relative w-10 h-10">
            <img 
              src="/images/navbar/rem-navbar.png" 
              alt="Rem" 
              className="h-full w-full object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/sign-in" className="text-sm font-medium text-neutral-300 hover:text-white transition">
            Iniciar sesión
          </Link>
          <Link 
            href="/sign-up" 
            className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 border backdrop-blur-sm ${
              isScrolled 
                ? "bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20" 
                : "bg-white/10 text-white border-white/20 hover:bg-white/20"
            }`}
          >
            Unirse
          </Link>
        </div>
      </motion.nav>

      {/* <- Hero Section -> */}
      <header className="relative h-screen flex items-center px-6 md:px-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-red-950/20" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-2xl mt-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">Tu mundo <span className="text-red-500">Manga</span>.</h1>
          <p className="text-xl text-neutral-400 max-w-lg">Sumérgete en una biblioteca inteligente. Estética minimalista, carga instantánea y la mejor experiencia de lectura.</p>
        </div>
      </header>

      {/* <- Sección Carrusel -> */}
      <section className="py-16 -mt-32 relative z-20">
        <h2 className="px-6 md:px-24 text-2xl font-bold mb-8 flex items-center gap-3">
          <div className="w-1 h-8 bg-red-500 rounded-full" /> Top Mangas Rem
        </h2>
        
        <div className="relative flex overflow-hidden mask-fade px-6 md:px-24">
          <motion.div 
            className="flex gap-6"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 60, ease: "linear", repeat: Infinity }}
          >
            {mangas.length > 0 && [...mangas, ...mangas].map((manga, index) => (
              <div key={index} className="w-[200px] shrink-0" onContextMenu={(e) => e.preventDefault()}>
                <HomeMangaCard manga={manga} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* <- Footer -> */}
      <Footer />
      
    </div>
  );
}
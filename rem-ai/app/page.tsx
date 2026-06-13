"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getPopularManga, MangaResponse } from "@/lib/mangadex";
import HomeMangaCard from "@/components/HomeMangaCard";

export default function HomePage() {
  const [mangas, setMangas] = useState<MangaResponse[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Detectar scroll para navbar
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    async function loadMangas() {
      const data = await getPopularManga();
      setMangas(data);
    }
    loadMangas();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 overflow-x-hidden select-none">
      
{/* Navbar con acento de Rem (Celeste) y contraste de Asuka (Rojo) */}
<nav 
  className={`fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-24 h-20 transition-all duration-500 ease-in-out ${
    isScrolled 
      ? "bg-neutral-950/90 backdrop-blur-2xl border-b border-sky-900/50" // Scroll: Fondo profundo con borde celeste sutil
      : "bg-gradient-to-b from-black/40 to-transparent" // Por defecto: Gradiente suave
  }`}
>
  <div className="text-3xl font-black text-white tracking-tight">
    Rem<span className="text-sky-400">Ai</span>
  </div>
  
  <div className="flex items-center gap-4">
    <Link href="/sign-in" className="text-sm font-medium text-neutral-300 hover:text-white transition">
      Iniciar sesión
    </Link>
    
    <Link 
      href="/sign-up" 
      className={`px-5 py-2 text-sm font-bold rounded-lg transition-all duration-300 border backdrop-blur-sm ${
        isScrolled 
          // Al hacer scroll: Botón en celeste vibrante que destaca sobre el fondo negro/gris
          ? "bg-sky-500 text-white border-transparent shadow-[0_0_15px_rgba(14,165,233,0.3)] hover:bg-sky-400" 
          // Por defecto: Botón tipo "glass" sutil que respeta la estética de la imagen
          : "bg-white/10 text-white border-white/20 hover:bg-white/20"
      }`}
    >
      Unirse
    </Link>
  </div>
</nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center px-6 md:px-24">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=2000')] bg-cover bg-center">
          {/* Degradado ajustado para el tono rojo */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-red-950/20" />
        </div>
        
        <div className="relative z-10 space-y-6 max-w-2xl mt-20">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">Tu mundo <span className="text-red-500">Manga</span>.</h1>
          <p className="text-xl text-neutral-400 max-w-lg">Sumérgete en una biblioteca inteligente. Estética minimalista, carga instantánea y la mejor experiencia de lectura.</p>
        </div>
      </header>

      {/* Sección Carrusel */}
      <section className="py-16 -mt-32 relative z-20">
        <h2 className="px-6 md:px-24 text-2xl font-bold mb-8 flex items-center gap-3">
          <div className="w-1 h-8 bg-red-500 rounded-full" /> Top Mangas
        </h2>
        
        <div className="relative flex overflow-hidden mask-fade px-6 md:px-24">
          <motion.div 
            className="flex gap-6"
            initial={{ x: 0 }}
            animate={{ x: "-50%" }}
            transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          >
            {[...mangas, ...mangas].map((manga, index) => (
              <div key={index} className="w-[200px] shrink-0" onContextMenu={(e) => e.preventDefault()}>
                <HomeMangaCard manga={manga} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
<footer className="border-t border-sky-900/20 bg-neutral-950 px-6 md:px-24 py-16">
  {/* Contenedor principal con grid responsive */}
  <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
    
    {/* Columna Logo/Branding */}
    <div className="col-span-1 md:col-span-2 space-y-4">
      <div className="text-3xl font-black text-white">
        Rem<span className="text-sky-400">Ai</span>
      </div>
      <p className="text-neutral-500 text-sm max-w-xs leading-relaxed">
        La plataforma definitiva para amantes del manga. Inteligencia artificial aplicada a la lectura, optimización de imágenes y una biblioteca siempre actualizada.
      </p>
    </div>

    {/* Columnas de Navegación */}
    {/* Se agrupan los links para que en mobile queden debajo del branding */}
    <div className="grid grid-cols-2 md:grid-cols-3 col-span-1 md:col-span-3 gap-8">
      <div>
        <h4 className="font-bold text-white mb-6">Plataforma</h4>
        <ul className="space-y-4 text-sm text-neutral-400">
          <li className="hover:text-sky-400 transition cursor-pointer">Explorar</li>
          <li className="hover:text-sky-400 transition cursor-pointer">Top Mangas</li>
          <li className="hover:text-sky-400 transition cursor-pointer">Novedades</li>
          <li className="hover:text-sky-400 transition cursor-pointer">Comunidad</li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6">Legal</h4>
        <ul className="space-y-4 text-sm text-neutral-400">
          <li className="hover:text-sky-400 transition cursor-pointer">Privacidad</li>
          <li className="hover:text-sky-400 transition cursor-pointer">Términos de uso</li>
          <li className="hover:text-sky-400 transition cursor-pointer">Cookies</li>
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-white mb-6">Soporte</h4>
        <ul className="space-y-4 text-sm text-neutral-400">
          <li className="hover:text-sky-400 transition cursor-pointer">Discord</li>
          <li className="hover:text-sky-400 transition cursor-pointer">Contacto</li>
          <li className="hover:text-sky-400 transition cursor-pointer">FAQ</li>
        </ul>
      </div>
    </div>
  </div>

  {/* Línea final centrada */}
  <div className="pt-8 border-t border-white/5 text-center">
    <p className="text-neutral-600 text-xs">© 2026 RemAi. Desarrollado por Elaehtdev.</p>
  </div>
</footer>
    </div>
  );
}
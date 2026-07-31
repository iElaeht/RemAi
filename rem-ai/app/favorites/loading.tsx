import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Bookmark } from "lucide-react";

export default function FavoritesLoading() {
  return (
    <div className="bg-[#0b1120] min-h-screen text-white flex flex-col justify-between selection:bg-sky-500 selection:text-neutral-950">
      {/* 1. Navbar Superior */}
      <Navbar />

      {/* 2. Contenido Principal con esqueleto de tarjetas */}
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8 animate-in fade-in duration-300">
          
          {/* Cabecera de la sección */}
          <div className="flex flex-col items-center justify-center gap-2 border-b border-white/10 pb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center justify-center gap-3">
              <Bookmark className="text-sky-400/50 fill-sky-400/10" size={28} />
              Tus Favoritos
            </h1>
          </div>

          {/* Parrilla de tarjetas simuladas (Skeleton Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                className="bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col gap-3 animate-pulse"
              >
                {/* Cuadro simulando la portada del manga */}
                <div className="w-full h-48 md:h-64 bg-white/5 rounded-xl" />
                
                {/* Líneas simulando el título y subtítulo */}
                <div className="space-y-2 py-1">
                  <div className="h-4 bg-white/5 rounded w-5/6" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      {/* 3. Footer Inferior */}
      <Footer />
    </div>
  );
}
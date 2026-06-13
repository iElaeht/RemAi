// app/discover/page.tsx
import React from 'react';
import Navbar from '@/components/Navbar';
import MangaCard from '@/components/MangaCard';
import { getPopularManga } from '@/lib/mangadex';

export const dynamic = 'force-dynamic';

export default async function DiscoverPage() {
  // Esperamos los datos reales de la API
  const mangas = await getPopularManga();

  return (
    <>
      {/* Navbar fuera del main para abarcar todo el ancho */}
      <Navbar />

      {/* 
        FONDO ICONICO DINÁMICO DE AI MANGAS:
        - Light Mode: Fondo limpio que atenúa la vista (degradado suave).
        - Dark Mode: Nuestro ya icónico degradado premium místico y oscuro.
        Las letras alternan automáticamente gracias a 'text-neutral-950 dark:text-neutral-50'.
      */}
      <main className="min-h-screen w-full px-6 pt-8 pb-12 md:px-12 lg:px-24 transition-colors duration-300
        bg-gradient-to-b from-neutral-50 via-slate-100 to-blue-50 text-neutral-950
        dark:bg-gradient-to-b dark:from-neutral-950 dark:via-slate-950 dark:to-blue-950/40 dark:text-neutral-50"
      >
        
        {/* Encabezado del Discover */}
        <header className="mb-12 max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Descubrir</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Explora los mangas más populares de la comunidad con traducciones al español.
          </p>
        </header>

        {/* Contenedor del Grid Responsivo */}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6">
            Más Populares en Español
          </h2>
          
          {mangas.length === 0 ? (
            <p className="text-sm text-neutral-400">No se pudieron cargar los mangas en este momento.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6">
              {mangas.map((manga) => (
                <MangaCard
                  key={manga.id}
                  id={manga.id}
                  title={manga.title}
                  author={manga.author}
                  coverUrl={manga.coverUrl}
                  latestChapter={manga.latestChapter}
                  status={manga.status} 
                  tags={manga.tags}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
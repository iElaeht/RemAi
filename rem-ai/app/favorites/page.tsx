// rem-ai/app/favorites/page.tsx
import { auth } from "@clerk/nextjs/server";
import { getUserFavorites } from "@/actions/Favorites";
import Link from "next/link";
import { Bookmark, BookOpen, Compass } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FavoritesClientList from "@/components/favorites/FavoritesClientList"; // Importamos el componente de scroll infinito

export const metadata = {
  title: "Tus Favoritos | Mangas Rem",
  description: "Tus mangas y manhwas guardados en tu colección personal.",
};

export default async function FavoritesPage() {
  const { userId } = await auth();

  return (
    <div className="bg-[#0b1120] min-h-screen text-white flex flex-col justify-between selection:bg-sky-500 selection:text-neutral-950">
      
      {/* 1. Navbar Superior */}
      <Navbar />

      {/* 2. Contenido Principal */}
      <main className="flex-grow p-4 md:p-6 lg:p-8">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8 animate-in fade-in duration-500">
          
          {/* Cabecera de la sección centrada y sin descripción */}
          <div className="flex flex-col items-center justify-center gap-2 border-b border-white/10 pb-6 text-center">
            <h1 className="text-2xl md:text-3xl font-extrabold flex items-center justify-center gap-3">
              <Bookmark className="text-sky-400 fill-sky-400/20" size={28} />
              Tus Favoritos
            </h1>
          </div>

          {!userId ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-white/[0.02] border border-white/5 rounded-2xl p-8">
              <Bookmark size={48} className="text-neutral-600 mb-4 animate-pulse" />
              <h3 className="text-lg font-bold text-neutral-300 mb-1">Acceso restringido</h3>
              <p className="text-neutral-500 text-xs max-w-sm mb-6">
                Necesitas iniciar sesión para ver y administrar tu lista de favoritos.
              </p>
              <Link 
                href="/discover"
                className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-sky-500/20"
              >
                Explorar catálogo
              </Link>
            </div>
          ) : (
            <FavoritesWrapper userId={userId} />
          )}

        </div>
      </main>

      {/* 3. Footer Inferior */}
      <Footer />

    </div>
  );
}

// Componente servidor para obtener los datos de la base de datos
async function FavoritesWrapper({ userId }: { userId: string }) {
  const favorites = await getUserFavorites(userId);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center bg-white/[0.02] border border-white/5 rounded-2xl p-8">
        <BookOpen size={48} className="text-neutral-600 mb-4" />
        <h3 className="text-lg font-bold text-neutral-300 mb-1">No tienes favoritos aún</h3>
        <p className="text-neutral-500 text-xs max-w-sm mb-6">
          Explora nuestro catálogo y guarda tus títulos preferidos haciendo clic en el botón de favoritos de cada obra.
        </p>
        <Link 
          href="/discover"
          className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold text-xs rounded-xl transition-all border border-white/10"
        >
          <Compass size={15} />
          <span>Explorar catálogo</span>
        </Link>
      </div>
    );
  }

  // Pasamos los favoritos al componente cliente con scroll infinito
  return <FavoritesClientList favorites={favorites} />;
}
// rem-ai/components/favorites/FavoritesClientList.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen, Trash2, AlertTriangle, X } from "lucide-react";
import FavoritesFilters from "./FavoritesFilters";
import FavoritesPagination from "./FavoritesPagination";
import { removeFavorite } from "@/actions/Favorites";

interface FavoriteItem {
  id: string | number;
  manga_id: string;
  type: string;
  title: string;
  cover_image: string;
  created_at?: string;
}

export default function FavoritesClientList({ favorites }: { favorites: FavoriteItem[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para el modal de confirmación de borrado
  const [itemToDelete, setItemToDelete] = useState<FavoriteItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const typeParam = searchParams.get("type");
  const sortParam = searchParams.get("sort");
  const pageParam = searchParams.get("page");

  const selectedType = typeParam || "all";
  const sortOrder = sortParam || "recent";
  const currentPage = Number(pageParam) || 1;

  const ITEMS_PER_PAGE = 20;

  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("favorites_view_mode") as "grid" | "list") || "grid";
    }
    return "grid";
  });

  useEffect(() => {
    localStorage.setItem("favorites_view_mode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    if (!typeParam || !sortParam || !pageParam) {
      const params = new URLSearchParams(searchParams.toString());
      if (!typeParam) params.set("type", "all");
      if (!sortParam) params.set("sort", "recent");
      if (!pageParam) params.set("page", "1");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [typeParam, sortParam, pageParam, searchParams, router]);

  const updateQueryParam = (key: string, value: string) => {
    setIsLoading(true);
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== "page") params.set("page", "1");
    
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  useEffect(() => {
    if (!isPending) {
      const timer = setTimeout(() => setIsLoading(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isPending, searchParams]);

  const handleTypeChange = (type: string) => {
    updateQueryParam("type", type);
  };

  const handleSortChange = (order: string) => {
    updateQueryParam("sort", order);
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParam("page", newPage.toString());
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para confirmar y ejecutar la eliminación
  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      // Llamada real a la Server Action que creamos en actions/Favorites.ts
      await removeFavorite(itemToDelete.id);
      
      // Si todo sale bien, cerramos el modal
      setIsDeleting(false);
      setItemToDelete(null);
      
      // NOTA: No hace falta router.refresh() porque revalidatePath en la action 
      // ya le avisó a Next.js que la ruta /favorites debe actualizarse.
    } catch (error) {
      console.error("Error al eliminar favorito:", error);
      setIsDeleting(false);
      // Aquí podrías añadir una notificación de error si tienes alguna librería (como toast)
      alert("Hubo un error al eliminar el favorito. Inténtalo de nuevo.");
    }
  };

  const filteredFavorites = favorites.filter((fav) => {
    if (selectedType === "all") return true;
    return fav.type.toLowerCase() === selectedType.toLowerCase();
  });

  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortOrder === "az") {
      return a.title.localeCompare(b.title);
    }
    if (sortOrder === "za") {
      return b.title.localeCompare(a.title);
    }
    if (sortOrder === "oldest") {
      return (Number(a.id) || 0) - (Number(b.id) || 0);
    }
    return (Number(b.id) || 0) - (Number(a.id) || 0);
  });

  const totalPages = Math.ceil(sortedFavorites.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentFavorites = sortedFavorites.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col gap-6 relative">
      <FavoritesFilters 
        selectedType={selectedType}
        setSelectedType={handleTypeChange}
        sortOrder={sortOrder}
        setSortOrder={handleSortChange}
        totalCount={sortedFavorites.length}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {isLoading || isPending ? (
        viewMode === "grid" ? (
          <div className="max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="flex flex-col bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden p-2.5 gap-2">
                <div className="aspect-[3/4] w-full bg-white/5 rounded-xl" />
                <div className="h-3 bg-white/5 rounded w-4/5 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3.5 animate-pulse">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="flex items-center bg-neutral-900/40 border border-white/5 rounded-2xl p-3 gap-4">
                <div className="aspect-[3/4] w-20 bg-white/5 rounded-xl flex-shrink-0" />
                <div className="flex flex-col flex-grow gap-2.5">
                  <div className="w-12 h-3.5 bg-white/5 rounded-full" />
                  <div className="h-4 bg-white/5 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : sortedFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] border border-white/5 rounded-3xl p-8">
          <BookOpen size={40} className="text-neutral-600 mb-3" />
          <h3 className="text-base font-bold text-neutral-300 mb-1">No se encontraron resultados</h3>
          <p className="text-neutral-500 text-xs max-w-xs">
            No tienes elementos que coincidan con este filtro en tu colección.
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {currentFavorites.map((fav) => (
                <div 
                  key={fav.id} 
                  className="group relative flex flex-col bg-neutral-900/40 hover:bg-neutral-900/80 border border-white/5 hover:border-sky-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-sky-500/10 transition-all duration-300 p-2.5"
                >
                  <Link 
                    href={`/details/${fav.type}/${fav.manga_id}`}
                    prefetch={false}
                    className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-950 shadow-inner block"
                  >
                    <img
                      src={fav.cover_image}
                      alt={fav.title}
                      className="object-cover w-full h-full opacity-95 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    
                    <span className={`absolute top-2 right-2 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider border shadow-sm ${
                      fav.type === "manhwa" 
                        ? "bg-rose-950/80 text-rose-400 border-rose-500/30" 
                        : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                    }`}>
                      {fav.type}
                    </span>
                  </Link>

                  {/* Botón de papelera: visible siempre en móviles (opacity-100), y solo en hover en pantallas md en adelante */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setItemToDelete(fav);
                    }}
                    title="Eliminar de favoritos"
                    className="absolute top-4 left-4 z-10 p-2.5 rounded-xl bg-neutral-950/80 hover:bg-rose-600 text-neutral-200 hover:text-white backdrop-blur-md border border-white/10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 shadow-lg hover:scale-105"
                  >
                    <Trash2 size={18} />
                  </button>

                  <div className="pt-2.5 px-1 pb-1 flex flex-col justify-center">
                    <Link href={`/details/${fav.type}/${fav.manga_id}`} prefetch={false}>
                      <h2 title={fav.title} className="text-[11px] font-medium text-neutral-300 hover:text-sky-400 transition-colors line-clamp-1 leading-tight text-center">
                        {fav.title}
                      </h2>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentFavorites.map((fav) => (
                <div 
                  key={fav.id} 
                  className="group relative flex items-center bg-neutral-900/40 hover:bg-neutral-900/80 border border-white/5 hover:border-sky-500/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300 p-3 gap-4"
                >
                  <Link 
                    href={`/details/${fav.type}/${fav.manga_id}`}
                    prefetch={false}
                    className="relative aspect-[3/4] w-20 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0 shadow-inner block"
                  >
                    <img
                      src={fav.cover_image}
                      alt={fav.title}
                      className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </Link>

                  <div className="flex flex-col justify-center flex-grow py-1 pr-10 gap-1.5">
                    <span className={`w-fit px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                      fav.type === "manhwa" 
                        ? "bg-rose-950/80 text-rose-400 border-rose-500/30" 
                        : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                    }`}>
                      {fav.type}
                    </span>

                    <Link href={`/details/${fav.type}/${fav.manga_id}`} prefetch={false}>
                      <h2 title={fav.title} className="text-sm font-medium text-neutral-200 hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                        {fav.title}
                      </h2>
                    </Link>
                  </div>

                  {/* Botón de papelera en Modo Lista */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setItemToDelete(fav);
                    }}
                    title="Eliminar de favoritos"
                    className="absolute right-3 p-2.5 rounded-xl bg-neutral-900/90 hover:bg-rose-600 text-neutral-300 hover:text-white border border-white/10 hover:border-rose-500/30 transition-all duration-200 shadow-md hover:scale-105"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <FavoritesPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* ================= MODAL DE CONFIRMACIÓN DE BORRADO ================= */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
            
            <button 
              onClick={() => !isDeleting && setItemToDelete(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4 shadow-inner">
              <AlertTriangle size={24} />
            </div>

            <h3 className="text-lg font-bold text-neutral-100 mb-1">
              ¿Eliminar de favoritos?
            </h3>
            
            <p className="text-xs text-neutral-400 mb-4 max-w-xs">
              Estás a punto de eliminar <span className="text-neutral-200 font-medium">"{itemToDelete.title}"</span> de tu colección de favoritos.
            </p>

            <div className="flex items-center gap-3 w-full bg-neutral-950/50 border border-white/5 rounded-2xl p-2.5 mb-6 text-left">
              <img 
              src={itemToDelete.cover_image} 
              alt={itemToDelete.title} 
              className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] uppercase font-bold text-neutral-500">{itemToDelete.type}</span>
                <span className="text-xs font-medium text-neutral-300 truncate">{itemToDelete.title}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-xs text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
              >
                Cancelar
              </button>
              
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDelete}
                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Sí, eliminar</span>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
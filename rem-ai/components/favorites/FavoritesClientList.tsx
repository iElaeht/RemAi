// rem-ai/components/favorites/FavoritesClientList.tsx
"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import FavoritesFilters from "./FavoritesFilters";
import FavoritesPagination from "./FavoritesPagination";

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

  const typeParam = searchParams.get("type");
  const sortParam = searchParams.get("sort");
  const pageParam = searchParams.get("page");

  const selectedType = typeParam || "all";
  const sortOrder = sortParam || "recent";
  const currentPage = Number(pageParam) || 1;

  // 4 columnas x 3 filas = 12 elementos por página
  const ITEMS_PER_PAGE = 12;

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

  // Desactivamos el estado de carga una vez que la transición o parámetros se estabilizan
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
    <div className="flex flex-col gap-6">
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
        /* ================= SKELETON LOADING SEGÚN EL ESTADO ================= */
        viewMode === "grid" ? (
          <div className="max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 md:gap-4 animate-pulse">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="flex flex-col bg-neutral-900/60 border border-white/10 rounded-xl overflow-hidden p-2 gap-2">
                <div className="aspect-[3/4] w-full bg-white/5 rounded-lg" />
                <div className="p-1 space-y-1.5">
                  <div className="h-3 bg-white/5 rounded w-5/6" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <div key={i} className="flex items-center bg-neutral-900/60 border border-white/10 rounded-2xl p-2.5 gap-3">
                <div className="aspect-[3/4] w-16 sm:w-20 bg-white/5 rounded-lg flex-shrink-0" />
                <div className="flex flex-col flex-grow gap-2">
                  <div className="w-12 h-3 bg-white/5 rounded" />
                  <div className="h-3.5 bg-white/5 rounded w-full" />
                  <div className="h-3.5 bg-white/5 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : sortedFavorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white/[0.02] border border-white/5 rounded-2xl p-8">
          <BookOpen size={40} className="text-neutral-600 mb-3" />
          <h3 className="text-base font-bold text-neutral-300 mb-1">No se encontraron resultados</h3>
          <p className="text-neutral-500 text-xs max-w-xs">
            No tienes elementos que coincidan con este filtro en tu colección.
          </p>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            /* Cuadrícula de 4 columnas más compacta y centrada */
            <div className="max-w-6xl mx-auto w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 md:gap-4">
              {currentFavorites.map((fav) => (
                <Link 
                  key={fav.id} 
                  href={`/details/${fav.type}/${fav.manga_id}`}
                  prefetch={false}
                  className="group relative flex flex-col bg-neutral-900/60 border border-white/10 rounded-xl overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={fav.cover_image}
                      alt={fav.title}
                      className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                    <span className={`absolute top-2 right-2 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shadow-md ${
                      fav.type === "manhwa" 
                        ? "bg-red-950/80 text-red-400 border-red-500/30" 
                        : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                    }`}>
                      {fav.type}
                    </span>
                  </div>

                  <div className="p-2 flex flex-col justify-between flex-grow bg-gradient-to-b from-neutral-900/40 to-neutral-900/90">
                    <h2 className="text-[11px] md:text-xs font-semibold text-neutral-200 group-hover:text-sky-400 transition-colors line-clamp-2 leading-tight">
                      {fav.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="max-w-5xl mx-auto w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentFavorites.map((fav) => (
                <Link 
                  key={fav.id} 
                  href={`/details/${fav.type}/${fav.manga_id}`}
                  prefetch={false}
                  className="group relative flex items-center bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 p-2.5 gap-3"
                >
                  <div className="relative aspect-[3/4] w-16 sm:w-20 rounded-lg overflow-hidden bg-neutral-950 flex-shrink-0 shadow-md">
                    <img
                      src={fav.cover_image}
                      alt={fav.title}
                      className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  <div className="flex flex-col justify-center flex-grow py-1 pr-2 gap-1.5">
                    <span className={`w-fit px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shadow-sm ${
                      fav.type === "manhwa" 
                        ? "bg-red-950/80 text-red-400 border-red-500/30" 
                        : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                    }`}>
                      {fav.type}
                    </span>

                    <h2 className="text-xs font-semibold text-neutral-200 group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                      {fav.title}
                    </h2>
                  </div>
                </Link>
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
    </div>
  );
}
"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, BookOpen } from "lucide-react";
import FavoritesFilters from "./FavoritesFilters";

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

  const typeParam = searchParams.get("type");
  const sortParam = searchParams.get("sort");

  const selectedType = typeParam || "all";
  const sortOrder = sortParam || "recent";

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
    if (!typeParam || !sortParam) {
      const params = new URLSearchParams(searchParams.toString());
      if (!typeParam) params.set("type", "all");
      if (!sortParam) params.set("sort", "recent");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [typeParam, sortParam, searchParams, router]);

  const ITEMS_PER_PAGE = 10;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const updateQueryParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleTypeChange = (type: string) => {
    updateQueryParam("type", type);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  const handleSortChange = (order: string) => {
    updateQueryParam("sort", order);
    setVisibleCount(ITEMS_PER_PAGE);
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

  useEffect(() => {
    const handleScroll = () => {
      if (visibleCount >= sortedFavorites.length) return;

      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 300 &&
        !isLoading
      ) {
        setIsLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, sortedFavorites.length));
          setIsLoading(false);
        }, 300);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, visibleCount, sortedFavorites.length]);

  const displayedFavorites = sortedFavorites.slice(0, visibleCount);

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

      {sortedFavorites.length === 0 ? (
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
              {displayedFavorites.map((fav) => (
                <Link 
                  key={fav.id} 
                  href={`/details/${fav.type}/${fav.manga_id}`}
                  prefetch={false}
                  className="group relative flex flex-col bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
                    <img
                      src={fav.cover_image}
                      alt={fav.title}
                      className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
                    <span className={`absolute top-2.5 right-2.5 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-lg ${
                      fav.type === "manhwa" 
                        ? "bg-red-950/80 text-red-400 border-red-500/30" 
                        : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                    }`}>
                      {fav.type}
                    </span>
                  </div>

                  <div className="p-3 flex flex-col justify-between flex-grow bg-gradient-to-b from-neutral-900/40 to-neutral-900/90">
                    <h2 className="text-xs md:text-sm font-semibold text-neutral-200 group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                      {fav.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedFavorites.map((fav) => (
                <Link 
                  key={fav.id} 
                  href={`/details/${fav.type}/${fav.manga_id}`}
                  prefetch={false}
                  className="group relative flex items-center bg-neutral-900/60 border border-white/10 rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 p-3 gap-3.5"
                >
                  <div className="relative aspect-[3/4] w-20 sm:w-24 rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0 shadow-md">
                    <img
                      src={fav.cover_image}
                      alt={fav.title}
                      className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>

                  <div className="flex flex-col justify-center flex-grow py-1 pr-2 gap-2">
                    <span className={`w-fit px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border shadow-sm ${
                      fav.type === "manhwa" 
                        ? "bg-red-950/80 text-red-400 border-red-500/30" 
                        : "bg-sky-950/80 text-sky-400 border-sky-500/30"
                    }`}>
                      {fav.type}
                    </span>

                    <h2 className="text-sm font-semibold text-neutral-200 group-hover:text-sky-400 transition-colors line-clamp-2 leading-snug">
                      {fav.title}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {isLoading && visibleCount < sortedFavorites.length && (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="animate-spin text-sky-400" size={28} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
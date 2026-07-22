"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMangas } from "@/Hooks/useMangas";
import SearchFilter from "@/components/features/SearchFilter";
import MangaGrid from "@/components/library/MangaGrid";
import Pagination from "@/components/common/Pagination";
import { SortOption, StatusOption } from "@/types/mangadex";

interface LibraryContentProps {
  initialTagId?: string;
}

export default function LibraryContent({ initialTagId }: LibraryContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const {
    mangas,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedTags,
    toggleTag,
    fetchMangas,
    resetFilters,
    sortBy,
    setSortBy,
    status,
    setStatus,
  } = useMangas();

  const updateUrlParams = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => params.set(key, value));
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  // 1. Efecto para asegurar que la URL siempre tenga los parámetros iniciales limpios (?page=1&sort=rating)
  useEffect(() => {
    const page = searchParams.get("page");
    const sort = searchParams.get("sort");
    const statusParam = searchParams.get("status"); // Cambiado de 'status' a 'statusParam'

    // Si falta alguno de los parámetros base en la URL, los rellenamos por defecto
    if (!page || !sort || !statusParam) {
      const params = new URLSearchParams(searchParams.toString());
      if (!page) params.set("page", "1");
      if (!sort) params.set("sort", "rating");
      if (!statusParam) params.set("status", "all");

      // Usamos replace para actualizar la URL de forma limpia sin desordenar el historial
      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  // 2. Tu useEffect principal existente para leer los valores y buscar
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const sort = (searchParams.get("sort") || "rating") as SortOption;
    const statusVal = (searchParams.get("status") || "all") as StatusOption;

    setCurrentPage(page);
    setSearchQuery(search);
    setSortBy(sort);
    setStatus(statusVal);

    const tags = initialTagId ? [initialTagId] : [];
    fetchMangas(page, search, tags, sort, statusVal);
  }, [initialTagId, searchParams]);

  const handleFilterSearch = () => {
    updateUrlParams({ search: searchQuery });
  };

  const handleClear = () => {
    resetFilters();
    router.push(`${pathname}?page=1&sort=rating&status=all`);
  };

  return (
    <main className="relative bg-[#090d16] min-h-screen text-white p-4 md:p-6 lg:px-24 overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Luz ambiental superior sutil para dar profundidad y un toque más acogedor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-pink-600/10 via-purple-600/5 to-transparent pointer-events-none blur-3xl" />

      {/* Contenido principal de la biblioteca */}
      <div className="relative z-10">
        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          onSearch={handleFilterSearch}
          onClear={handleClear}
          sortBy={sortBy}
          setSortBy={(val) => updateUrlParams({ sort: val })}
          status={status}
          setStatus={(val) => updateUrlParams({ status: val })}
        />

        <MangaGrid mangas={mangas} isLoading={isLoading} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => {
            const params = new URLSearchParams(searchParams.toString());
            params.set("page", page.toString());
            router.push(`${pathname}?${params.toString()}`);
          }}
          disabled={isLoading}
        />
      </div>
    </main>
  );
}

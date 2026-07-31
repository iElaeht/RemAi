"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useMangas } from "@/Hooks/useMangas";
import SearchFilter from "@/components/features/SearchFilter";
import MangaGrid from "@/components/library/MangaGrid";
import Pagination from "@/components/common/Pagination";
import { SortOption, StatusOption } from "@/types/mangadex";
import { SearchX } from "lucide-react";

interface LibraryContentProps {
  initialTagId?: string;
}

export default function LibraryContent({ initialTagId }: LibraryContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Detectar la ruta base actual (/mangas o /manhwas)
  const currentBasePath = pathname.startsWith("/manhwas") ? "/manhwas" : "/mangas";

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

  // 1. Efecto para asegurar que la URL siempre tenga los parámetros iniciales limpios
  useEffect(() => {
    const page = searchParams.get("page");
    const sort = searchParams.get("sort");
    const statusParam = searchParams.get("status");

    if (!page || !sort || !statusParam) {
      const params = new URLSearchParams(searchParams.toString());
      if (!page) params.set("page", "1");
      if (!sort) params.set("sort", "rating");
      if (!statusParam) params.set("status", "all");

      router.replace(`${pathname}?${params.toString()}`);
    }
  }, [searchParams, pathname, router]);

  // 2. Efecto principal para leer los valores y buscar
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
  }, [initialTagId, searchParams, fetchMangas, setCurrentPage, setSearchQuery, setSortBy, setStatus]);

  // 3. Efecto para actualizar dinámicamente el título de la pestaña del navegador
  useEffect(() => {
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    
    const pathParts = window.location.pathname.split('/');
    const genreFromUrl = pathParts.length > 3 ? pathParts[pathParts.length - 1] : null;

    let title = "Mangas | Mangas Rem";

    if (search) {
      title = `Búsqueda: "${search}" | Mangas Rem`;
    } else if (genreFromUrl) {
      const genreName = genreFromUrl.charAt(0).toUpperCase() + genreFromUrl.slice(1);
      title = `Género: ${genreName} | Mangas Rem`;
    } else if (page && page !== "1") {
      title = `Mangas (Pág. ${page}) | Mangas Rem`;
    }

    document.title = title;
  }, [searchParams, pathname]);

  const handleFilterSearch = () => {
    // Si estamos dentro de una categoría, saltamos a la raíz limpia con el parámetro de búsqueda
    if (initialTagId) {
      router.push(
        `${currentBasePath}?search=${encodeURIComponent(
          searchQuery
        )}&sort=${sortBy}&status=${status}`
      );
    } else {
      updateUrlParams({ search: searchQuery });
    }
  };

  const handleClear = () => {
    resetFilters();
    router.push(`${currentBasePath}?page=1&sort=rating&status=all`);
  };

  // Obtenemos el texto de búsqueda actual de los parámetros de la URL para mostrarlo en el mensaje
  const activeSearchTerm = searchParams.get("search");

  return (
    <main className="relative bg-[#090d16] min-h-screen text-white p-4 md:p-6 lg:px-24 overflow-x-hidden selection:bg-pink-500 selection:text-white">
      {/* Luz ambiental superior sutil */}
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

        {/* Mensaje cuando no hay resultados de búsqueda o filtros */}
        {!isLoading && mangas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/[0.02] border border-white/5 rounded-2xl mt-8">
            <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <SearchX size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No se encontraron resultados
            </h3>
            <p className="text-neutral-400 text-sm max-w-md">
              {activeSearchTerm ? (
                <>No hay resultados para la búsqueda: <span className="text-pink-400 font-semibold">&ldquo;{activeSearchTerm}&rdquo;</span></>
              ) : (
                "No hay mangas disponibles con los filtros seleccionados."
              )}
            </p>
            <button
              onClick={handleClear}
              className="mt-6 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-medium transition-all"
            >
              Limpiar filtros y búsqueda
            </button>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </main>
  );
}
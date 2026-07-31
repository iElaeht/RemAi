'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useManhwas } from "@/Hooks/useManhwas";
import SearchFilter from "@/components/features/SearchFilter";
import ManhwaGrid from "@/components/library/ManhwaGrid";
import Pagination from "@/components/common/Pagination";
import { SortOption, StatusOption } from "@/types/mangadex";
import { SearchX } from "lucide-react"; // <-- Importamos el icono para cuando no hay resultados

interface ManhwasContentProps {
  initialTagId?: string;
}

export default function ManhwasContent({ initialTagId }: ManhwasContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Detectar la ruta base actual para manhwas
  const currentBasePath = pathname.startsWith("/manhwas") ? "/manhwas" : "/mangas";

  const {
    manhwas,
    isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedTags,
    toggleTag,
    fetchManhwas,
    resetFilters,
    sortBy,
    setSortBy,
    status,
    setStatus,
  } = useManhwas();

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

  // 2. Efecto principal para leer los valores de la URL y disparar la búsqueda
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const sort = (searchParams.get("sort") || "rating") as SortOption;
    const statusVal = (searchParams.get("status") || "all") as StatusOption;
    
    const tagsParam = searchParams.get("tags");
    const urlTags = tagsParam ? tagsParam.split(",").filter(Boolean) : [];
    const tags = initialTagId ? Array.from(new Set([initialTagId, ...urlTags])) : urlTags;

    setCurrentPage(page);
    setSearchQuery(search);
    setSortBy(sort);
    setStatus(statusVal);

    fetchManhwas(page, search, tags, sort, statusVal);
  }, [initialTagId, searchParams, fetchManhwas, setCurrentPage, setSearchQuery, setSortBy, setStatus]);

  // 3. Efecto para actualizar dinámicamente el título de la pestaña del navegador
  useEffect(() => {
    const search = searchParams.get("search");
    const page = searchParams.get("page");
    
    const pathParts = window.location.pathname.split('/');
    const genreFromUrl = pathParts.length > 3 ? pathParts[pathParts.length - 1] : null;

    let title = "Manhwas | Mangas Rem";

    if (search) {
      title = `Búsqueda: "${search}" | Mangas Rem`;
    } else if (genreFromUrl) {
      const genreName = genreFromUrl.charAt(0).toUpperCase() + genreFromUrl.slice(1);
      title = `Género: ${genreName} | Mangas Rem`;
    } else if (page && page !== "1") {
      title = `Manhwas (Pág. ${page}) | Mangas Rem`;
    }

    document.title = title;
  }, [searchParams, pathname]);

  const handleFilterSearch = () => {
    // Si estamos dentro de una categoría de manhwas, saltamos a la raíz limpia con el parámetro de búsqueda
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

  // Obtenemos el texto de búsqueda actual de la URL para mostrarlo en el aviso
  const activeSearchTerm = searchParams.get("search");

  return (
    <main className="relative bg-[#12080a] min-h-screen text-white p-4 md:p-6 lg:px-24 overflow-x-hidden selection:bg-red-600 selection:text-white">
      {/* Luz ambiental superior en tonos rojos cálidos */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-red-600/15 via-rose-900/5 to-transparent pointer-events-none blur-3xl" />

      <div className="relative z-10">
        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTags={selectedTags}
          toggleTag={(tagId) => {
            toggleTag(tagId);
          }}
          onSearch={handleFilterSearch}
          onClear={handleClear}
          sortBy={sortBy}
          setSortBy={(val) => updateUrlParams({ sort: val })}
          status={status}
          setStatus={(val) => updateUrlParams({ status: val })}
        />

        {/* Mensaje condicional cuando no se encuentran resultados */}
        {!isLoading && manhwas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white/[0.02] border border-white/5 rounded-2xl mt-8">
            <div className="w-16 h-16 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <SearchX size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              No se encontraron resultados
            </h3>
            <p className="text-neutral-400 text-sm max-w-md">
              {activeSearchTerm ? (
                <>No hay resultados para la búsqueda: <span className="text-red-400 font-semibold">&ldquo;{activeSearchTerm}&rdquo;</span></>
              ) : (
                "No hay manhwas disponibles con los filtros seleccionados."
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
            <ManhwaGrid manhwas={manhwas} isLoading={isLoading} />

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
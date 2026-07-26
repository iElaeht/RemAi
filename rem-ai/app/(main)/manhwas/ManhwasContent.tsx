"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useManhwas } from "@/Hooks/useManhwas";
import SearchFilter from "@/components/features/SearchFilter";
import ManhwaGrid from "@/components/library/ManhwaGrid";
import Pagination from "@/components/common/Pagination";
import { SortOption, StatusOption } from "@/types/mangadex";

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
      </div>
    </main>
  );
}
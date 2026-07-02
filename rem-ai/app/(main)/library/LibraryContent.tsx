"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useMangas } from "@/Hooks/useMangas";
import SearchFilter from "@/components/features/SearchFilter";
import MangaGrid from "@/components/library/MangaGrid";
import Pagination from "@/components/common/Pagination";

interface LibraryContentProps {
  initialTagId?: string;
}

export default function LibraryContent({ initialTagId }: LibraryContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

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

useEffect(() => {
    // 1. Obtenemos los valores de la URL
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    
    // 2. Sincronizamos el estado local
    setCurrentPage(page);
    setSearchQuery(search);

    // 3. Prioridad absoluta: Si hay un tag, lo usamos
    if (initialTagId) {
      if (!selectedTags.includes(initialTagId)) {
        toggleTag(initialTagId);
      }
      fetchMangas(page, "", [initialTagId], sortBy, status);
      return;
    }

    // 4. Búsqueda normal usando la página de la URL
    fetchMangas(page, search, [], sortBy, status);
    
  }, [initialTagId, searchParams, sortBy, status]); // searchParams ya detecta cambios en 'page'

  const handleFilterSearch = () => {
    setCurrentPage(1);

    // Si hay texto en el buscador, vamos a la URL /library?search=...
    if (searchQuery.trim()) {
      router.push(`/library?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // Si no hay texto, limpiamos la URL
      router.push("/library");
      fetchMangas(1, "", selectedTags, sortBy, status);
    }
  };

  const handleClear = () => {
    resetFilters();
    router.push("/library");
  };

  return (
    <main className="w-full">
      <SearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        onSearch={handleFilterSearch}
        onClear={handleClear}
        sortBy={sortBy}
        setSortBy={setSortBy}
        status={status}
        setStatus={setStatus}
      />

      <MangaGrid mangas={mangas} isLoading={isLoading} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set("page", page.toString());
          router.push(`/library?${params.toString()}`);
        }}
        disabled={isLoading}
      />
    </main>
  );
}

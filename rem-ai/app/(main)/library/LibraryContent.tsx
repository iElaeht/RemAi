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

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const sort = (searchParams.get("sort") ||
      "latestUploadedChapter") as SortOption;
    const status = (searchParams.get("status") || "all") as StatusOption;

    setCurrentPage(page);
    setSearchQuery(search);
    setSortBy(sort);
    setStatus(status);

    const tags = initialTagId ? [initialTagId] : [];
    fetchMangas(page, search, tags, sort, status);
  }, [initialTagId, searchParams]);

useEffect(() => {
  const search = searchParams.get("search");
  const page = searchParams.get("page");
  
  // Obtenemos el nombre del género desde la ruta (es la última parte de la URL)
  // Ejemplo: /library/uuid/horror -> toma 'horror'
  const pathParts = window.location.pathname.split('/');
  const genreFromUrl = pathParts.length > 3 ? pathParts[pathParts.length - 1] : null;

  let title = "Biblioteca | MangasRem";

  if (search) {
    title = `Búsqueda: "${search}" | MangasRem`;
  } else if (genreFromUrl) {
    // Capitalizamos la primera letra
    const genreName = genreFromUrl.charAt(0).toUpperCase() + genreFromUrl.slice(1);
    title = `Género: ${genreName} | MangasRem`;
  } else if (page && page !== "1") {
    title = `Biblioteca (Pág. ${page}) | MangasRem`;
  }

  document.title = title;
}, [searchParams, pathname]); // Dependencia en pathname es clave

  const handleFilterSearch = () => {
    updateUrlParams({ search: searchQuery });
  };

  const handleClear = () => {
    resetFilters();
    router.push("/library");
  };

  return (
    <main className="bg-[#0a0f1d] min-h-screen text-white p-4 md:p-6 lg:px-24 overflow-x-hidden">
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
    </main>
  );
}

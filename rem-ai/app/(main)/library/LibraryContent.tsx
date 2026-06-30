'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMangas } from '@/Hooks/useMangas';
import SearchFilter from '@/components/features/SearchFilter';
import MangaGrid from '@/components/library/MangaGrid';
import Pagination from '@/components/common/Pagination';

interface LibraryContentProps {
  initialTagId?: string;
}

export default function LibraryContent({ initialTagId }: LibraryContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const { 
  mangas, isLoading, currentPage, totalPages,
  setCurrentPage, searchQuery, setSearchQuery, 
  selectedTags, toggleTag, fetchMangas, resetFilters,
  sortBy, setSortBy, status, setStatus 
} = useMangas();

  useEffect(() => {
    // 1. Prioridad absoluta: Si viene un tag en la ruta, ignoramos la búsqueda de texto.
    if (initialTagId) {
      if (!selectedTags.includes(initialTagId)) {
        toggleTag(initialTagId);
      }
      fetchMangas(1, '', [initialTagId], sortBy, status);
      return;
    }

    // 2. Si no hay tag, verificamos si el usuario escribió algo en el buscador
    const searchFromUrl = searchParams.get('search');
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      fetchMangas(1, searchFromUrl, [], sortBy, status);
    } else {
      // 3. Caso base: Carga limpia
      fetchMangas(1, '', [], sortBy, status);
    }
  }, [initialTagId, searchParams, sortBy, status]);

  const handleFilterSearch = () => {
    setCurrentPage(1);
    
    // Si hay texto en el buscador, vamos a la URL /library?search=...
    if (searchQuery.trim()) {
      router.push(`/library?search=${encodeURIComponent(searchQuery)}`);
    } else {
      // Si no hay texto, limpiamos la URL
      router.push('/library');
      fetchMangas(1, '', selectedTags, sortBy, status);
    }
  };

  const handleClear = () => {
    resetFilters();
    router.push('/library'); 
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
          setCurrentPage(page);
          fetchMangas(page, searchQuery, selectedTags, sortBy, status);
        }}
        disabled={isLoading}
      />
    </main>
  );
}
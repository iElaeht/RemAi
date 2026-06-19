'use client';

import { useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useMangas } from '@/Hooks/useMangas';
import SearchFilter from '@/components/features/SearchFilter';
import MangaGrid from '@/components/library/MangaGrid';
import Pagination from '@/components/common/Pagination';

export default function LibraryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Obtenemos los valores de la URL o usamos valores por defecto
  const pageFromUrl = parseInt(searchParams.get('page') || '1');
  const queryFromUrl = searchParams.get('search') || '';

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
    resetFilters 
  } = useMangas();

  // Función para actualizar la URL sin recargar la página
  const updateUrl = useCallback((page: number, search: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    if (search) params.set('search', search);
    else params.delete('search');
    
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router]);

  // Carga inicial basada en parámetros de URL
  useEffect(() => {
    setCurrentPage(pageFromUrl);
    setSearchQuery(queryFromUrl);
    fetchMangas(pageFromUrl, queryFromUrl, selectedTags);
  }, [pageFromUrl, queryFromUrl, fetchMangas, setCurrentPage, setSearchQuery, selectedTags]);

  const handleFilterSearch = () => {
    setCurrentPage(1);
    updateUrl(1, searchQuery);
    fetchMangas(1, searchQuery, selectedTags);
  };

  const handleClear = () => {
    resetFilters();
    router.push(pathname); // Resetea la URL
    fetchMangas(1, '', []);
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
      />

      <MangaGrid 
        mangas={mangas} 
        isLoading={isLoading} 
      />
      
      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          updateUrl(page, searchQuery);
          fetchMangas(page, searchQuery, selectedTags);
        }}
        disabled={isLoading}
      />
    </main>
  );
}
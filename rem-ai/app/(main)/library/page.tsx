'use client';

import { useEffect } from 'react';
import { useMangas } from '@/Hooks/useMangas';
import SearchFilter from '@/components/library/SearchFilter';
import MangaGrid from '@/components/library/MangaGrid';
import Pagination from '@/components/library/Pagination';

export default function LibraryPage() {
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

  // Carga inicial: obtenemos los primeros mangas al montar el componente
  useEffect(() => {
    fetchMangas(1, '', []);
  }, [fetchMangas]);

  // Maneja la búsqueda con filtros, reseteando siempre a la página 1
  const handleFilterSearch = () => {
    setCurrentPage(1);
    fetchMangas(1, searchQuery, selectedTags);
  };

  // Limpia todos los filtros y vuelve a la carga inicial
  const handleClear = () => {
    resetFilters();
    fetchMangas(1, '', []);
  };

  return (
    /* overflow-x-hidden en el contenedor principal bloquea el scroll lateral innecesario */
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
          fetchMangas(page, searchQuery, selectedTags);
        }}
        disabled={isLoading}
      />
    </main>
  );
}
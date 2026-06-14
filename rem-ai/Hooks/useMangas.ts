import { useState, useCallback } from 'react';
import { TAG_CATEGORIES } from '@/types/tags';

export interface Manga {
  id: string;
  title: string;
  cover: string;
  genres: string[];
}

interface RawMangaApiData {
  id?: string;
  title?: string;
  cover?: string;
  tags?: string[];
}

export interface UseMangasReturn {
  mangas: Manga[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (category: string, tagName: string) => void;
  fetchMangas: (page: number, search: string, tags: string[]) => Promise<void>;
  resetFilters: () => void;
}

export function useMangas(): UseMangasReturn {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const fetchMangas = useCallback(async (page: number, search: string, tags: string[]) => {
    setIsLoading(true);
    try {
      // 1. Limpiamos mangas si vamos a cargar un nuevo bloque
      // Esto da una mejor sensación visual de "recarga" al usuario
      // setMangas([]); 

      const url = `/api/mangas?page=${page}&search=${encodeURIComponent(search)}&tags=${tags.join(',')}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Error al obtener mangas");

      // 2. Actualizamos totalPages limitando a nuestro bloque seguro (555)
      setTotalPages(data.totalPages || 1);
      
      const formattedMangas: Manga[] = (Array.isArray(data.results) ? data.results : []).map((item: unknown) => {
        const m = item as RawMangaApiData;
        return {
          id: String(m.id || ''),
          title: m.title || "Sin título",
          cover: m.cover || "",
          genres: Array.isArray(m.tags) ? m.tags : []
        };
      });

      setMangas(formattedMangas);
      setCurrentPage(page); // Sincronizamos la página actual
    } catch (error) {
      console.error("Error al obtener mangas:", error);
      setMangas([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTag = (category: string, tagName: string) => {
    const allTags = TAG_CATEGORIES as Record<string, Record<string, string>>;
    if (!allTags[category] || !allTags[category][tagName]) return;
    
    const tagId = allTags[category][tagName];
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
    setCurrentPage(1);
  };

  return { 
    mangas, isLoading, currentPage, totalPages, setCurrentPage, 
    searchQuery, setSearchQuery, selectedTags, toggleTag, 
    fetchMangas, resetFilters 
  };
}
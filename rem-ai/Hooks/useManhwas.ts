import { useState, useCallback } from "react";
import { TAG_DICTIONARY } from "@/data/tagDictionary";
import { SortOption, StatusOption } from "@/types/mangadex";

export interface Manhwa {
  id: string;
  title: string;
  cover: string;
  genres: string[];
  author: string;
  rating: string;
}

interface RawManhwaApiData {
  id?: string;
  title?: string;
  cover?: string;
  tags?: string[];
  author?: string;
  rating?: string;
}

export interface UseManhwasReturn {
  manhwas: Manhwa[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
  fetchManhwas: (
    page: number,
    search: string,
    tags: string[],
    sortBy: SortOption,
    status: StatusOption,
  ) => Promise<void>;
  resetFilters: () => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  status: StatusOption;
  setStatus: (val: StatusOption) => void;
}

export function useManhwas(): UseManhwasReturn {
  // --- 1. Estados Principales ---
  const [manhwas, setManhwas] = useState<Manhwa[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // --- 2. Estados de Filtros Avanzados (Sincronizados con "rating" por defecto) ---
  const [sortBy, setSortBy] = useState<SortOption>("rating");
  const [status, setStatus] = useState<StatusOption>("all");

  // --- 3. Función para Obtener Manhwas ---
  const fetchManhwas = useCallback(
    async (
      page: number,
      search: string,
      tags: string[],
      currentSort: SortOption,
      currentStatus: StatusOption,
    ) => {
      setIsLoading(true);
      try {
        // Apunta al endpoint de manhwas/manhuas que consume ko y zh
        const url = `/api/manhwas?page=${page}&search=${encodeURIComponent(search)}&tags=${tags.join(",")}&sort=${currentSort}&status=${currentStatus}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al obtener manhwas");

        setTotalPages(data.totalPages || 1);

        const formattedManhwas: Manhwa[] = (
          Array.isArray(data.results) ? data.results : []
        ).map((item: unknown) => {
          const m = item as RawManhwaApiData;
          return {
            id: String(m.id || ""),
            title: m.title || "Sin título",
            cover: m.cover || "",
            genres: Array.isArray(m.tags) ? m.tags : [],
            author: m.author || "Autor desconocido",
            rating: m.rating || "0.0",
          };
        });

        setManhwas(formattedManhwas);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error al obtener manhwas:", error);
        setManhwas([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // --- 4. Gestión de Tags ---
  const toggleTag = (tagId: string) => {
    const validTags = Object.values(TAG_DICTIONARY);
    const isValid = validTags.includes(tagId);

    if (!isValid) return;

    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  // --- 5. Resetear Filtros (Sincronizado con los valores iniciales) ---
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setCurrentPage(1);
    setSortBy("rating");
    setStatus("all");
  };

  return {
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
  };
}
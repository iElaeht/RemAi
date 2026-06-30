import { useState, useCallback } from "react";
import { TAG_DICTIONARY } from "@/data/tagDictionary";
import { SortOption, StatusOption } from "@/types/mangadex";

export interface Manga {
  id: string;
  title: string;
  cover: string;
  genres: string[];
  author: string;
  rating: string;
}

interface RawMangaApiData {
  id?: string;
  title?: string;
  cover?: string;
  tags?: string[];
  author: string;
  rating: string;
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
  toggleTag: (tagId: string) => void;
  fetchMangas: (
    page: number,
    search: string,
    tags: string[],
    sortBy: SortOption,
    status: StatusOption,
  ) => Promise<void>;
  resetFilters: () => void;
  // Nuevos estados
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  status: StatusOption;
  setStatus: (val: StatusOption) => void;
}

export function useMangas(): UseMangasReturn {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Estados para los filtros avanzados
  const [sortBy, setSortBy] = useState<SortOption>("latestUploadedChapter");
  const [status, setStatus] = useState<StatusOption>("all");

  const fetchMangas = useCallback(
    async (
      page: number,
      search: string,
      tags: string[],
      currentSort: SortOption,
      currentStatus: StatusOption,
    ) => {
      setIsLoading(true);
      try {
        // Pasamos los nuevos filtros a la query de la API
        const url = `/api/mangas?page=${page}&search=${encodeURIComponent(search)}&tags=${tags.join(",")}&sort=${currentSort}&status=${currentStatus}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al obtener mangas");

        setTotalPages(data.totalPages || 1);

        const formattedMangas: Manga[] = (
          Array.isArray(data.results) ? data.results : []
        ).map((item: unknown) => {
          const m = item as RawMangaApiData;
          return {
            id: String(m.id || ""),
            title: m.title || "Sin título",
            cover: m.cover || "",
            genres: Array.isArray(m.tags) ? m.tags : [],
            author: m.author || "Autor desconocido",
            rating: m.rating || "safe",
          };
        });

        setMangas(formattedMangas);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error al obtener mangas:", error);
        setMangas([]);
        setTotalPages(1);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const toggleTag = (tagId: string) => {
    const validTags = Object.values(TAG_DICTIONARY);
    const isValid = validTags.includes(tagId);

    if (!isValid) return;

    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId],
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
    setCurrentPage(1);
    setSortBy("latestUploadedChapter");
    setStatus("all");
  };

  return {
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
  };
}

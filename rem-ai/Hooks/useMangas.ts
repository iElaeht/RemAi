import { useState, useCallback } from "react";
import { TAG_DICTIONARY } from "@/data/tagDictionary";
import { SortOption, StatusOption } from "@/types/mangadex";
import { getProxiedImageUrl } from "@/utils/image"; // <--- Importamos la utilidad unificada

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
  author?: string;
  rating?: string;
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
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  status: StatusOption;
  setStatus: (val: StatusOption) => void;
}

export function useMangas(): UseMangasReturn {
  const [mangas, setMangas] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [sortBy, setSortBy] = useState<SortOption>("rating");
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
            cover: getProxiedImageUrl(m.cover || ""), // <--- Aplicamos el proxy aquí
            genres: Array.isArray(m.tags) ? m.tags : [],
            author: m.author || "Autor desconocido",
            rating: m.rating || "0.0",
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
    setSortBy("rating");
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
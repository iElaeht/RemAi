"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Filter,
  X,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from "lucide-react";
import { CATEGORIES } from "@/data/tagDictionary";
import { tagToSlug } from "@/service/tagService";
import SystemFilters from "./SystemFilters";
import { SortOption, StatusOption } from "@/types/mangadex";

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
  onSearch: () => void;
  onClear: () => void;
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  status: StatusOption;
  setStatus: (val: StatusOption) => void;
}

export default function SearchFilter({
  searchQuery,
  setSearchQuery,
  selectedTags,
  onSearch,
  onClear,
  sortBy,
  setSortBy,
  status,
  setStatus,
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>("Géneros");
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  // Asegurar por defecto "rating" (Mejor valorado) si no viene definido
  useEffect(() => {
    if (!sortBy) {
      setSortBy("rating");
    }
  }, [sortBy, setSortBy]);

  // Detectar si estamos en /mangas o /manhwas
  const currentBasePath = pathname.startsWith("/manhwas") ? "/manhwas" : "/mangas";
  const isManhwa = currentBasePath === "/manhwas";
  const contentTypeName = isManhwa ? "manhwa" : "manga";

  // Paletas de diseño exclusivas para cada sección
  const theme = isManhwa
    ? {
        boxBg: "bg-[#170a0d]",
        boxBorder: "border-red-500/10",
        ring: "ring-red-500/40",
        textHover: "hover:text-red-400",
        bgActive: "bg-red-500/20 text-red-500",
        tagActive: "bg-red-600 text-white font-bold",
        badgeBg: "bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white",
        dropdownBg: "bg-[#1f0c11]",
        activeText: "text-red-500",
      }
    : {
        boxBg: "bg-[#0e1422]",
        boxBorder: "border-white/10",
        ring: "ring-pink-500/40",
        textHover: "hover:text-pink-400",
        bgActive: "bg-pink-500/20 text-pink-500",
        tagActive: "bg-pink-500 text-white font-bold",
        badgeBg: "bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white",
        dropdownBg: "bg-[#131b2e]",
        activeText: "text-pink-500",
      };

  const isCategoryRoute =
    pathname.includes(`${currentBasePath}/`) && pathname.split("/").length > 3;
  const isFiltering =
    selectedTags.length > 0 || searchQuery.length > 0 || isCategoryRoute;

  const handleSearchClick = () => {
    onSearch();
    setIsFilterOpen(false);
  };

  const handleClear = () => {
    onClear();
    router.push(currentBasePath);
    setIsFilterOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        handleSearchClick();
      } else {
        handleClear();
      }
    }
  };

  const getActiveFilterInfo = () => {
    const parts = pathname.split("/");
    const currentTagId = parts[2];
    for (const [catName, tags] of Object.entries(CATEGORIES)) {
      const tagName = Object.keys(tags).find(
        (key) => tags[key as keyof typeof tags] === currentTagId,
      );
      if (tagName) return { catName, tagName };
    }
    return null;
  };

  const activeInfo = isCategoryRoute ? getActiveFilterInfo() : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTagClick = (tagId: string, tagName: string) => {
    router.push(`${currentBasePath}/${tagId}/${tagToSlug(tagName)}`);
    setIsFilterOpen(false);
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto mt-8 mb-12">
      <div
        className={`${theme.boxBg} rounded-2xl border ${theme.boxBorder} shadow-2xl overflow-hidden transition-all duration-300 ${
          isFilterOpen ? `ring-1 ${theme.ring}` : ""
        }`}
      >
        {/* --- CABECERA: Buscador y Controles --- */}
        <div className="flex items-center p-2">
          <div className="pl-3 text-neutral-400">
            <Search size={20} />
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Buscar ${contentTypeName}...`}
            className="w-full bg-transparent p-4 outline-none text-white placeholder:text-neutral-500 text-sm"
          />

          {/* Botón de Ejecutar Búsqueda */}
          <button
            onClick={handleSearchClick}
            disabled={!searchQuery}
            className={`p-2 mr-1 transition-all rounded-lg ${
              searchQuery
                ? `text-neutral-300 hover:text-white hover:bg-white/5 cursor-pointer`
                : "text-neutral-700 cursor-default"
            }`}
            title="Buscar"
          >
            <ArrowRight size={18} />
          </button>

          {/* Botón de Borrar Input */}
          <button
            onClick={() => setSearchQuery("")}
            className={`p-2 transition-colors cursor-pointer ${
              searchQuery
                ? "text-neutral-300 hover:text-white"
                : "text-neutral-700"
            }`}
          >
            <X size={18} />
          </button>

          {/* Botón de Abrir/Cerrar Menú de Filtros */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-3 rounded-xl transition-all cursor-pointer ${
              isFilterOpen
                ? theme.bgActive
                : `text-neutral-400 ${theme.textHover}`
            }`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* --- ESTADO DE FILTROS ACTIVOS --- */}
        {isFiltering && (
          <div className={`px-4 py-3 border-t border-white/5 flex justify-between items-center ${theme.dropdownBg}/50`}>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider truncate ${theme.activeText}`}
            >
              {activeInfo
                ? `Categoría : ${activeInfo.catName} | ${activeInfo.tagName}`
                : "Búsqueda Activa"}
            </span>
            <button
              onClick={handleClear}
              className={`text-[10px] px-3 py-1 rounded-lg transition-all font-bold ml-2 shrink-0 cursor-pointer ${theme.badgeBg}`}
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* --- PANEL DESPLEGABLE (Filtros y Categorías) --- */}
        {isFilterOpen && (
          <div className={`border-t border-white/5 ${theme.dropdownBg} animate-in slide-in-from-top-2`}>
            <SystemFilters
              sortBy={sortBy || "rating"}
              setSortBy={setSortBy}
              status={status}
              setStatus={setStatus}
              onFilterChange={() => setIsFilterOpen(false)}
            />

            {/* Mapeo de Categorías */}
            {Object.entries(CATEGORIES).map(([catName, tags]) => (
              <div key={catName} className="border-b border-white/5">
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === catName ? null : catName)
                  }
                  className={`w-full p-4 flex justify-between items-center text-xs font-bold text-neutral-400 uppercase ${theme.textHover} cursor-pointer`}
                >
                  <span>{catName}</span>
                  {openCategory === catName ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {openCategory === catName && (
                  <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(tags).map(([name, id]) => (
                      <button
                        key={id}
                        onClick={() => handleTagClick(id, name)}
                        className={`text-xs p-2 rounded-lg transition-all text-left truncate cursor-pointer ${
                          pathname.includes(id)
                            ? theme.tagActive
                            : "text-neutral-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
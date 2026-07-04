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

  const isCategoryRoute =
    pathname.includes("/library/") && pathname.split("/").length > 3;
  const isFiltering =
    selectedTags.length > 0 || searchQuery.length > 0 || isCategoryRoute;

  const handleSearchClick = () => {
    onSearch();
    setIsFilterOpen(false);
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
    router.push(`/library/${tagId}/${tagToSlug(tagName)}`);
    setIsFilterOpen(false); // Cierre automático al seleccionar género
  };

  const handleClear = () => {
    onClear();
    router.push("/library");
    setIsFilterOpen(false);
  };

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto mt-8 mb-12">
      <div
        className={`bg-[#111827] rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all ${
          isFilterOpen ? "ring-1 ring-pink-500/50" : ""
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
            onKeyDown={(e: KeyboardEvent) =>
              e.key === "Enter" && searchQuery && handleSearchClick()
            }
            placeholder="Buscar manga..."
            className="w-full bg-transparent p-4 outline-none text-white placeholder:text-neutral-600"
          />

          {/* Botón de Ejecutar Búsqueda: Habilitado solo con texto */}
          <button
            onClick={handleSearchClick}
            disabled={!searchQuery}
            className={`p-2 mr-1 transition-all rounded-lg ${
              searchQuery
                ? "text-neutral-300 hover:text-white hover:bg-white/5"
                : "text-neutral-700 cursor-default"
            }`}
            title="Buscar"
          >
            <ArrowRight size={18} />
          </button>

          {/* Botón de Borrar: Limpia el input */}
          <button
            onClick={() => setSearchQuery("")}
            className={`p-2 transition-colors ${
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
            className={`p-3 rounded-xl transition-all ${
              isFilterOpen
                ? "bg-pink-500/20 text-pink-500"
                : "text-neutral-400 hover:text-pink-500"
            }`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* --- ESTADO DE FILTROS ACTIVOS (Solo visible si hay filtrado) --- */}
        {isFiltering && (
          <div className="px-4 py-3 border-t border-white/5 flex justify-between items-center bg-[#0d1321]/50">
            <span className="text-[10px] text-pink-500 font-bold uppercase tracking-wider truncate">
              {activeInfo
                ? `Categoría : ${activeInfo.catName} | ${activeInfo.tagName}`
                : "Búsqueda Activa"}
            </span>
            <button
              onClick={handleClear}
              className="text-[10px] px-3 py-1 rounded-lg bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-all font-bold ml-2 shrink-0"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* --- PANEL DESPLEGABLE: Filtros de Sistema y Categorías --- */}
        {isFilterOpen && (
          <div className="border-t border-white/5 bg-[#0d1321] animate-in slide-in-from-top-2">
            {/* Se eliminó el div contenedor con onClick que causaba conflicto con los selectores internos */}
            <SystemFilters
              sortBy={sortBy}
              setSortBy={setSortBy}
              status={status}
              setStatus={setStatus}
            />

            {/* Mapeo de Categorías desde el Diccionario */}
            {Object.entries(CATEGORIES).map(([catName, tags]) => (
              <div key={catName} className="border-b border-white/5">
                <button
                  onClick={() =>
                    setOpenCategory(openCategory === catName ? null : catName)
                  }
                  className="w-full p-4 flex justify-between items-center text-xs font-bold text-neutral-400 uppercase hover:text-white"
                >
                  {catName}
                  {openCategory === catName ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>

                {/* Contenido de la categoría seleccionada */}
                {openCategory === catName && (
                  <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(tags).map(([name, id]) => (
                      <button
                        key={id}
                        onClick={() => handleTagClick(id, name)}
                        className={`text-xs p-2 rounded-lg transition-all text-left truncate ${
                          pathname.includes(id)
                            ? "bg-pink-500 text-white font-bold"
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

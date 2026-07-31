"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sparkles, BookOpen, Flame, ArrowUpDown, LayoutGrid, Menu, Check } from "lucide-react";

interface FavoritesFiltersProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
  totalCount: number;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const sortOptions = [
  { id: "recent", label: "Más recientes" },
  { id: "oldest", label: "Más antiguos" },
  { id: "az", label: "Alfabético (A - Z)" },
  { id: "za", label: "Alfabético (Z - A)" },
];

export default function FavoritesFilters({
  selectedType,
  setSelectedType,
  sortOrder,
  setSortOrder,
  totalCount,
  viewMode,
  setViewMode,
}: FavoritesFiltersProps) {
  
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentSortLabel = sortOptions.find((opt) => opt.id === sortOrder)?.label || "Ordenar";

  return (
    <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4 py-4 overflow-visible relative z-30">
      
      {/* Filtros por tipo */}
      <div className="grid grid-cols-3 sm:flex sm:items-center gap-2 bg-[#141226]/80 p-2 border border-violet-500/10 rounded-2xl shadow-lg backdrop-blur-md">
        <button
          onClick={() => setSelectedType("all")}
          className={`flex items-center justify-center sm:justify-start gap-2 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
            selectedType === "all"
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20 border border-violet-400/30"
              : "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <Sparkles size={14} className={selectedType === "all" ? "text-white" : "text-violet-400"} />
          <span>Todos</span>
        </button>

        <button
          onClick={() => setSelectedType("manga")}
          className={`flex items-center justify-center sm:justify-start gap-2 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
            selectedType === "manga"
              ? "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md shadow-pink-500/20 border border-pink-400/30"
              : "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <BookOpen size={14} className={selectedType === "manga" ? "text-white" : "text-pink-400"} />
          <span>Mangas</span>
        </button>

        <button
          onClick={() => setSelectedType("manhwa")}
          className={`flex items-center justify-center sm:justify-start gap-2 py-2 sm:px-4 sm:py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer ${
            selectedType === "manhwa"
              ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-md shadow-red-500/20 border border-red-400/30"
              : "bg-transparent text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
          }`}
        >
          <Flame size={14} className={selectedType === "manhwa" ? "text-white" : "text-red-400"} />
          <span>Manhwas</span>
        </button>
      </div>

      {/* Contenedor derecho */}
      <div className="flex items-center justify-between gap-3 bg-[#141226]/80 px-4 py-2.5 sm:py-2 border border-violet-500/10 rounded-2xl shadow-lg backdrop-blur-md overflow-visible">
        <span className="text-xs text-neutral-400 whitespace-nowrap flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
          <strong className="text-white font-bold">{totalCount}</strong> obras
        </span>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Dropdown de ordenamiento con posicionamiento seguro */}
        <div className="relative overflow-visible" ref={dropdownRef}>
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 bg-transparent text-neutral-300 text-xs font-medium pl-2 pr-2 py-1 hover:text-white transition-colors cursor-pointer focus:outline-none"
          >
            <ArrowUpDown size={13} className="text-violet-400 flex-shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-none">{currentSortLabel}</span>
            <span className={`text-[10px] text-violet-400 transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {isSortOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#141226] border border-violet-500/20 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {sortOptions.map((option) => {
                const isSelected = sortOrder === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortOrder(option.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-all cursor-pointer text-left ${
                      isSelected
                        ? "text-violet-300 bg-violet-500/15 font-semibold"
                        : "text-neutral-400 hover:text-white hover:bg-white/5 font-medium"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check size={13} className="text-violet-400" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="h-4 w-[1px] bg-white/10" />

        {/* Botón de vista */}
        <button
          onClick={toggleViewMode}
          title={viewMode === "grid" ? "Cambiar a vista de lista" : "Cambiar a vista de cuadrícula"}
          className="relative p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 hover:border-violet-500/40 transition-all duration-300 active:scale-95 cursor-pointer flex items-center justify-center overflow-hidden group shadow-sm"
        >
          <div className="relative w-4 h-4 flex items-center justify-center">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
                viewMode === "grid"
                  ? "rotate-0 scale-100 opacity-100"
                  : "rotate-90 scale-50 opacity-0"
              }`}
            >
              <LayoutGrid size={16} />
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
                viewMode === "list"
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-50 opacity-0"
              }`}
            >
              <Menu size={16} />
            </span>
          </div>
        </button>

      </div>

    </div>
  );
}
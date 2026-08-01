"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FavoritesPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function FavoritesPagination({
  currentPage,
  totalPages,
  onPageChange,
}: FavoritesPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between sm:justify-center gap-4 mt-8 pt-4 border-t border-white/5 px-2 sm:px-0">
      {/* Botón Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-300 text-xs font-semibold hover:border-sky-500/50 hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Página anterior"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      {/* Indicador de páginas */}
      <span className="text-xs text-neutral-400 font-medium whitespace-nowrap">
        Página <strong className="text-neutral-200">{currentPage}</strong> de{" "}
        <strong className="text-neutral-200">{totalPages}</strong>
      </span>

      {/* Botón Siguiente */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-neutral-900/80 border border-white/10 text-neutral-300 text-xs font-semibold hover:border-sky-500/50 hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        aria-label="Página siguiente"
      >
        <span className="hidden sm:inline">Siguiente</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, disabled }: PaginationProps) {
  
  // Lógica más agresiva para móvil: mostrar solo inicio, final y cercanía
  const getVisiblePages = () => {
    const pages = [1]; // Siempre incluimos el 1
    if (currentPage > 3) pages.push(-1); // -1 representará '...'
    
    // Páginas cercanas a la actual
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push(-2); // -2 representará '...'
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-1 py-6 text-neutral-400">
      <button 
        disabled={currentPage === 1 || disabled} 
        onClick={() => onPageChange(currentPage - 1)} 
        className="p-2 hover:text-white transition disabled:opacity-20"
      >
        <ChevronLeft size={20} />
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          disabled={page < 0 || disabled || page === currentPage}
          onClick={() => page > 0 && onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition ${
            currentPage === page 
              ? 'bg-pink-500 text-white font-bold' 
              : page < 0 
                ? 'cursor-default' 
                : 'hover:bg-white/10 hover:text-white'
          }`}
        >
          {page < 0 ? '...' : page}
        </button>
      ))}

      <button 
        disabled={currentPage >= totalPages || disabled} 
        onClick={() => onPageChange(currentPage + 1)} 
        className="p-2 hover:text-white transition disabled:opacity-20"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
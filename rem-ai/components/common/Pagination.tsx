'use client';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, disabled }: PaginationProps) {
  const pathname = usePathname();
  const isManhwa = pathname.startsWith("/manhwas");
  const isManga = pathname.startsWith("/mangas");
  const isDiscover = pathname.startsWith("/discover");

  // Configuración de temas y colores dinámicos
  const theme = isManhwa
    ? {
        activeBg: "bg-red-500",
        btnHover: "hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400",
        activeText: "text-red-400",
      }
    : isManga
    ? {
        activeBg: "bg-pink-500",
        btnHover: "hover:bg-pink-500/10 hover:border-pink-500/30 hover:text-pink-400",
        activeText: "text-pink-400",
      }
    : isDiscover
    ? {
        activeBg: "bg-violet-600",
        btnHover: "hover:bg-violet-500/10 hover:border-violet-500/30 hover:text-violet-400",
        activeText: "text-violet-400",
      }
    : {
        activeBg: "bg-sky-500",
        btnHover: "hover:bg-sky-500/10 hover:border-sky-500/30 hover:text-sky-400",
        activeText: "text-sky-400",
      };

  const handlePageChange = (page: number) => {
    onPageChange(page);
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 150); 
  };

  const getVisiblePages = () => {
    const pages = [1];
    if (currentPage > 3) pages.push(-1);
    
    // Hacemos que en web muestre un rango un poco más extenso (de -2 a +2 para que se vea más nutrido)
    for (let i = Math.max(2, currentPage - 2); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }
    
    if (currentPage < totalPages - 3) pages.push(-2);
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-3 py-8 text-neutral-400 select-none">
      
      {/* Botón Anterior */}
      <button 
        disabled={currentPage === 1 || disabled} 
        onClick={() => handlePageChange(currentPage - 1)} 
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-200 ${theme.btnHover} disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/5 disabled:hover:text-neutral-400 disabled:cursor-not-allowed cursor-pointer shadow-sm`}
        title="Anterior"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline text-xs font-medium">Anterior</span>
      </button>

      {/* --- Versión Desktop (Más extensa y detallada) --- */}
      <div className="hidden sm:flex items-center gap-1.5 mx-2 bg-white/[0.02] border border-white/5 p-1.5 rounded-2xl shadow-inner">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            disabled={page < 0 || disabled || page === currentPage}
            onClick={() => page > 0 && handlePageChange(page)}
            className={`w-9 h-9 flex items-center justify-center rounded-xl text-xs font-medium transition-all ${
              currentPage === page 
                ? `${theme.activeBg} text-white font-bold shadow-md scale-105` 
                : page < 0 
                  ? 'cursor-default text-neutral-600' 
                  : 'hover:bg-white/10 hover:text-white cursor-pointer'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {page < 0 ? '...' : page}
          </button>
        ))}
      </div>

      {/* --- Versión Móvil (Compacta n / total que te gustó) --- */}
      <div className="flex sm:hidden items-center gap-2 mx-1 bg-white/[0.02] border border-white/5 px-4 py-2.5 rounded-xl">
        <span className={`text-sm font-bold ${theme.activeText}`}>{currentPage}</span>
        <span className="text-xs text-neutral-600">/</span>
        <span className="text-xs font-medium text-neutral-400">{totalPages}</span>
      </div>

      {/* Botón Siguiente */}
      <button 
        disabled={currentPage >= totalPages || disabled} 
        onClick={() => handlePageChange(currentPage + 1)} 
        className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/5 transition-all duration-200 ${theme.btnHover} disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-white/5 disabled:hover:text-neutral-400 disabled:cursor-not-allowed cursor-pointer shadow-sm`}
        title="Siguiente"
      >
        <span className="hidden sm:inline text-xs font-medium">Siguiente</span>
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
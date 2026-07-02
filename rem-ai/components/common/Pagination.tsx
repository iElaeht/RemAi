'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, disabled }: PaginationProps) {
  
  const handlePageChange = (page: number) => {
    onPageChange(page);
    // Un pequeño retraso para asegurar que el nuevo contenido renderice antes de subir
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
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i > 1 && i < totalPages) pages.push(i);
    }
    
    if (currentPage < totalPages - 2) pages.push(-2);
    if (totalPages > 1) pages.push(totalPages);
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-6 text-neutral-400">
      
      {/* Botón Anterior (Rem) - Asegúrate de que este archivo sea 'rem-left.png' */}
      <button 
        disabled={currentPage === 1 || disabled} 
        onClick={() => handlePageChange(currentPage - 1)} 
        className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        <img 
          src="/images/nav/rem-left.png" 
          alt="Anterior" 
          className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]" 
        />
      </button>

      {/* Números de página */}
      <div className="flex gap-1 mx-2">
        {getVisiblePages().map((page, index) => (
          <button
            key={index}
            disabled={page < 0 || disabled || page === currentPage}
            onClick={() => page > 0 && handlePageChange(page)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs transition ${
              currentPage === page 
                ? 'bg-pink-500 text-white font-bold' 
                : page < 0 
                  ? 'cursor-default' 
                  : 'hover:bg-white/10 hover:text-white cursor-pointer'
            } ${disabled ? 'cursor-not-allowed' : ''}`}
          >
            {page < 0 ? '...' : page}
          </button>
        ))}
      </div>

      {/* Botón Siguiente (Ram) - Se mantiene como 'ram-right.png' */}
      <button 
        disabled={currentPage >= totalPages || disabled} 
        onClick={() => handlePageChange(currentPage + 1)} 
        className="transition-transform hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        <img 
          src="/images/nav/ram-right.png" 
          alt="Siguiente" 
          className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(244,114,182,0.4)]" 
        />
      </button>
    </div>
  );
}
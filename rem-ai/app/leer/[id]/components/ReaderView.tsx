'use client';
import { useState, useRef, useEffect } from 'react';

interface ReaderViewProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  onNextChapter?: () => void;
}

export default function ReaderView({ pages, baseUrl, hash, onNextChapter }: ReaderViewProps) {
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'z') setIsZoomed((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      const currentProgress = totalScrollable > 0 ? (scrollLeft / totalScrollable) * 100 : 0;
      setProgress(currentProgress);
      const pageIndex = Math.round(scrollLeft / clientWidth);
      setCurrentPage(pageIndex + 1);
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0a0f1a] flex flex-col select-none">
      
      {/* UI SUPERIOR */}
      <div className="w-full h-16 flex flex-col items-center justify-center bg-[#0a0f1a]/90 backdrop-blur-sm gap-1.5 shrink-0 z-50 sticky top-0 border-b border-white/5">
        <span className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          Página {currentPage} / {pages.length} | {isZoomed ? 'MODO ZOOM' : 'LECTURA'}
        </span>
        <div className="w-1/3 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Carrusel de Imágenes */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        // Si estamos haciendo zoom (isZoomed) o pellizcando (isPinching), desactivamos el snap y el scroll forzado
        className={`flex-1 w-full flex flex-row ${
          isZoomed || isPinching ? 'overflow-auto' : 'overflow-x-auto overflow-y-hidden snap-x snap-mandatory'
        } scroll-smooth no-scrollbar`}
        // Detectamos gestos de más de un dedo para bloquear el carrusel y permitir el zoom nativo
        onTouchStart={(e) => { if (e.touches.length > 1) setIsPinching(true); }}
        onTouchEnd={() => setIsPinching(false)}
        style={{ touchAction: 'pan-x pinch-zoom' }}
      >
        {pages.map((page: string, idx: number) => (
          <div 
            key={idx} id={`page-${idx}`}
            className={`min-w-full h-full flex justify-center pt-4 pb-2 snap-center transition-all ${isZoomed ? 'items-start' : 'items-center'}`}
            onClick={(e) => {
              if (isZoomed) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const isRight = e.clientX > rect.left + rect.width / 2;
              
              if (isRight) {
                if (idx === pages.length - 1) onNextChapter?.();
                else document.getElementById(`page-${idx + 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
              } else {
                document.getElementById(`page-${idx - 1}`)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
              }
            }}
          >
            <div className={`relative ${isZoomed ? 'w-[95%] mt-4' : 'h-[85vh] w-auto'}`}>
              <img
                src={`/api/proxy/pages?url=${encodeURIComponent(`${baseUrl}/data/${hash}/${page}`)}`}
                className={`
                  shadow-2xl transition-all duration-300 ease-in-out select-none
                  ${isZoomed ? 'w-full h-auto cursor-zoom-out' : 'h-full w-auto cursor-zoom-in'}
                  object-contain
                `}
                alt={`Página ${idx + 1}`}
                draggable="false"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
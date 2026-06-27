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
  const containerRef = useRef<HTMLDivElement>(null);

  // EFECTO: Reseteo de scroll al cambiar de capítulo
  useEffect(() => {
    const timer = setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTo({ left: 0, behavior: 'auto' });
      }
    }, 100);
    return () => {
    document.body.style.overflow = 'auto';
    clearTimeout(timer);
  };
  }, [hash]);

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
    <div className="relative w-full h-screen bg-[#0a0f1a] flex flex-col">
      {/* Carrusel de Imágenes */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 w-full flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth no-scrollbar"
      >
        {pages.map((page: string, idx: number) => (
          <div 
            key={idx} id={`page-${idx}`}
            className="min-w-full h-full flex justify-center items-center snap-center p-2"
            onClick={(e) => {
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
            <img
              src={`${baseUrl}/data/${hash}/${page}`}
              className="max-h-[90vh] w-auto object-contain shadow-2xl"
              alt={`Página ${idx + 1}`}
            />
          </div>
        ))}
      </div>

      {/* --- UI INFERIOR --- */}
      <div className="w-full h-10 flex flex-col items-center justify-center bg-[#0a0f1a] gap-0.5 shrink-0 -mt-2">
        <span className="text-gray-500 text-[10px] font-medium tracking-[0.2em] uppercase">
          Página {currentPage} / {pages.length}
        </span>
        
        <div className="w-1/4 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pink-500 rounded-full transition-all duration-100" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>
    </div>
  );
}
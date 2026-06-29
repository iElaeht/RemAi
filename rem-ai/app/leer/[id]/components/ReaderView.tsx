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
  // Nuevo estado para el zoom móvil
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Si queremos bloquear el zoom nativo del navegador para usar el nuestro propio
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault();
    };
    document.addEventListener('gesturestart', (e) => e.preventDefault());
    return () => document.removeEventListener('gesturestart', (e) => e.preventDefault());
  }, []);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setProgress(progress || 0);
      setCurrentPage(Math.round(scrollLeft / clientWidth) + 1);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#0a0f1a] flex flex-col overflow-hidden select-none">
      
      {/* Carrusel de Imágenes */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        // IMPORTANTE: Aquí permitimos el scroll, pero la imagen es la que se encarga del resto
        className="flex-1 w-full flex flex-row overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ touchAction: scale > 1 ? 'none' : 'pan-x' }}
      >
        {pages.map((page: string, idx: number) => {
          const imageUrl = (baseUrl && hash && page) 
            ? `/api/proxy/pages?url=${encodeURIComponent(`${baseUrl}/data/${hash}/${page}`)}`
            : null;

          return (
            <div key={idx} className="min-w-full h-full flex justify-center items-center snap-center">
              {imageUrl ? (
                <div 
                  className="h-[95vh] w-auto flex items-center justify-center transition-transform duration-200"
                  style={{ transform: `scale(${scale})` }}
                >
                  <img
                    src={imageUrl}
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    alt={`Página ${idx + 1}`}
                    // Doble toque para hacer zoom
                    onDoubleClick={() => setScale(scale > 1 ? 1 : 2)}
                  />
                </div>
              ) : (
                <div className="text-gray-500">Cargando...</div>
              )}
            </div>
          );
        })}
      </div>

      {/* UI Inferior */}
      <div className="w-full h-10 flex flex-col items-center justify-center bg-[#0a0f1a] z-50">
        <span className="text-gray-500 text-[10px] uppercase tracking-widest">
           Pág {currentPage} - Doble toque para Zoom
        </span>
      </div>
    </div>
  );
}
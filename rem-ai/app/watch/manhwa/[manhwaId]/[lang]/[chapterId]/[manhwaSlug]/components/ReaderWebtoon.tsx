"use client";

import { useEffect, useRef } from "react";

interface ReaderWebtoonProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export default function ReaderWebtoon({
  pages,
  baseUrl,
  hash,
  onNextChapter,
  onPrevChapter,
}: ReaderWebtoonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll al inicio al cambiar de capítulo/hash de forma limpia
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [hash]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    
    // Opcional: Detectar si llegó al final del capítulo
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      // onNextChapter?.();
    }
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-full overflow-y-auto bg-[#0a0f1a] flex flex-col items-center select-none custom-scrollbar"
    >
      {/* Contenedor con ancho optimizado para Webtoon */}
      <div className="w-full max-w-3xl flex flex-col items-center bg-black">
        {pages?.map((page: string, idx: number) => (
          <div key={idx} className="w-full flex justify-center leading-none">
            <img
              src={`/api/proxy/pages?url=${encodeURIComponent(`${baseUrl}/data/${hash}/${page}`)}`}
              alt={`Página ${idx + 1}`}
              draggable="false"
              loading="lazy"
              className="w-full h-auto object-contain block m-0 p-0"
            />
          </div>
        ))}
      </div>

      {/* Botones de navegación inferior */}
      <div className="w-full max-w-3xl py-10 flex items-center justify-between px-6 bg-[#0a0f1a]">
        <button
          type="button"
          onClick={onPrevChapter}
          className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition-all cursor-pointer"
        >
          ← Capítulo Anterior
        </button>
        <button
          type="button"
          onClick={onNextChapter}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-900/30"
        >
          Capítulo Siguiente →
        </button>
      </div>
    </div>
  );
}
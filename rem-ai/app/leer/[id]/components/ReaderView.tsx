'use client';
import { useRef, useState } from 'react';

interface ReaderViewProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  onPageChange?: (index: number) => void;
  onNextChapter?: () => void;
}

export default function ReaderView({ pages, baseUrl, hash, onPageChange, onNextChapter }: ReaderViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Estado para verificar si la imagen ya cargó y así no tener saltos visuales
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const handleZoneClick = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const isLeft = clickX < rect.width / 2;

    if (!isLeft) {
      if (idx === pages.length - 1) {
        onNextChapter?.();
      } else {
        document.getElementById(`page-${idx + 1}`)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      document.getElementById(`page-${idx - 1}`)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center overflow-y-auto py-8">
      {pages.map((page: string, idx: number) => (
        <div 
          key={idx} 
          id={`page-${idx}`}
          // "min-h-[90vh]" asegura que la imagen siempre ocupe el foco principal
          // "mb-20" crea esa separación amplia para que no veas la imagen de arriba/abajo
          className="page-item w-full min-h-[90vh] flex justify-center items-center relative group mb-20"
          onClick={(e) => handleZoneClick(e, idx)}
        >
          <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" />
          <div className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-pointer" />

          {/* Renderizado optimizado */}
          <img
            src={`${baseUrl}/data/${hash}/${page}`}
            alt={`Página ${idx + 1}`}
            // La transición ayuda a que el ojo no note el cambio de "vacio" a "imagen"
            className={`max-h-[90vh] w-auto object-contain transition-opacity duration-300 ${loaded[idx] ? 'opacity-100' : 'opacity-0'}`}
            // Cargamos las 3 primeras de golpe, las demás esperan al scroll
            loading={idx < 3 ? "eager" : "lazy"}
            onLoad={() => setLoaded(prev => ({ ...prev, [idx]: true }))}
          />
        </div>
      ))}
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";

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

  // Manejo de atajos de teclado para el lector Webtoon
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      const container = containerRef.current;
      if (!container) return;

      const scrollAmount = window.innerHeight * 0.75; // Distancia de scroll con espacio o flechas

      switch (e.key) {
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          container.scrollBy({ top: 150, behavior: "smooth" });
          break;

        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          container.scrollBy({ top: -150, behavior: "smooth" });
          break;

        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          onNextChapter?.();
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          onPrevChapter?.();
          break;

        case " ": // Barra espaciadora para lectura fluida de webtoon
          e.preventDefault();
          if (e.shiftKey) {
            // Si está al inicio y presiona Shift + Space, va al capítulo anterior
            if (container.scrollTop <= 10) {
              onPrevChapter?.();
            } else {
              container.scrollBy({ top: -scrollAmount, behavior: "smooth" });
            }
          } else {
            // Si llega al final del contenedor y presiona Space, avanza al siguiente capítulo
            if (
              container.scrollTop + container.clientHeight >=
              container.scrollHeight - 20
            ) {
              onNextChapter?.();
            } else {
              container.scrollBy({ top: scrollAmount, behavior: "smooth" });
            }
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNextChapter, onPrevChapter]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    // Lógica opcional para detectar fin de capítulo
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="w-full h-full overflow-y-auto bg-[#0a0f1a] flex flex-col items-center select-none custom-scrollbar"
    >
      {/* Contenedor con ancho optimizado para Webtoon */}
      <div className="w-full max-w-3xl flex flex-col items-center bg-black">
        {pages?.map((page: string, idx: number) => {
          const pageImageUrl = getImageUrl(`${baseUrl}/data/${hash}/${page}`);
          
          return (
            <div key={idx} className="w-full flex justify-center leading-none relative aspect-[auto]">
              <Image
                src={pageImageUrl}
                alt={`Página ${idx + 1}`}
                width={800} // Ajuste sugerido para base
                height={1200}
                unoptimized
                draggable="false"
                className="w-full h-auto object-contain block m-0 p-0"
                style={{ height: 'auto' }}
              />
            </div>
          );
        })}
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
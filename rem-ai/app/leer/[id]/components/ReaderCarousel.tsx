"use client";

import { useRef, useState, useEffect } from "react";
import { useZoom } from "@/Hooks/useZoom";

interface ReaderViewProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export default function ReaderView({
  pages,
  baseUrl,
  hash,
  onNextChapter,
  onPrevChapter,
}: ReaderViewProps) {
  const { isZoomed, setIsZoomed, offset, isTouch, handleInteraction, resetZoom } = useZoom();
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      setProgress(totalScrollable > 0 ? (scrollLeft / totalScrollable) * 100 : 0);
      setCurrentPage(Math.round(scrollLeft / clientWidth) + 1);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstPage = document.getElementById("page-0");
      if (firstPage) firstPage.scrollIntoView({ behavior: "instant", block: "start" });
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <div className="relative w-full min-h-screen bg-[#0a0f1a] flex flex-col select-none">
      {/* Header */}
      <div className={`w-full h-16 flex flex-col items-center justify-center bg-[#0a0f1a]/90 backdrop-blur-sm gap-1.5 shrink-0 z-50 top-0 border-b border-white/5 transition-opacity ${isZoomed ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <span className="text-gray-400 text-[10px] font-bold tracking-[0.2em] uppercase">
          Página {currentPage} / {pages?.length || 0}
        </span>
        <div className="w-1/3 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 transition-all duration-100" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ touchAction: "auto" }}
        className={`flex-1 w-full flex flex-row ${isZoomed ? "overflow-hidden" : "overflow-hidden snap-x snap-mandatory"} scroll-smooth `}
      >
        {pages?.map((page: string, idx: number) => {
          const isCurrentPageZoomed = isZoomed && currentPage === idx + 1;

          return (
            <div
              key={idx}
              id={`page-${idx}`}
              className={`flex justify-center transition-all duration-300 ${
                isCurrentPageZoomed
                  ? `fixed inset-0 z-[100] bg-[#0a0f1a] w-screen h-screen ${isTouch ? 'overflow-auto' : 'cursor-crosshair'}`
                  : "min-w-full h-full pt-10 pb-2 snap-center items-center cursor-default"
              }`}
              // Restauramos la interacción de seguimiento para Desktop
              onMouseMove={(e) => !isTouch && isCurrentPageZoomed && handleInteraction(e.clientX, e.clientY, e.currentTarget)}
              onClick={(e) => {
                if (isZoomed) { resetZoom(); return; }

                const rect = e.currentTarget.getBoundingClientRect();
                const zone = rect.width / 3;
                const relativeX = e.clientX - rect.left;

                if (relativeX <= zone) {
                  idx === 0 ? onPrevChapter?.() : document.getElementById(`page-${idx - 1}`)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                } else if (relativeX >= zone * 2) {
                  idx === pages.length - 1 ? onNextChapter?.() : document.getElementById(`page-${idx + 1}`)?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
                } 
                // Zoom dinámico solo en Desktop
                else if (!isTouch) {
                  setIsZoomed(true);
                }
              }}
            >
              <div className={`relative flex items-center justify-center ${isCurrentPageZoomed ? "w-full h-full" : ""}`}>
                <img
                  src={`/api/proxy/pages?url=${encodeURIComponent(`${baseUrl}/data/${hash}/${page}`)}`}
                  alt={`Página ${idx + 1}`}
                  draggable="false"
                  className={`object-contain select-none transition-transform duration-100 ease-linear ${
                    isCurrentPageZoomed && isTouch ? "w-[200%] max-w-none h-auto" : "max-h-[95dvh]"
                  }`}
                  style={{
                    transform: (isCurrentPageZoomed && !isTouch) 
                      ? `scale(1.8) translate(${50 - offset.x}%, ${50 - offset.y}%)` 
                      : "scale(1) translate(0%, 0%)",
                    pointerEvents: "none"
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
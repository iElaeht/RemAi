"use client";
import { useState, useEffect } from "react";
import { useZoom } from "@/Hooks/useZoom";

interface ReaderVerticalProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export default function ReaderVertical({
  pages,
  baseUrl,
  hash,
  onNextChapter,
  onPrevChapter,
}: ReaderVerticalProps) {
  const { isZoomed, setIsZoomed, offset, isTouch, handleInteraction, resetZoom } = useZoom();
  const [activeZoomIdx, setActiveZoomIdx] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstPage = document.getElementById("page-0");
      if (firstPage) firstPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  const handleCloseZoom = () => {
    resetZoom();
    setActiveZoomIdx(null);
    setIsZoomed(false);
  };

  return (
    <div className={`relative w-full min-h-screen bg-[#0a0f1a] flex flex-col select-none ${isZoomed ? "overflow-hidden" : ""}`}>
      <div className="w-full flex flex-col items-center">
        {pages?.map((page: string, idx: number) => {
          const isThisPageZoomed = isZoomed && activeZoomIdx === idx;
          const isDimmed = isZoomed && !isThisPageZoomed;

          return (
            <div
              key={idx}
              id={`page-${idx}`}
              className={`
                w-full flex items-center justify-center shrink-0 snap-start overflow-hidden relative transition-all duration-300
                ${isThisPageZoomed ? "fixed inset-0 z-[100] bg-[#0a0f1a] h-screen cursor-crosshair" : "h-[100dvh] cursor-default"}
                ${isDimmed ? "opacity-20 pointer-events-none" : "opacity-100"}
              `}
              style={{ touchAction: "auto" }}
              onMouseMove={(e) => !isTouch && isThisPageZoomed && handleInteraction(e.clientX, e.clientY, e.currentTarget)}
              onTouchMove={(e) => isThisPageZoomed && handleInteraction(e.touches[0].clientX, e.touches[0].clientY, e.currentTarget)}
              onClick={(e) => {
                if (isZoomed) {
                  handleCloseZoom();
                  return;
                }

                // Guardamos la referencia y posición ANTES del timeout
                const target = e.currentTarget;
                const clientX = e.clientX;
                
                target.scrollIntoView({ behavior: "smooth", block: "center" });

                setTimeout(() => {
                  const rect = target.getBoundingClientRect();
                  const zone = rect.width / 3;
                  const relativeX = clientX - rect.left;

                  if (relativeX <= zone) {
                    idx === 0 ? onPrevChapter?.() : document.getElementById(`page-${idx - 1}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  } else if (relativeX >= zone * 2) {
                    idx === pages.length - 1 ? onNextChapter?.() : document.getElementById(`page-${idx + 1}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
                  } else if (!isTouch) {
                    setActiveZoomIdx(idx);
                    setIsZoomed(true);
                  }
                }, 200);
              }}
            >
              <img
                src={`/api/proxy/pages?url=${encodeURIComponent(`${baseUrl}/data/${hash}/${page}`)}`}
                alt={`Página ${idx + 1}`}
                loading="lazy"
                draggable="false"
                className="max-h-[95dvh] object-contain select-none pointer-events-none transition-transform duration-100 ease-linear"
                style={{
                  transform: isThisPageZoomed
                    ? `scale(1.8) translate(${50 - offset.x}%, ${50 - offset.y}%)`
                    : "scale(1) translate(0%, 0%)",
                  WebkitTapHighlightColor: "transparent",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
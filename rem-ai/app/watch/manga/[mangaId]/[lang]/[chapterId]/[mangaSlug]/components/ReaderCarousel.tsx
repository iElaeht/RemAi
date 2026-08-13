"use client";

import { useRef, useState, useEffect } from "react";
import { useZoom } from "@/Hooks/useZoom";
import { Grid, X } from "lucide-react";
import Image from "next/image"; // <--- Importamos Image de Next.js
import { getImageUrl } from "@/utils/image"; // <--- Importamos el helper de imágenes

interface ReaderCarouselProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export default function ReaderCarousel({
  pages,
  baseUrl,
  hash,
  onNextChapter,
  onPrevChapter,
}: ReaderCarouselProps) {
  const {
    isZoomed,
    setIsZoomed,
    offset,
    isTouch,
    handleInteraction,
    resetZoom,
  } = useZoom();
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const totalScrollable = scrollWidth - clientWidth;
      setProgress(
        totalScrollable > 0 ? (scrollLeft / totalScrollable) * 100 : 0,
      );
      setCurrentPage(Math.round(scrollLeft / clientWidth) + 1);
    }
  };

  const jumpToPage = (index: number) => {
    const targetPage = document.getElementById(`page-${index}`);
    if (targetPage) {
      targetPage.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      setIsPageModalOpen(false);
    }
  };

  // Manejo de atajos de teclado para el carrusel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (isPageModalOpen && e.key === "Escape") {
        setIsPageModalOpen(false);
        return;
      }

      const currentIndex = currentPage - 1;

      switch (e.key) {
        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (isZoomed) return;
          if (currentIndex < pages.length - 1) {
            jumpToPage(currentIndex + 1);
          } else {
            onNextChapter?.();
          }
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (isZoomed) return;
          if (currentIndex > 0) {
            jumpToPage(currentIndex - 1);
          } else {
            onPrevChapter?.();
          }
          break;

        case "x":
        case "X":
          e.preventDefault();
          if (isZoomed) {
            resetZoom();
          } else if (!isTouch) {
            setIsZoomed(true);
          }
          break;

        case " ":
          e.preventDefault();
          if (isZoomed) break;
          if (e.shiftKey) {
            if (currentIndex > 0) {
              jumpToPage(currentIndex - 1);
            } else {
              onPrevChapter?.();
            }
          } else {
            if (currentIndex < pages.length - 1) {
              jumpToPage(currentIndex + 1);
            } else {
              onNextChapter?.();
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
  }, [
    currentPage,
    pages,
    isPageModalOpen,
    isZoomed,
    isTouch,
    onNextChapter,
    onPrevChapter,
  ]);

  useEffect(() => {
    if (isPageModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isPageModalOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstPage = document.getElementById("page-0");
      if (firstPage)
        firstPage.scrollIntoView({ behavior: "instant", block: "start" });
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  return (
    <div className="relative w-full min-h-screen bg-[#0a0f1a] flex flex-col select-none">
      {/* Header Interactivo del Carrusel */}
      <div
        className={`w-full h-16 flex flex-col items-center justify-center bg-[#0a0f1a]/90 backdrop-blur-md gap-1.5 shrink-0 z-50 top-0 border-b border-white/5 transition-opacity ${isZoomed ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <button
          onClick={() => setIsPageModalOpen(true)}
          className="group flex items-center gap-1.5 px-3 py-1 rounded-full transition-all cursor-pointer"
          title="Abrir selector rápido de páginas"
        >
          <span className="text-gray-300 group-hover:text-white text-[11px] font-bold tracking-[0.15em] uppercase transition-colors">
            Página {currentPage} / {pages?.length || 0}
          </span>
        </button>

        <div className="w-1/3 sm:w-1/4 h-0.5 bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Contenedor Principal de Páginas */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ touchAction: "auto" }}
        className={`flex-1 w-full flex flex-row ${isZoomed ? "overflow-hidden" : "overflow-hidden snap-x snap-mandatory"} scroll-smooth`}
      >
        {pages?.map((page: string, idx: number) => {
          const isCurrentPageZoomed = isZoomed && currentPage === idx + 1;
          const pageImageUrl = getImageUrl(`${baseUrl}/data/${hash}/${page}`);

          return (
            <div
              key={idx}
              id={`page-${idx}`}
              className={`flex justify-center transition-all duration-300 ${
                isCurrentPageZoomed
                  ? `fixed inset-0 z-[100] bg-[#0a0f1a] w-screen h-screen ${isTouch ? "overflow-auto" : "cursor-crosshair"}`
                  : "min-w-full h-full pt-10 pb-2 snap-center items-center cursor-default"
              }`}
              onMouseMove={(e) =>
                !isTouch &&
                isCurrentPageZoomed &&
                handleInteraction(e.clientX, e.clientY, e.currentTarget)
              }
              onClick={(e) => {
                if (isZoomed) {
                  resetZoom();
                  return;
                }

                const rect = e.currentTarget.getBoundingClientRect();
                const zone = rect.width / 3;
                const relativeX = e.clientX - rect.left;

                if (relativeX <= zone) {
                  idx === 0 ? onPrevChapter?.() : jumpToPage(idx - 1);
                } else if (relativeX >= zone * 2) {
                  idx === pages.length - 1
                    ? onNextChapter?.()
                    : jumpToPage(idx + 1);
                } else if (!isTouch) {
                  setIsZoomed(true);
                }
              }}
            >
              <div
                className={`relative flex items-center justify-center w-full ${isCurrentPageZoomed ? "h-full" : "h-[85vh] md:h-[92dvh]"}`}
              >
                <Image
                  src={pageImageUrl}
                  alt={`Página ${idx + 1}`}
                  fill
                  unoptimized
                  draggable="false"
                  className={`object-contain select-none transition-transform duration-100 ease-linear ${
                    isCurrentPageZoomed && isTouch
                      ? "w-[200%] max-w-none h-auto"
                      : ""
                  }`}
                  style={{
                    transform:
                      isCurrentPageZoomed && !isTouch
                        ? `scale(1.8) translate(${50 - offset.x}%, ${50 - offset.y}%)`
                        : "scale(1) translate(0%, 0%)",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal / Selector Rápido de Páginas */}
      {isPageModalOpen && (
        <div
          onClick={() => setIsPageModalOpen(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl bg-[#0e1422] border border-blue-500/30 shadow-2xl p-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Grid size={18} className="text-blue-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Seleccionar Página
                </h3>
              </div>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 grid grid-cols-5 sm:grid-cols-6 gap-2.5 pr-1 custom-scrollbar">
              {pages.map((_, idx) => {
                const isSelected = currentPage === idx + 1;
                return (
                  <button
                    key={idx}
                    onClick={() => jumpToPage(idx)}
                    className={`h-12 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center border cursor-pointer ${
                      isSelected
                        ? "bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40 scale-105"
                        : "bg-white/[0.03] border-white/5 text-neutral-300 hover:bg-white/10 hover:border-white/10 hover:text-white"
                    }`}
                  >
                    <span>{idx + 1}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/5 text-center">
              <span className="text-[11px] text-neutral-400">
                Página actual:{" "}
                <strong className="text-white">{currentPage}</strong> de{" "}
                {pages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

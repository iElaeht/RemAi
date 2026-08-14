"use client";
import { useState, useEffect, useRef } from "react";
import { useZoom } from "@/Hooks/useZoom";
import Image from "next/image";
import { getImageUrl } from "@/utils/image";

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
  const {
    isZoomed,
    setIsZoomed,
    offset,
    isTouch,
    handleInteraction,
    resetZoom,
  } = useZoom();
  const [activeZoomIdx, setActiveZoomIdx] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstPage = document.getElementById("page-0");
      if (firstPage)
        firstPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => clearTimeout(timer);
  }, [hash]);

  const handleCloseZoom = () => {
    resetZoom();
    setActiveZoomIdx(null);
    setIsZoomed(false);
  };

  // Detección de la página actual basada en el scroll vertical del contenedor
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const pageElements = pages.map((_, idx) =>
        document.getElementById(`page-${idx}`),
      );
      const containerRect = container.getBoundingClientRect();
      const scrollPosition = container.scrollTop + containerRect.height / 2;

      pageElements.forEach((el, idx) => {
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setCurrentIndex(idx);
          }
        }
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [pages]);

  // Manejo de atajos de teclado para el lector vertical
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
        case "s":
        case "S":
          e.preventDefault();
          if (isZoomed) return;
          if (currentIndex < pages.length - 1) {
            document
              .getElementById(`page-${currentIndex + 1}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            onNextChapter?.();
          }
          break;

        case "ArrowUp":
        case "w":
        case "W":
          e.preventDefault();
          if (isZoomed) return;
          if (currentIndex > 0) {
            document
              .getElementById(`page-${currentIndex - 1}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            onPrevChapter?.();
          }
          break;

        case "ArrowRight":
        case "d":
        case "D":
          e.preventDefault();
          if (currentIndex < pages.length - 1) {
            document
              .getElementById(`page-${currentIndex + 1}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            onNextChapter?.();
          }
          break;

        case "ArrowLeft":
        case "a":
        case "A":
          e.preventDefault();
          if (currentIndex > 0) {
            document
              .getElementById(`page-${currentIndex - 1}`)
              ?.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            onPrevChapter?.();
          }
          break;

        case "x":
        case "X":
          e.preventDefault();
          if (isZoomed) {
            handleCloseZoom();
          } else if (!isTouch) {
            setActiveZoomIdx(currentIndex);
            setIsZoomed(true);
          }
          break;

        case " ": // Barra espaciadora
          e.preventDefault();
          if (isZoomed) break;
          if (e.shiftKey) {
            if (currentIndex > 0) {
              document
                .getElementById(`page-${currentIndex - 1}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            } else {
              onPrevChapter?.();
            }
          } else {
            if (currentIndex < pages.length - 1) {
              document
                .getElementById(`page-${currentIndex + 1}`)
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
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
  }, [currentIndex, pages, isZoomed, isTouch, onNextChapter, onPrevChapter]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full bg-[#0a0f1a] flex flex-col select-none overflow-y-auto custom-scrollbar ${isZoomed ? "overflow-hidden" : ""}`}
    >
      <div className="w-full flex flex-col items-center">
        {pages?.map((page: string, idx: number) => {
          const isThisPageZoomed = isZoomed && activeZoomIdx === idx;
          const isDimmed = isZoomed && !isThisPageZoomed;
          const pageImageUrl = getImageUrl(`${baseUrl}/data/${hash}/${page}`);

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
              onMouseMove={(e) =>
                !isTouch &&
                isThisPageZoomed &&
                handleInteraction(e.clientX, e.clientY, e.currentTarget)
              }
              onTouchMove={(e) =>
                isThisPageZoomed &&
                handleInteraction(
                  e.touches[0].clientX,
                  e.touches[0].clientY,
                  e.currentTarget,
                )
              }
              onClick={(e) => {
                if (isZoomed) {
                  handleCloseZoom();
                  return;
                }

                const target = e.currentTarget;
                const clientX = e.clientX;

                target.scrollIntoView({ behavior: "smooth", block: "center" });

                setTimeout(() => {
                  const rect = target.getBoundingClientRect();
                  const zone = rect.width / 3;
                  const relativeX = clientX - rect.left;

                  if (relativeX <= zone) {
                    idx === 0
                      ? onPrevChapter?.()
                      : document
                          .getElementById(`page-${idx - 1}`)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                  } else if (relativeX >= zone * 2) {
                    idx === pages.length - 1
                      ? onNextChapter?.()
                      : document
                          .getElementById(`page-${idx + 1}`)
                          ?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                  } else if (!isTouch) {
                    setActiveZoomIdx(idx);
                    setIsZoomed(true);
                  }
                }, 200);
              }}
            >
              <div
                className={`relative w-full flex items-center justify-center ${isThisPageZoomed ? "h-full" : "h-[95dvh]"}`}
              >
                <Image
                  src={pageImageUrl}
                  alt={`Página ${idx + 1}`}
                  fill
                  unoptimized
                  loading="lazy"
                  draggable="false"
                  className="object-contain select-none pointer-events-none transition-transform duration-100 ease-linear"
                  style={{
                    transform: isThisPageZoomed
                      ? `scale(1.8) translate(${50 - offset.x}%, ${50 - offset.y}%)`
                      : "scale(1) translate(0%, 0%)",
                    WebkitTapHighlightColor: "transparent",
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
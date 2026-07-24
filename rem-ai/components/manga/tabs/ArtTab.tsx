"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { MangaCover } from "@/types/mangadex";

interface ArtTabProps {
  covers?: MangaCover[];
  mangaTitle?: string;
}

export default function ArtTab({ covers = [], mangaTitle = "Manga" }: ArtTabProps) {
  const [selectedLocale, setSelectedLocale] = useState<string | null>("ja");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCover, setSelectedCover] = useState<MangaCover | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        setSelectedCover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageError = (id: string) => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const handleDownload = async (cover: MangaCover, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(cover.imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const safeTitle = mangaTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const volText = cover.volume ? `Vol_${cover.volume}` : "Art";
      link.download = `RemCoverArt_${safeTitle}_${volText}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
      window.open(cover.imageUrl, "_blank");
    }
  };

  if (!covers || covers.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center text-gray-400 text-xs sm:text-sm bg-[#121929] rounded-2xl border border-white/5">
        No hay portadas o artes disponibles para este manga.
      </div>
    );
  }

  const availableLocales = Array.from(
    new Set(covers.map((c) => c.locale).filter(Boolean))
  ) as string[];

  const filteredCovers = selectedLocale
    ? covers.filter((c) => c.locale === selectedLocale)
    : covers;

  const localeNames: Record<string, string> = {
    ja: "Japonés (Original)",
    en: "Inglés",
    es: "Español",
    ko: "Coreano",
    zh: "Chino",
  };

  const currentLabel = selectedLocale
    ? localeNames[selectedLocale] || selectedLocale.toUpperCase()
    : "Limpiar (Todas)";

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 px-1">
        <div>
          <h3 className="text-white font-bold text-sm sm:text-base">Portadas y Volúmenes</h3>
          <span className="text-xs text-gray-400 font-medium">
            Mostrando {filteredCovers.length} de {covers.length} imágenes
          </span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer flex items-center justify-between w-48 px-4 py-2.5 bg-[#121929] border border-white/10 hover:border-white/20 rounded-xl text-xs sm:text-sm font-bold text-white shadow-md transition-all duration-300"
          >
            <span className="truncate">{currentLabel}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#121929] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20 py-1">
              {availableLocales.map((loc) => {
                const isSelected = selectedLocale === loc;
                return (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocale(loc);
                      setIsOpen(false);
                    }}
                    className={`cursor-pointer w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left transition-colors ${
                      isSelected
                        ? "text-pink-500 font-bold bg-white/[0.04]"
                        : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  >
                    <span>{localeNames[loc] || loc.toUpperCase()}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}

              <div className="h-[1px] bg-white/10 my-1" />

              <button
                onClick={() => {
                  setSelectedLocale(null);
                  setIsOpen(false);
                }}
                className={`cursor-pointer w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm text-left transition-colors ${
                  selectedLocale === null
                    ? "text-pink-500 font-bold bg-white/[0.04]"
                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                }`}
              >
                <span>Limpiar (Todas)</span>
                {selectedLocale === null && (
                  <svg className="w-4 h-4 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {filteredCovers.map((cover) => {
          const hasError = imageErrors[cover.id];
          return (
            <div
              key={cover.id}
              onClick={() => setSelectedCover(cover)}
              className="flex flex-col bg-[#121929] rounded-xl border border-white/5 overflow-hidden group hover:border-white/15 transition-all duration-300 shadow-md cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full bg-gray-800 overflow-hidden">
                {!hasError ? (
                  <Image
                    src={cover.imageUrl}
                    alt={`Volumen ${cover.volume}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500"
                    onError={() => handleImageError(cover.id)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-[10px] text-neutral-500 text-center p-2">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="p-3 text-center bg-[#121929] flex flex-col gap-0.5">
                <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                  {cover.volume === "Extra" ? "Extra / Art" : `Volumen ${cover.volume}`}
                </span>
                {cover.locale && (
                  <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    [{cover.locale}]
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedCover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div
            ref={modalContentRef}
            className="relative flex flex-col items-center justify-center max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-14 right-0 flex items-center gap-2 z-50">
              <button
                onClick={(e) => handleDownload(selectedCover, e)}
                title="Descargar imagen"
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button
                onClick={() => setSelectedCover(null)}
                title="Cerrar"
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative w-[300px] sm:w-[400px] md:w-[450px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-black/40">
              <Image
                src={selectedCover.imageUrl}
                alt={`Volumen ${selectedCover.volume}`}
                fill
                className="object-contain"
              />
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-sm font-bold text-white">
                {selectedCover.volume === "Extra" ? "Extra / Art" : `Volumen ${selectedCover.volume}`}
              </span>
              {selectedCover.locale && (
                <span className="text-xs text-gray-400 uppercase ml-2">
                  [{selectedCover.locale}]
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
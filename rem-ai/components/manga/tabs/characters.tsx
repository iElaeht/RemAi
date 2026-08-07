// components/manga/tabs/characters.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { AniListCharacter } from "@/types/mangadex";

interface CharactersTabProps {
  characters?: AniListCharacter[];
  mangaTitle?: string;
}

export default function CharactersTab({ characters = [], mangaTitle = "Character" }: CharactersTabProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<AniListCharacter | null>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target as Node)) {
        setSelectedCharacter(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDownload = async (char: AniListCharacter, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(char.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      const safeTitle = mangaTitle.replace(/[^a-zA-Z0-9]/g, "_");
      const safeName = char.name.replace(/[^a-zA-Z0-9]/g, "_");
      link.download = `Character_${safeTitle}_${safeName}.jpg`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar la imagen:", error);
      window.open(char.image, "_blank");
    }
  };

  if (!characters || characters.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center text-gray-400 text-xs sm:text-sm bg-[#121929] rounded-2xl border border-white/5">
        No hay información de personajes disponible.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-white font-bold text-sm sm:text-base">Personajes :</h3>
        <span className="text-xs text-gray-400 font-medium">{characters.length} personajes</span>
      </div>

      {/* Cuadrícula estilo AniList */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            onClick={() => setSelectedCharacter(char)}
            className="flex items-center bg-[#121929] rounded-xl border border-white/5 p-2.5 gap-3 hover:border-white/15 transition-all duration-300 shadow-md overflow-hidden group cursor-pointer"
          >
            {/* Imagen del personaje (Estática sin zoom) */}
            <div className="relative w-14 h-16 sm:w-16 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={char.image}
                alt={char.name}
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover"
              />
            </div>

            {/* Información del personaje */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h4 
                className="text-white font-bold text-xs sm:text-sm truncate group-hover:text-blue-400 transition-colors"
                title={char.name}
              >
                {char.name}
              </h4>
              <span className="inline-block mt-1 text-[10px] sm:text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {char.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Estilo ArtTab */}
      {selectedCharacter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div
            ref={modalContentRef}
            className="relative flex flex-col items-center justify-center max-w-[90vw] max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute -top-14 right-0 flex items-center gap-2 z-50">
              <button
                onClick={(e) => handleDownload(selectedCharacter, e)}
                title="Descargar imagen"
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              <button
                onClick={() => setSelectedCharacter(null)}
                title="Cerrar"
                className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors flex items-center justify-center cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="relative w-[300px] sm:w-[350px] md:w-[400px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl bg-black/40">
              <Image
                src={selectedCharacter.image}
                alt={selectedCharacter.name}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="mt-4 text-center">
              <span className="text-sm font-bold text-white block">
                {selectedCharacter.name}
              </span>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                {selectedCharacter.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
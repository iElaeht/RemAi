"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ExternalLink } from "lucide-react";

interface DescriptionTabProps {
  description: string;
  sourceUrl?: string;
}

export default function DescriptionTab({ description, sourceUrl }: DescriptionTabProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Aseguramos la medición del contenido para mostrar el botón
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current && contentRef.current.scrollHeight > 320) {
        setShowButton(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [description]);

  const parsedBlocks = useMemo(() => {
    if (!description) return [];

    const cleaned = description.replace(/\(Fuente:.*?\)/gi, "").trim();

    return cleaned
      .split(/\n|(?=Notes:|Notas:|Incluye|- )/i)
      .map((part) => part.trim())
      .filter(
        (part) =>
          part !== "" && part !== "-" && part !== "Notes:" && part !== "Notas:",
      )
      .map((part) => {
        // 1. Detección de etiqueta (Notas)
        if (
          part.toLowerCase().startsWith("notas") ||
          part.toLowerCase().startsWith("notes")
        ) {
          return { type: "label", content: part.replace(/:/g, "") };
        }
        // 2. Detección de lista (Guiones, números o la palabra Incluye)
        if (
          part.startsWith("-") ||
          part.match(/^\d+\./) ||
          part.toLowerCase().startsWith("incluye")
        ) {
          const content = part.startsWith("-") ? part.replace(/^- /, "") : part;
          return { type: "list", content: content };
        }
        return { type: "paragraph", content: part };
      });
  }, [description]);

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 px-1 sm:px-2">
        <h3 className="text-white font-bold text-sm sm:text-base">Detalles :</h3>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-blue-400 hover:text-blue-300 transition-colors uppercase tracking-[0.2em] font-bold"
          >
            <ExternalLink size={12} /> Fuente: AniList
          </a>
        )}
      </div>

      {/* Contenedor principal */}
      <div
        className={`relative bg-white/[0.03] rounded-2xl border border-white/5 p-4 sm:p-8 transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[2000px]" : "max-h-[320px]"
        } overflow-hidden`}
      >
        <div ref={contentRef} className="space-y-3 sm:space-y-4">
          {parsedBlocks.map((block, index) => {
            if (block.type === "label") {
              return (
                <h4
                  key={index}
                  className="text-blue-400 font-bold uppercase text-[10px] tracking-[0.2em] mt-4 sm:mt-6 mb-2"
                >
                  {block.content}
                </h4>
              );
            }
            if (block.type === "list") {
              return (
                <div
                  key={index}
                  className="text-gray-400 text-xs sm:text-sm italic py-1 pl-3 sm:pl-4 border-l-2 border-gray-700/50"
                >
                  • {block.content}
                </div>
              );
            }
            return (
              <p
                key={index}
                className="text-gray-300 text-xs sm:text-sm leading-relaxed sm:text-justify mb-3 sm:mb-4"
              >
                {block.content}
              </p>
            );
          })}
        </div>

        {/* Gradiente de desvanecimiento */}
        {!isExpanded && showButton && (
          <div className="absolute bottom-0 left-0 w-full h-32 sm:h-40 bg-gradient-to-t from-[#0b101d] via-[#0b101d]/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Botón Mostrar más */}
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 text-gray-300 text-[10px] font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2"
        >
          {isExpanded ? <>▲ CERRAR DESCRIPCIÓN</> : <>▼ LEER MÁS</>}
        </button>
      )}
    </div>
  );
}
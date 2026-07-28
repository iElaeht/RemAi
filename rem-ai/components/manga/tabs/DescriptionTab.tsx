"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface DescriptionTabProps {
  description: string;
  sourceUrl?: string;
  sourceName?: "AniList" | "MangaDex"; // <- Opcional para indicar de dónde viene
}

export default function DescriptionTab({ 
  description, 
  sourceUrl, 
  sourceName = "AniList" // Por defecto mantiene AniList si no se especifica
}: DescriptionTabProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Comprobamos si el contenido excede la altura para mostrar el botón de expandir
  useEffect(() => {
    const timer = setTimeout(() => {
      if (contentRef.current && contentRef.current.scrollHeight > 280) {
        setShowButton(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [description]);

  // Parseo inteligente y limpio de la descripción
  const parsedContent = useMemo(() => {
    if (!description) return { paragraphs: [], notes: [] };

    // Limpiamos cualquier rastro de fuentes tipo (Source: ...) o (Fuente: ...)
    const cleaned = description
      .replace(/\((Source|Fuente):.*?\)/gi, "")
      .replace(/\[Source:.*?\]/gi, "")
      .trim();

    // Separamos el texto principal de notas o avisos especiales (ej. "Nota:", "Notes:")
    const parts = cleaned.split(/(?=Notes:|Notas:|Nota:)/i);
    const mainText = parts[0]?.trim() || "";
    const noteTexts = parts.slice(1).join("\n").trim();

    // Dividimos el texto principal en párrafos reales basados en saltos de línea dobles o simples bien formados
    const paragraphs = mainText
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\n/g, " ").trim())
      .filter(Boolean);

    // Procesamos las notas o listas si existen
    const notes = noteTexts
      ? noteTexts
          .split(/\n|-|\u2022/)
          .map((n) => n.trim())
          .filter((n) => n !== "" && !n.toLowerCase().startsWith("notes") && !n.toLowerCase().startsWith("notas") && !n.toLowerCase().startsWith("nota"))
      : [];

    return { paragraphs, notes };
  }, [description]);

  return (
    <div className="w-full">
      {/* Encabezado */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 px-1">
        <h3 className="text-white font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
          <span className="w-1.5 h-4 bg-red-500 rounded-full" />
          Sinopsis y Detalles
        </h3>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] text-neutral-400 hover:text-red-400 transition-colors uppercase tracking-[0.2em] font-semibold bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 px-2.5 py-1 rounded-lg"
          >
            <ExternalLink size={11} /> {sourceName}
          </a>
        )}
      </div>

      {/* Contenedor principal con efecto de colapso */}
      <div
        className={`relative bg-[#0d1322]/80 backdrop-blur-md rounded-2xl border border-white/5 p-5 sm:p-7 transition-all duration-500 ease-in-out ${
          isExpanded ? "max-h-[3000px]" : "max-h-[280px]"
        } overflow-hidden`}
      >
        <div ref={contentRef} className="space-y-4 text-neutral-300 text-xs sm:text-sm leading-relaxed">
          {/* Párrafos principales */}
          {parsedContent.paragraphs.length > 0 ? (
            parsedContent.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-justify font-normal tracking-normal text-neutral-300/90">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-neutral-500 italic text-center py-4">No hay descripción disponible.</p>
          )}

          {/* Bloque estilizado para Notas o Avisos (Listas limpias) */}
          {parsedContent.notes.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 block mb-2">
                Notas importantes
              </span>
              <ul className="space-y-2">
                {parsedContent.notes.map((note, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-400 bg-black/20 p-2.5 rounded-xl border border-white/[0.02]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span className="leading-normal">{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Gradiente de desvanecimiento cuando está colapsado */}
        {!isExpanded && showButton && (
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/80 to-transparent pointer-events-none" />
        )}
      </div>

      {/* Botón Mostrar más / Mostrar menos */}
      {showButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3.5 w-full py-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-neutral-400 hover:text-white text-[10px] font-bold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 cursor-pointer group"
        >
          {isExpanded ? (
            <>
              <span>Cerrar descripción</span>
              <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            </>
          ) : (
            <>
              <span>Leer descripción completa</span>
              <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            </>
          )}
        </button>
      )}
    </div>
  );
}
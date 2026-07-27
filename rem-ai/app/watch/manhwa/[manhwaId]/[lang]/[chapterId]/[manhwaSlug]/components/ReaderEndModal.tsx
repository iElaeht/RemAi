"use client";
import Link from "next/link";
import { BookOpen, Home, X } from "lucide-react";

interface ReaderEndModalProps {
  isOpen: boolean;
  manhwaTitle?: string;
  manhwaId: string;
  chapterNum?: string;
  volume?: string;
  onClose: () => void;
}

export default function ReaderEndModal({ 
  isOpen, 
  manhwaTitle, 
  manhwaId, 
  chapterNum, 
  volume,
  onClose
}: ReaderEndModalProps) {
  if (!isOpen) return null;

  const libraryPath = "/manhwas";
  const detailPath = `/details/manhwa/${manhwaId}`;
  const displayTitle = manhwaTitle && manhwaTitle.trim() !== "" ? manhwaTitle : "este manhwa";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#0e1422] border border-red-500/35 shadow-2xl text-center flex flex-col gap-4">
        
        {/* Botón de cierre (X) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-full transition-all"
          aria-label="Cerrar modal"
        >
          <X size={16} />
        </button>

        {/* Icono dinámico */}
        <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center bg-red-500/10 text-red-400">
          <BookOpen size={28} />
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-100">¡Has llegado al final!</h3>
          <p className="text-xs text-neutral-400 mt-1">
            Has terminado el último capítulo disponible de{" "}
            <span className="text-white font-medium">&ldquo;{displayTitle}&rdquo;</span>.
          </p>

          {/* Información detallada: Versión responsiva (Mobile vs Web) */}
          {(chapterNum || volume) && (
            <div className="mt-3.5 inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs text-neutral-300">
              {volume && volume !== "0" && (
                <span>
                  {/* Vista Mobile */}
                  <span className="sm:hidden">Vol. <strong className="text-white">{volume}</strong></span>
                  {/* Vista Web / Pantalla Grande */}
                  <span className="hidden sm:inline">Volumen <strong className="text-white">{volume}</strong></span>
                </span>
              )}

              {volume && volume !== "0" && chapterNum && <span className="text-neutral-500">•</span>}

              {chapterNum && (
                <span>
                  {/* Vista Mobile */}
                  <span className="sm:hidden">Cap. <strong className="text-white">{chapterNum}</strong></span>
                  {/* Vista Web / Pantalla Grande */}
                  <span className="hidden sm:inline">Capítulo <strong className="text-white">{chapterNum}</strong></span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Botones de navegación inteligente */}
        <div className="flex flex-col gap-2.5 mt-2">
          <Link
            href={detailPath}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white transition-all shadow-md bg-red-600 hover:bg-red-500 shadow-red-900/30"
          >
            Ver detalles de la obra
          </Link>

          <Link
            href={libraryPath}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-neutral-300 bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Home size={14} /> Volver al catálogo de Manhwas
          </Link>
        </div>
      </div>
    </div>
  );
}
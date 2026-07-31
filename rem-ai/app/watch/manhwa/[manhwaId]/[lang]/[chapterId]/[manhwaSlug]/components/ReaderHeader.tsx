'use client';
import { useState, useRef, useEffect } from 'react';
import { Menu, ChevronLeft, ChevronRight, BookOpen, Layers, Bookmark, LayoutTemplate, Rows2, Columns2, ChevronDown, Check } from 'lucide-react'; 
import QuickSearch from './QuickSearch';

interface ReaderHeaderProps {
  mangaTitle: string;
  author: string;
  chapter: string;
  volume: string;
  lang: string;
  onOpenSidebar: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  readingMode: 'carousel' | 'vertical' | 'webtoon';
  onToggleReadingMode: (mode: 'carousel' | 'vertical' | 'webtoon') => void;
}

export default function ReaderHeader({ 
  mangaTitle, 
  author, 
  chapter, 
  volume,
  lang,
  onOpenSidebar,
  onPrevChapter,
  onNextChapter,
  readingMode,
  onToggleReadingMode
}: ReaderHeaderProps) {
  const isValidVolume = volume && volume !== "null" && volume !== "Sin Volumen" && volume !== "" && volume !== "0";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Configuración de los iconos y etiquetas para cada modo de lectura
  const modeConfig = {
    carousel: { label: "Carrusel", icon: <LayoutTemplate size={14} className="text-red-400" /> },
    vertical: { label: "Vertical", icon: <Rows2 size={14} className="text-red-400" /> },
    webtoon: { label: "Webtoon", icon: <Columns2 size={14} className="text-red-400" /> },
  };

  return (
    <header className="w-full bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/5 px-3 py-2.5 sm:py-3 top-0 z-40 select-none shadow-lg shrink-0">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        
        {/* FILA MOBILE 1 / WEB IZQUIERDA: Título y Autor */}
        <div className="flex items-center justify-between sm:justify-start gap-2.5">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="flex flex-col truncate max-w-[220px] sm:max-w-[240px] lg:max-w-[300px]">
              <span className="text-xs sm:text-sm font-bold text-white truncate" title={mangaTitle}>
                {mangaTitle || "Cargando título..."}
              </span>
              <span className="text-[10px] sm:text-xs text-gray-400 truncate tracking-wide">
                {author || "Autor desconocido"}
              </span>
            </div>
          </div>

          {/* Botones rápidos en Mobile (Derecha de la fila 1) */}
          <div className="flex items-center gap-1 sm:hidden">
            <button 
              onClick={onOpenSidebar} 
              className="p-2 text-gray-300 hover:text-white rounded-xl bg-white/5 transition-colors cursor-pointer"
              title="Capítulos"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* FILA MOBILE 2 / WEB CENTRO: Controles de Capítulo */}
        <div className="flex items-center justify-between sm:absolute sm:left-1/2 sm:-translate-x-1/2 gap-1 sm:gap-2 border-t border-white/5 sm:border-t-0 pt-2 sm:pt-0">
          <button 
            onClick={onPrevChapter} 
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            title="Capítulo anterior"
          >
            <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
          </button>
          
          <div className="flex items-center gap-2 sm:gap-3 px-3 py-1 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="flex items-center gap-1 text-red-400">
              <Bookmark size={12} className="hidden sm:inline" />
              <span className="text-xs sm:text-xs font-bold tracking-wider uppercase">
                Cap. {chapter}
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
              {isValidVolume && (
                <>
                  <span className="flex items-center gap-0.5">
                    <Layers size={10} className="hidden sm:inline text-gray-500" />
                    Vol. {volume}
                  </span>
                  <span className="text-gray-600">•</span>
                </>
              )}
              <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-300 font-semibold text-[9px] uppercase">
                {lang}
              </span>
            </div>
          </div>

          <button 
            onClick={onNextChapter} 
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            title="Capítulo siguiente"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* WEB DERECHA: QuickSearch, Selector de Modo de Lectura y Sidebar */}
        <div className="hidden sm:flex items-center gap-2.5 z-10">
          
          <QuickSearch />

          {/* Selector de Modo de Lectura Desplegable */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between gap-2 bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 text-xs font-medium px-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-red-500/50 transition-all cursor-pointer shadow-inner min-w-[135px]"
              title="Seleccionar formato de lectura"
            >
              <div className="flex items-center gap-2">
                {modeConfig[readingMode]?.icon}
                <span className="text-white font-semibold">{modeConfig[readingMode]?.label}</span>
              </div>
              <ChevronDown size={12} className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-full min-w-[150px] bg-[#0e1422] border border-red-500/40 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.9)] overflow-hidden z-[99999] p-1">
                {(Object.keys(modeConfig) as Array<keyof typeof modeConfig>).map((mode) => {
                  const isSelected = readingMode === mode;
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => {
                        onToggleReadingMode(mode);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left rounded-lg transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-red-600 text-white font-semibold shadow-md" 
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={isSelected ? "text-white" : ""}>
                          {modeConfig[mode].icon}
                        </span>
                        <span>{modeConfig[mode].label}</span>
                      </div>
                      {isSelected && <Check size={13} className="text-white shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            onClick={onOpenSidebar} 
            className="p-2 text-gray-300 hover:text-white transition-all rounded-xl hover:bg-white/10 border border-white/5 flex items-center gap-1.5 cursor-pointer"
            title="Abrir índice de capítulos"
          >
            <Menu size={18} />
            <span className="text-xs font-medium">Capítulos</span>
          </button>
        </div>

      </div>
    </header>
  );
}
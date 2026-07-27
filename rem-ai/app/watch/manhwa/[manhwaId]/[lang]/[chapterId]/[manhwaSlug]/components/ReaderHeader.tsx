'use client';
import { Menu, ChevronLeft, ChevronRight, BookOpen, FileText, Layers, Bookmark } from 'lucide-react'; 
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
  readingMode: 'carousel' | 'vertical'; 
  onToggleReadingMode: () => void;
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

  return (
    <header className="w-full bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/5 px-3 py-2.5 sm:py-3 top-0 z-40 select-none shadow-lg">
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
              onClick={onToggleReadingMode}
              className="p-2 text-gray-300 hover:text-red-400 rounded-xl bg-white/5 transition-colors"
              title={readingMode === 'carousel' ? "Modo vertical" : "Modo carrusel"}
            >
              {readingMode === 'carousel' ? <FileText size={18} /> : <BookOpen size={18} />}
            </button>
            <button 
              onClick={onOpenSidebar} 
              className="p-2 text-gray-300 hover:text-white rounded-xl bg-white/5 transition-colors"
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
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
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
            className="p-1.5 sm:p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
            title="Capítulo siguiente"
          >
            <ChevronRight size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* WEB DERECHA: QuickSearch, Modo de Lectura y Sidebar */}
        <div className="hidden sm:flex items-center gap-2 z-10">
          
          {/* QuickSearch sin props para evitar conflictos de TypeScript */}
          <QuickSearch />

          <button 
            onClick={onToggleReadingMode}
            className="p-2 text-gray-300 hover:text-red-400 transition-all rounded-xl hover:bg-red-500/10 border border-transparent hover:border-red-500/20 flex items-center gap-1.5"
            title={readingMode === 'carousel' ? "Cambiar a lectura vertical" : "Cambiar a carrusel"}
          >
            {readingMode === 'carousel' ? <FileText size={18} /> : <BookOpen size={18} />}
            <span className="text-xs font-medium">
              {readingMode === 'carousel' ? 'Vertical' : 'Carrusel'}
            </span>
          </button>

          <button 
            onClick={onOpenSidebar} 
            className="p-2 text-gray-300 hover:text-white transition-all rounded-xl hover:bg-white/10 border border-white/5 flex items-center gap-1.5"
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
'use client';
import { ArrowLeft, Menu, ChevronLeft, ChevronRight, BookOpen, FileText } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

interface ReaderHeaderProps {
  mangaTitle: string;
  author: string;
  chapter: string;
  volume: string;
  lang: string;
  mangaId: string;
  onOpenSidebar: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
  // Propiedades nuevas para el modo de lectura
  readingMode: 'carousel' | 'vertical'; 
  onToggleReadingMode: () => void;
}

export default function ReaderHeader({ 
  mangaTitle, 
  author, 
  chapter, 
  volume,
  lang,
  mangaId,
  onOpenSidebar,
  onPrevChapter,
  onNextChapter,
  readingMode,
  onToggleReadingMode
}: ReaderHeaderProps) {
  const router = useRouter();
  const isValidVolume = volume && volume !== "null" && volume !== "Sin Volumen" && volume !== "" && volume !== "0";

  return (
    <header className="w-full bg-[#0a0f1a] border-b border-white/5 px-4 py-4 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        
        {/* IZQUIERDA: Home/Manga Info */}
        <button 
          onClick={() => router.replace(`/manga/${mangaId}`)} 
          className="flex items-center gap-3 text-gray-300 hover:text-white transition-all group z-10"
        >
          <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <div className="flex flex-col truncate max-w-[140px] sm:max-w-[300px]">
            <span className="text-xs sm:text-sm font-bold text-white truncate">{mangaTitle}</span>
            <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest">{author}</span>
          </div>
        </button>

        {/* CENTRO: Controles de Capítulo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-3">
          <button onClick={onPrevChapter} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex flex-col items-center px-2 sm:px-6">
            <span className="text-[10px] sm:text-xs text-blue-400 font-bold tracking-[0.2em] uppercase whitespace-nowrap">
              <span className="hidden sm:inline">Capítulo {chapter}</span>
              <span className="sm:hidden">Cap {chapter}</span>
            </span>

            <span className="text-[9px] sm:text-[11px] text-gray-500 font-medium tracking-tight uppercase">
              {isValidVolume ? (
                <>
                  <span className="hidden sm:inline">Volumen {volume}</span>
                  <span className="sm:hidden">Vol {volume}</span>
                  {' • '}
                </>
              ) : null}
              {lang.toUpperCase()}
            </span>
          </div>

          <button onClick={onNextChapter} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* DERECHA: Botón Modo Lectura y Sidebar */}
        <div className="flex items-center gap-1 sm:gap-2 z-10">
          <button 
            onClick={onToggleReadingMode}
            className="p-2 text-gray-400 hover:text-pink-500 transition-all rounded-full hover:bg-white/5"
            title={readingMode === 'carousel' ? "Cambiar a lectura vertical" : "Cambiar a carrusel"}
          >
            {readingMode === 'carousel' ?<FileText size={22} />  : <BookOpen size={22} />}
          </button>

          <button 
            onClick={onOpenSidebar} 
            className="p-2 text-gray-400 hover:text-white transition-all rounded-full hover:bg-white/5"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
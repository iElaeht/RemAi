'use client';
import { ArrowLeft, Menu, ChevronLeft, ChevronRight, User, Globe, BookOpen } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

interface ReaderHeaderProps {
  mangaTitle: string;
  author: string;
  chapter: string;
  volume: string;
  lang: string;
  mangaId?: string;
  onOpenSidebar: () => void;
  onPrevChapter: () => void;
  onNextChapter: () => void;
}

export default function ReaderHeader({ 
  mangaTitle, 
  author, 
  chapter, 
  volume,
  lang,
  onOpenSidebar,
  onPrevChapter,
  onNextChapter 
}: ReaderHeaderProps) {
  const router = useRouter();
  const displayTitle = mangaTitle && mangaTitle.length > 30 
    ? `${mangaTitle.substring(0, 30)}...` 
    : mangaTitle;
  return (
    <header className="w-full bg-[#0a0f1a]/80 backdrop-blur-md border-b border-white/5 py-3 top-0 z-50">
      <div className="w-full px-4 flex flex-col gap-3">
        
        {/* FILA SUPERIOR */}
        <div className="flex items-center justify-between w-full">
          
          {/* IZQUIERDA: Flecha */}
          <div className="flex-1 flex justify-start">
            <button 
              onClick={() => router.back()} 
              className="p-2 transition-colors duration-200 text-gray-400 hover:text-white"
            >
              <ArrowLeft size={24} strokeWidth={2} />
            </button>
          </div>

          {/* CENTRO: Navegación minimalista */}
          <div className="flex items-center gap-1 bg-[#111827] border border-white/5 rounded-full p-1 shrink-0">
            <button onClick={onPrevChapter} className="p-1.5 hover:text-white text-gray-400 transition-colors">
              <ChevronLeft size={16} />
            </button>
            <div className="text-[10px] font-bold text-blue-300 tracking-wider px-2 whitespace-nowrap">
              VOL {volume} • CAP {chapter}
            </div>
            <button onClick={onNextChapter} className="p-1.5 hover:text-white text-gray-400 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>

          {/* DERECHA: Menú simplificado */}
          <div className="flex-1 flex justify-end">
            <button 
              onClick={onOpenSidebar} 
              className="p-2 text-gray-400 hover:text-white transition-opacity duration-200"
              aria-label="Abrir menú"
            >
              <Menu size={24} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* FILA INFERIOR: Información Ajustada */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-gray-400">
          
          <h1 
            className="flex items-center gap-2 text-[13px] font-bold text-white cursor-help select-none" 
            title={mangaTitle} // El navegador muestra el título completo aquí al hacer hover
          >
            <BookOpen size={13} className="text-pink-500 shrink-0" />
            {displayTitle || "Cargando..."}
          </h1>
          
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <User size={12} className="text-gray-500" /> {author || "Autor Desconocido"}
            </span>
            <span className="flex items-center gap-1 text-blue-400">
              <Globe size={12} /> {lang ? lang.toUpperCase() : 'N/A'}
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
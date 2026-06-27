'use client';
import { ArrowLeft, Menu, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react'; 
import { useRouter } from 'next/navigation';

interface ReaderHeaderProps {
  mangaTitle: string;
  author: string;
  chapter: string;
  volume: string;
  lang: string;
  mangaId: string; // ID necesario para el botón de retroceso
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
  mangaId,
  onOpenSidebar,
  onPrevChapter,
  onNextChapter 
}: ReaderHeaderProps) {
  const router = useRouter();
  
  return (
    <header className="w-full bg-[#0a0f1a] border-b border-white/5 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* IZQUIERDA: Home/Manga Info */}
        <button 
          onClick={() => router.push(`/manga/${mangaId}`)} 
          className="flex items-center gap-3 text-gray-300 hover:text-white transition-all group"
        >
          <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
            <ArrowLeft size={18} />
          </div>
          <div className="flex flex-col truncate max-w-[150px] sm:max-w-[250px]">
            <span className="text-[11px] font-bold text-white truncate">{mangaTitle}</span>
            <span className="text-[9px] text-gray-500 uppercase tracking-widest">{author}</span>
          </div>
        </button>

        {/* CENTRO: Controles de Capítulo */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
          <button onClick={onPrevChapter} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <ChevronLeft size={20} />
          </button>
          
          <div className="flex flex-col items-center px-4">
            <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Capítulo {chapter}</span>
            <span className="text-[8px] text-gray-600 font-medium">VOL {volume} • {lang.toUpperCase()}</span>
          </div>

          <button onClick={onNextChapter} className="p-1.5 text-gray-400 hover:text-white transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* DERECHA: Sidebar */}
        <button 
          onClick={onOpenSidebar} 
          className="p-2 text-gray-400 hover:text-white transition-all rounded-full hover:bg-white/5"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
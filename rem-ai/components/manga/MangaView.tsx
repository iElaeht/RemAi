'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importamos router para la navegación
import { fetchAllChapters, Chapter } from '@/service/mangaService';
import ChapterSidebar from './ChapterSidebar';
import { List, BookOpen, Tag } from 'lucide-react'; // Añadimos Tag

export default function MangaView({ manga }: { manga: any }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState('es');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchAllChapters(manga.id);
      setChapters(data);
      setLoading(false);
    };
    loadData();
  }, [manga.id]);

  // Lógica para ir al primer capítulo en inglés
  const handleReadNow = () => {
    if (chapters.length > 0) {
      // Ordenamos por capítulo (asc) y tomamos el primero
      const firstChapter = [...chapters].sort((a, b) => Number(a.chapter) - Number(b.chapter))[0];
      router.push(`/leer/${manga.id}/${firstChapter.id}?lang=en`);
    }
  };

  return (
    <div className="px-6 py-12 md:py-20 animate-in fade-in zoom-in duration-700">
      <div className="container mx-auto max-w-5xl">
        
        <div className="relative overflow-hidden bg-[#1e293b]/40 backdrop-blur-xl p-8 md:p-12 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-10">
            
            <div className="relative w-56 shrink-0 cursor-pointer group" onClick={() => setIsModalOpen(true)}>
              <div className="absolute inset-0 bg-pink-600/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={manga.coverUrl} alt={manga.title} className="w-full rounded-xl shadow-2xl relative transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>
            
            <div className="flex flex-col items-center md:items-start gap-4 w-full text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {manga.title}
              </h1>
              
              {/* Tags con icono */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {manga.tags?.slice(0, 4).map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1.5 text-[10px] uppercase font-bold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-blue-200">
                    <Tag size={10} /> {tag}
                  </span>
                ))}
              </div>

              {/* Texto "Descripcion" sutil */}
              <div className="w-full mt-2">
                <p className="text-[11px] uppercase tracking-widest text-neutral-500 font-bold mb-2">Descripción</p>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed text-justify max-w-2xl font-light">
                  {manga.description}
                </p>
              </div>
              
              {/* Botones de acción */}
              <div className="flex items-center gap-3 mt-4">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-3 rounded-xl transition-all text-white backdrop-blur-sm"
                >
                  <List size={18} /> <span className="text-sm font-semibold">Índice</span>
                </button>

                <button 
                  onClick={handleReadNow}
                  className="flex items-center gap-2 bg-pink-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-pink-500 transition-all shadow-[0_0_20px_-5px_rgba(219,39,119,0.5)] active:scale-95"
                >
                  <BookOpen size={18} /> Leer
                </button>
              </div>
            </div>
          </div>
        </div>

        <ChapterSidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          chapters={chapters} 
          lang={lang} 
          setLang={setLang} 
          loading={loading}
        />

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1120]/90 backdrop-blur-md p-4" onClick={() => setIsModalOpen(false)}>
            <img src={manga.coverUrl} className="max-h-[85vh] rounded-2xl shadow-2xl border border-white/10" />
          </div>
        )}
      </div>
    </div>
  );
}
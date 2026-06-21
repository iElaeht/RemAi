"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchAllChapters, Chapter } from "@/service/mangaService";
import ChapterSidebar from "./ChapterSidebar";
import { List, BookOpen, Tag, User, X } from "lucide-react";

interface Manga {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  description: string;
  tags?: string[];
}

export default function MangaView({ manga }: { manga: Manga }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("manga_lang") || "es";
    return "es";
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("manga_lang", lang);
  }, [lang]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchAllChapters(manga.id);
      setChapters(data);
      setLoading(false);
    };
    loadData();
  }, [manga.id]);

  // Lógica de prioridad: es-la -> es -> en
  const firstChapter = useMemo(() => {
    if (chapters.length === 0) return null;

    const priority = ['es-la', 'es', 'en'];
    
    for (const l of priority) {
      const found = chapters.find((ch) => ch.language.toLowerCase() === l);
      if (found) return found;
    }

    return [...chapters].sort((a, b) => Number(a.number) - Number(b.number))[0];
  }, [chapters]);

  const noChaptersAvailable = chapters.length === 0 && !loading;

  const handleReadNow = () => {
    if (firstChapter) router.push(`/leer/${firstChapter.id}?lang=${firstChapter.language}`);
  };

  return (
    <div className="px-6 py-12 md:py-20 animate-in fade-in duration-700">
      <div className="container mx-auto max-w-5xl">
        
        <div className="relative overflow-hidden bg-[#1e293b]/40 backdrop-blur-xl p-8 md:p-16 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-center md:items-start gap-12">
            <div className="relative w-64 shrink-0 cursor-pointer group" onClick={() => setIsModalOpen(true)}>
              <div className="absolute inset-0 bg-pink-600/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={manga.coverUrl} alt={manga.title} className="w-full rounded-xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.03]" />
            </div>

            <div className="flex flex-col items-center md:items-start gap-6 w-full text-center md:text-left">
              <div className="flex flex-col gap-2 w-full">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-none">{manga.title}</h1>
                <div className="flex items-center justify-center md:justify-start gap-2 text-neutral-400 text-lg font-medium">
                  <User size={18} /> <span>{manga.author || "Autor Desconocido"}</span>
                </div>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                {manga.tags?.slice(0, 4).map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 text-[11px] uppercase font-bold px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-blue-200">
                    <Tag size={12} /> {tag}
                  </span>
                ))}
              </div>

              <div className="py-2 border-t border-white/5 border-b border-white/5">
                <p className="text-gray-300 text-base md:text-lg leading-relaxed text-justify max-w-2xl font-light">
                  {manga.description}
                </p>
              </div>

              <div className="flex flex-col items-center gap-4 mt-2 w-full md:w-auto">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <button 
                    onClick={() => setIsSidebarOpen(true)} 
                    className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-3.5 rounded-xl transition-all text-white backdrop-blur-sm active:scale-95 w-full md:w-auto"
                  >
                    <List size={20} /> <span className="font-semibold">Índice</span>
                  </button>
                  
                  <button 
                    onClick={handleReadNow} 
                    disabled={loading || chapters.length === 0} 
                    className="flex items-center justify-center gap-3 bg-pink-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-pink-500 transition-all disabled:opacity-50 active:scale-95 w-full md:w-auto"
                  >
                    {loading ? "Cargando..." : chapters.length === 0 ? "Sin capítulos" : <><BookOpen size={20} /> Leer</>}
                  </button>
                </div>
                
                {noChaptersAvailable && (
                  <p className="text-pink-400/80 text-[12px] font-medium animate-pulse">
                    No hay idiomas disponibles. Por favor, revisa el índice.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}>
            <button className="absolute top-8 right-8 text-white hover:text-pink-500 transition-colors"><X size={40} /></button>
            <img src={manga.coverUrl} alt="Preview" className="max-h-[85vh] max-w-[90vw] rounded-lg shadow-2xl animate-in zoom-in-95 duration-300" />
          </div>
        )}

        <ChapterSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          chapters={chapters}
          lang={lang}
          setLang={setLang}
          loading={loading}
        />
      </div>
    </div>
  );
}
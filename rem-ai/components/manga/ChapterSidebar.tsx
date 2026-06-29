// components/manga/ChapterSidebar.tsx
import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";
import ChapterControls from "./ChapterControls";
import VolumeItem from "./VolumeItem";
import { groupChaptersByVolume } from "@/utils/mangaUtils";
import { Chapter } from "@/service/mangaService";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  chapters: Chapter[];
  lang: string;
  setLang: (lang: string) => void;
  loading: boolean;
}

export default function ChapterSidebar({ isOpen, onClose, chapters, lang, setLang, loading }: Props) {
  const volumeGroups = useMemo(() => groupChaptersByVolume(
    chapters, lang), [chapters, lang]
  );

  const [activeVol, setActiveVol] = useState<string | null>(
    volumeGroups.length > 0 ? volumeGroups[0].volume : null
  );
  
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleToggle = (vol: string) => {
    setActiveVol((prev) => (prev === vol ? null : vol));
  };

  return (
    <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[400px] bg-[#0f172a] shadow-2xl z-[70] transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-white/10`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Índice de Capítulos</h2>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>

          <ChapterControls chapters={chapters} lang={lang} setLang={setLang} />

          <div className="mt-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              <p className="text-gray-500 animate-pulse text-sm">Cargando...</p>
            ) : volumeGroups.length > 0 ? (
              <div className="flex flex-col gap-2">
                {volumeGroups.map((group) => (
                  <VolumeItem
                    key={group.volume}
                    group={group}
                    isOpen={activeVol === group.volume}
                    onToggle={() => handleToggle(group.volume)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay capítulos.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
// components/manga/ChapterSidebar.tsx
import { useState, useMemo } from "react";
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

export default function ChapterSidebar({
  isOpen,
  onClose,
  chapters,
  lang,
  setLang,
  loading,
}: Props) {
  // Estado para controlar qué volumen está abierto (exclusividad estilo MangaDex)
  const [activeVol, setActiveVol] = useState<string | null>(null);
  console.log("Datos brutos de capítulos:", chapters);
  // Procesamos los datos usando nuestra función utilitaria
  const volumeGroups = useMemo(
    () => groupChaptersByVolume(chapters, lang),
    [chapters, lang],
  );
  console.log("Grupos creados:", volumeGroups); // ¿Cuántos grupos hay?

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay oscuro */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full md:w-[450px] bg-[#0a0f1a] h-full shadow-2xl border-l border-white/10 p-6 overflow-y-auto overscroll-y-contain animate-in slide-in-from-right duration-300 custom-scroll">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-light">I N D E X</h2>
          <button
            onClick={onClose}
            className="hover:text-blue-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <ChapterControls chapters={chapters} lang={lang} setLang={setLang} />

        <div className="mt-6">
          {loading ? (
            <p className="text-gray-500 animate-pulse">Cargando capítulos...</p>
          ) : volumeGroups.length > 0 ? (
            // Mapeamos los grupos procesados usando VolumeItem
            <div className="flex flex-col">
              {volumeGroups.map((group) => (
                <VolumeItem
                  key={group.volume}
                  group={group}
                  isOpen={activeVol === group.volume}
                  // Si el usuario hace clic en el mismo volumen, se cierra (null), si no, lo activa
                  onToggle={() =>
                    setActiveVol(
                      activeVol === group.volume ? null : group.volume,
                    )
                  }
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No hay capítulos disponibles en este idioma.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

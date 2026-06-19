// components/manga/ChapterControls.tsx
import { Chapter } from "@/service/mangaService";
import { useState, useRef, useEffect } from "react";

interface Props {
  lang: string;
  setLang: (lang: string) => void;
  chapters: Chapter[];
}

const langMap: Record<string, { name: string; flag: string }> = {
  es: { name: "Español", flag: "🇪🇸" },
  "es-la": { name: "Español (Latino)", flag: "🇲🇽" },
  en: { name: "English", flag: "🇺🇸" },
  ja: { name: "日本語", flag: "🇯🇵" },
  vi: { name: "Tiếng Việt", flag: "🇻🇳" },
  it: { name: "Italiano", flag: "🇮🇹" },
  fr: { name: "Français", flag: "🇫🇷" },
  ru: { name: "Русский", flag: "🇷🇺" },
  "pt-br": { name: "Português", flag: "🇧🇷" },
  pl: { name: "Polski", flag: "🇵🇱" },
  th: { name: "ภาษาไทย", flag: "🇹🇭" },
  id: { name: "Bahasa Indonesia", flag: "🇮🇩" },
};

export default function ChapterControls({ lang, setLang, chapters }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const availableLangs = Array.from(new Set(chapters.map((ch) => ch.language)));
  const count = chapters.filter((ch) => ch.language === lang).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-6 mb-8 w-full">
      {/* Título y Contador */}
      <div className="flex justify-between items-center">
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          Capítulos disponibles
        </h3>
        <span className="text-[11px] font-bold text-pink-500 bg-pink-500/10 px-2.5 py-1 rounded uppercase tracking-wider">
          {count} encontrados
        </span>
      </div>

      {/* Selector de Idioma */}
      <div className="flex flex-col gap-3" ref={dropdownRef}>
        <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
          Idiomas disponibles
        </h3>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full bg-[#0a0f1a] border border-white/5 hover:border-pink-500/30 transition-all duration-300 rounded-lg p-4 text-sm font-semibold text-gray-200 flex justify-between items-center group"
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{langMap[lang]?.flag || "🌐"}</span>
              {langMap[lang]?.name || lang.toUpperCase()}
            </span>
            <span className={`transition-transform duration-300 text-[10px] text-gray-500 group-hover:text-pink-500 ${isOpen ? "rotate-180" : ""}`}>
              ▼
            </span>
          </button>

          {/* Menú Desplegable */}
          {isOpen && (
            <div className="absolute top-full left-0 w-full mt-2 bg-[#0f1420] border border-white/10 rounded-lg shadow-2xl z-50 py-1 overflow-hidden custom-scroll max-h-60 overflow-y-auto">
              {availableLangs.map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setLang(l);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors flex items-center gap-3 ${
                    lang === l ? "text-pink-500 bg-white/5" : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{langMap[l]?.flag || "🌐"}</span>
                  {langMap[l]?.name || l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
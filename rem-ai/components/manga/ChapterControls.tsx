// components/manga/ChapterControls.tsx
import { Chapter } from "@/service/mangaService";
import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check, Layers } from "lucide-react";

interface Props {
  lang: string;
  setLang: (lang: string) => void;
  chapters: Chapter[];
  contentType?: string;
}

const themeConfig: Record<string, { accentText: string; accentBg: string; borderHover: string; borderActive: string }> = {
  manga: {
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10",
    borderHover: "hover:border-blue-500/40",
    borderActive: "border-blue-500/20",
  },
  manhwa: {
    accentText: "text-purple-400",
    accentBg: "bg-purple-500/10",
    borderHover: "hover:border-purple-500/40",
    borderActive: "border-purple-500/20",
  },
  manhua: {
    accentText: "text-emerald-400",
    accentBg: "bg-emerald-500/10",
    borderHover: "hover:border-emerald-500/40",
    borderActive: "border-emerald-500/20",
  },
  default: {
    accentText: "text-blue-400",
    accentBg: "bg-blue-500/10",
    borderHover: "hover:border-blue-500/40",
    borderActive: "border-blue-500/20",
  }
};

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

// Jerarquía de prioridad deseada para la selección automática
const PREFERRED_LANGUAGE_ORDER = ["es-la", "es", "en", "pt-br", "pt", "fr", "it", "uk", "ja"];

export default function ChapterControls({ lang, setLang, chapters, contentType = "manga" }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const theme = themeConfig[contentType?.toLowerCase()] || themeConfig.manga;

  const safeChapters = Array.isArray(chapters) ? chapters : [];
  const availableLangs = Array.from(new Set(safeChapters.map((ch) => ch.language)));

  // Selección inteligente basada en la jerarquía de prioridad
  useEffect(() => {
    if (availableLangs.length > 0) {
      // Si el idioma actual no está disponible en los capítulos, o si está por defecto en 'en' u otro sin verificar
      const isCurrentLangAvailable = availableLangs.includes(lang);
      
      if (!isCurrentLangAvailable) {
        // Buscamos el primer idioma disponible que haga match con nuestra jerarquía de preferencia
        const bestLang = PREFERRED_LANGUAGE_ORDER.find((l) => availableLangs.includes(l)) || availableLangs[0];
        setLang(bestLang);
      }
    }
  }, [availableLangs, lang, setLang]);

  const count = safeChapters.filter((ch) => ch.language === lang).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-5 w-full">
      
      <div className="flex flex-col gap-5 pb-6 border-b border-white/5">
        {/* 1. Selector de Idioma */}
        <div className="flex flex-col gap-2.5" ref={dropdownRef}>
          <div className="flex items-center gap-2">
            <Globe size={13} className={theme.accentText} />
            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.15em]">
              Idioma de lectura
            </h3>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`w-full bg-[#090d16] border border-white/5 ${theme.borderHover} transition-all duration-300 rounded-xl px-4 py-3 text-sm font-semibold text-neutral-200 flex justify-between items-center group cursor-pointer shadow-inner`}
            >
              <span className="flex items-center gap-3">
                <span className="text-base">{langMap[lang]?.flag || "🌐"}</span>
                <span className="group-hover:text-white transition-colors">{langMap[lang]?.name || lang.toUpperCase()}</span>
              </span>
              <ChevronDown 
                size={16} 
                className={`transition-transform duration-300 text-neutral-500 group-hover:${theme.accentText} ${isOpen ? `rotate-180 ${theme.accentText}` : ""}`} 
              />
            </button>

            {/* Menú Desplegable de Idiomas */}
            {isOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#0e1422] border border-white/10 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                {availableLangs.map((l) => {
                  const isSelected = lang === l;
                  return (
                    <button
                      key={l}
                      onClick={() => {
                        setLang(l);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors flex items-center justify-between group cursor-pointer ${
                        isSelected ? `${theme.accentText} ${theme.accentBg} font-bold` : "text-neutral-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-base">{langMap[l]?.flag || "🌐"}</span>
                        <span>{langMap[l]?.name || l.toUpperCase()}</span>
                      </span>
                      {isSelected && <Check size={14} className={theme.accentText} />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 2. Contador de Capítulos */}
        <div className="flex justify-between items-center px-3 py-2.5 bg-white/[0.02] border border-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <Layers size={13} className={theme.accentText} />
            <h3 className="text-[11px] font-bold text-neutral-400 uppercase tracking-[0.15em]">
              Capítulos disponibles
            </h3>
          </div>
          <span className={`text-xs font-bold ${theme.accentText} ${theme.accentBg} px-2.5 py-1 rounded-lg border ${theme.borderActive} tracking-wider`}>
            {count}
          </span>
        </div>
      </div>

    </div>
  );
}
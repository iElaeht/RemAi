"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchAllChapters, Chapter } from "@/service/mangaService";
import MangaDetailsContainer from "./MangaDetailsContainer";
import ChapterSidebar from "./ChapterSidebar";
import FavoriteButton from "./FavoriteButton";
import { MangaResponse } from "@/types/mangadex";
import { getTagIdByName, tagToSlug } from "@/service/tagService";
import { List, BookOpen, Tag, User, X, Star, Clock } from "lucide-react";

const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

interface MangaViewProps {
  manga: MangaResponse;
  userId: string | null;
  initialIsFavorite: boolean;
}

export default function MangaView({
  manga,
  userId,
  initialIsFavorite,
}: MangaViewProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("manga_lang") || "es"
      : "es",
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAllTitles, setShowAllTitles] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  // Detección dinámica: si la ruta actual incluye "manhwa", usamos ese prefijo; de lo contrario, "manga".
  const watchBasePath = pathname.includes("manhwa")
    ? "/watch/manhwa"
    : "/watch/manga";
  const contentType = pathname.includes("manhwa") ? "manhwa" : "manga";

  const rating = manga.rating || 0;

  // Como manga.status ya viene mapeado desde mapMangaData (ej. "Finalizado", "En emisión", etc.),
  // podemos usarlo directamente o respaldarlo por si acaso.
  const statusLabel = manga.status || "En emisión";

  useEffect(() => {
    localStorage.setItem("manga_lang", lang);
  }, [lang]);

  useEffect(() => {
    if (manga.id) {
      const loadData = async () => {
        setLoading(true);
        const data = await fetchAllChapters(manga.id);
        setChapters(data);
        setLoading(false);
      };
      loadData();
    }
  }, [manga.id]);

  const firstChapter = useMemo(() => {
    if (chapters.length === 0) return null;
    const priority = ["es-la", "es", "en"];
    for (const l of priority) {
      const found = chapters.find((ch) => ch.language.toLowerCase() === l);
      if (found) return found;
    }
    return [...chapters].sort((a, b) => Number(a.number) - Number(b.number))[0];
  }, [chapters]);

  const handleReadNow = () => {
    if (firstChapter) {
      const mangaSlug = createSlug(manga.title);
      router.push(
        `${watchBasePath}/${manga.id}/${firstChapter.language}/${firstChapter.id}/${mangaSlug}`,
      );
    }
  };

  const handleTagClick = (tag: string) => {
    const tagId = getTagIdByName(tag);
    const slug = tagToSlug(tag);
    if (tagId) router.push(`/mangas/${tagId}/${slug}`);
  };

  return (
    <div className="bg-[#0b101d] p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl select-none">
      <div className="flex flex-col md:flex-row gap-8">
        {/* PORTADA Y TÍTULOS ALTERNOS */}
        <div className="flex flex-col gap-8">
          <div
            className="relative w-full md:w-64 aspect-[2/3] overflow-hidden rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={manga.coverUrl}
              alt={manga.title}
              className="w-full h-full object-cover"
            />
          </div>
          {/* TÍTULOS ALTERNOS */}
          {manga.altTitles && manga.altTitles.length > 0 && (
            <div className="w-full md:w-64 space-y-3">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest px-1 flex items-center gap-2">
                <span className="w-0.5 h-3 bg-pink-500"></span> Títulos Alternos
              </h3>

              <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-[#0b101d] border border-white/5">
                {(showAllTitles
                  ? manga.altTitles
                  : manga.altTitles.slice(0, 4)
                ).map((title, index) => {
                  const fullTitle = Object.values(title)[0];
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs text-gray-400 px-2 py-2 rounded-md bg-[#151c2f] hover:bg-white/5 transition-colors cursor-default group"
                      title={fullTitle}
                    >
                      <span className="truncate">{fullTitle}</span>
                    </div>
                  );
                })}

                {manga.altTitles.length > 4 && (
                  <button
                    onClick={() => setShowAllTitles(!showAllTitles)}
                    className="flex items-center gap-1.5 text-[10px] text-pink-500 font-bold px-2 py-1 hover:text-pink-400 transition-colors mt-1"
                  >
                    {showAllTitles ? (
                      <>
                        <X size={10} /> Ocultar todo
                      </>
                    ) : (
                      <>
                        <List size={10} /> Mostrar {manga.altTitles.length - 4}{" "}
                        más
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* DETALLES REORGANIZADOS */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {manga.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span className="hidden md:inline">Autor:</span>
              <span className="font-medium text-white">
                {manga.author || "Desconocido"}
              </span>
            </div>
            <span className="text-white/20 hidden md:inline">•</span>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-pink-500" />
              <span className="hidden md:inline">Estado:</span>
              <span className="text-pink-500 font-semibold">{statusLabel}</span>
            </div>
          </div>

          {/* RATING */}
          <div className="flex items-center gap-3">
            <div className="flex text-yellow-400 gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.round(rating / 2) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-white">
              {rating > 0 ? rating.toFixed(1) : "0.0"}
              <span className="text-gray-500 font-normal ml-2">
                Calificación
              </span>
            </span>
          </div>

          {/* GENEROS Y CATEGORÍAS */}
          <div className="space-y-3 pt-3">
            <div className="flex items-center gap-2 text-gray-500">
              <Tag size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Géneros y Categorías
              </span>
            </div>

            <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-[#0e1629] border border-white/5">
              {manga.tags?.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="cursor-pointer px-3 py-1 rounded-md bg-white/5 hover:bg-pink-600/20 border border-white/10 text-[10px] uppercase font-bold text-gray-300 hover:text-white hover:border-pink-500/50 transition-all duration-300"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <MangaDetailsContainer manga={manga} />
          </div>

          {/* ACCIONES */}
          <div className="flex flex-col gap-3 mt-6">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 w-full">
              {/* Botón Capítulos */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                disabled={chapters.length === 0}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all w-full sm:w-auto ${
                  chapters.length === 0
                    ? "bg-white/5 text-gray-600 cursor-not-allowed"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                <List size={18} /> Capítulos
              </button>

              {/* Botón Favorito */}
              <div className="flex items-center justify-center w-full sm:w-auto">
                <FavoriteButton
                  userId={userId}
                  mangaId={manga.id}
                  title={manga.title}
                  coverImage={manga.coverUrl}
                  type={contentType}
                  initialIsFavorite={initialIsFavorite}
                />
              </div>

              {/* Botón Leer */}
              <button
                onClick={handleReadNow}
                disabled={loading || !firstChapter}
                className={`flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-bold transition-all w-full sm:w-auto ${
                  loading || !firstChapter
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-pink-600 hover:bg-pink-500 text-white"
                }`}
              >
                <BookOpen size={18} /> Leer
              </button>
            </div>

            {chapters.length === 0 && !loading && (
              <div className="flex justify-center">
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-950/20 border border-red-900/50 text-red-400 text-sm">
                  <X size={16} className="shrink-0" />
                  <p>Aún no hay capítulos disponibles para este contenido.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Imagen */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <button className="absolute top-6 right-6 text-white">
            <X size={32} />
          </button>
          <img
            src={manga.coverUrl}
            alt="Preview"
            className="max-w-[400px] max-h-[600px] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}

      {/* Sidebar de Capítulos */}
      <ChapterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chapters={chapters}
        lang={lang}
        setLang={setLang}
        loading={loading}
        mangaId={manga.id}
        mangaTitle={manga.title}
      />
    </div>
  );
}

"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchAllChapters, Chapter } from "@/service/mangaService";
import ChapterSidebar from "./ChapterSidebar";
import { MangaResponse } from "@/types/mangadex";
import { getTagIdByName, tagToSlug } from "@/service/tagService";
import { List, BookOpen, Tag, User, X, Star, Clock } from "lucide-react";

export default function MangaView({ manga }: { manga: MangaResponse }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState<string>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem("manga_lang") || "es"
      : "es",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const rating = manga.rating || 0;
  const statusLabel =
    manga.status === "completed"
      ? "Finalizado"
      : manga.status === "hiatus"
        ? "En Pausa"
        : "En Emisión";

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

  const firstChapter = useMemo(() => {
    if (chapters.length === 0) return null;
    const priority = ["es-la", "es", "en"];
    for (const l of priority) {
      const found = chapters.find((ch) => ch.language.toLowerCase() === l);
      if (found) return found;
    }
    return [...chapters].sort((a, b) => Number(a.number) - Number(b.number))[0];
  }, [chapters]);
  const noChaptersAvailable = chapters.length === 0 && !loading;
  const handleReadNow = () => {
    if (firstChapter)
      router.push(`/leer/${firstChapter.id}?lang=${firstChapter.language}`);
  };

  const handleTagClick = (tag: string) => {
    const tagId = getTagIdByName(tag);
    const slug = tagToSlug(tag);

    if (tagId) {
      router.push(`/library/${tagId}/${slug}`);
    } else {
      console.warn(`Tag ${tag} no encontrado, ignorando click.`); // Útil para depuración
    }
  };

  return (
    <div className="bg-[#0b101d] p-6 md:p-10 rounded-3xl border border-white/5 shadow-2xl select-none">
      <div className="flex flex-col md:flex-row gap-8">
        {/* PORTADA */}
        <div className="flex flex-col gap-4">
          <div
            className="relative w-full md:w-64 aspect-[2/3] overflow-hidden rounded-2xl cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={manga.coverUrl}
              alt={manga.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-[#0f1523] p-3 rounded-xl border border-white/5 flex flex-col items-center">
            <div className="flex text-yellow-400 gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  fill={i < Math.round(rating / 2) ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="text-sm font-bold text-white">
              {rating > 0 ? rating.toFixed(1) : "0.0"}{" "}
              <span className="text-gray-500">/ 10</span>
            </span>
          </div>
        </div>

        {/* DETALLES */}
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
            {manga.title}
          </h1>

          {/* AUTOR | ESTADO */}
          <div className="flex items-center gap-3 text-neutral-400 text-sm font-medium">
            <div className="flex items-center gap-2">
              <User size={16} />{" "}
              <span>{manga.author || "Autor Desconocido"}</span>
            </div>
            <span className="text-white/20">|</span>
            <Clock size={16} />{" "}
            <span className="text-pink-500 font-semibold">{statusLabel}</span>
          </div>

          {/* GENEROS (Estilo plano, no burbuja) */}
          <div className="mt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 block">
              Generos:
            </span>
            <div className="flex flex-wrap gap-2">
              {manga.tags?.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-gray-400 hover:text-white transition-colors"
                >
                  <Tag size={10} /> {tag}
                </button>
              ))}
            </div>
          </div>

          {/* DESCRIPCION */}
          <div className="mt-2">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
              Descripción
            </span>
            <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
              {manga.description}
            </p>
          </div>

          {/* BOTONES */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3 rounded-xl text-white transition-all w-full md:w-auto"
            >
              <List size={18} />{" "}
              <span className="hidden md:inline font-semibold">Capítulos</span>
              <span className="md:hidden font-semibold">Caps</span>
            </button>
            <button
              onClick={handleReadNow}
              disabled={loading || !firstChapter}
              className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-500 text-white px-8 py-3 rounded-xl font-bold transition-all w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                "Loading..."
              ) : !firstChapter ? (
                "Sin capítulos"
              ) : (
                <>
                  <BookOpen size={18} /> Leer
                </>
              )}
            </button>
          </div>
          {noChaptersAvailable && (
            <p className="text-pink-400/80 text-[12px] font-medium animate-pulse">
              No hay idiomas disponibles. Por favor, revisa el índice.
            </p>
          )}
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
          <Image
            src={manga.coverUrl}
            alt="Preview"
            width={400}
            height={600}
            className="rounded-lg shadow-2xl"
          />
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
  );
}

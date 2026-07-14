// rem-ai/app/leer/[id]/page.tsx
"use client";
import { useEffect, useState, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReaderHeader from "./components/ReaderHeader";
import ReaderView from "./components/ReaderView";
import ChapterSidebar from "@/components/manga/ChapterSidebar";
import { fetchAllChapters, Chapter } from "@/service/mangaService";

interface MangaData {
  mangaId: string;
  mangaTitle: string;
  author: string;
  chapterNum: string;
  volume: string;
  pages: string[];
  baseUrl: string;
  chapterHash: string;
  chaptersList: Chapter[];
}

function ReaderContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [readingMode, setReadingMode] = useState<"carousel" | "vertical">(
    () => {
      if (typeof window !== "undefined") {
        const savedMode = localStorage.getItem("reading_mode");
        return savedMode === "carousel" || savedMode === "vertical"
          ? savedMode
          : "carousel";
      }
      return "carousel";
    },
  );

  const [currentLang, setCurrentLang] = useState(() => {
    const langFromUrl = searchParams.get("lang");
    if (langFromUrl) return langFromUrl;
    if (typeof window !== "undefined")
      return localStorage.getItem("manga_lang") || "es";
    return "es";
  });

  const [data, setData] = useState<MangaData | null>(null);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleReadingMode = () => {
    const newMode = readingMode === "carousel" ? "vertical" : "carousel";
    setReadingMode(newMode);
    localStorage.setItem("reading_mode", newMode);
  };

  useEffect(() => {
    localStorage.setItem("manga_lang", currentLang);
  }, [currentLang]);

  useEffect(() => {
    fetch(`/api/read/${id}?lang=${currentLang}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        if (json.mangaId) {
          fetchAllChapters(json.mangaId).then((chapters) => {
            setChaptersList(chapters);
          });
        }
      })
      .catch((err) => console.error("Error cargando:", err));
  }, [id, currentLang]);

  useEffect(() => {
    if (data) {
      document.title = `Lectura - Cap ${data.chapterNum || "N/A"} | MangasRem`;
    }
  }, [data]);

  const navigateChapter = (direction: "prev" | "next") => {
    if (!chaptersList || chaptersList.length === 0) return;

    const langChapters = chaptersList.filter(
      (ch) => ch.language === currentLang,
    );
    const sortedChapters = [...langChapters].sort(
      (a, b) => parseFloat(a.number || "0") - parseFloat(b.number || "0"),
    );

    const currentIndex = sortedChapters.findIndex((ch) => ch.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (newIndex >= 0 && newIndex < sortedChapters.length) {
      router.push(`/leer/${sortedChapters[newIndex].id}?lang=${currentLang}`);
    }
  };

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a] text-white">
        <div className="animate-pulse">Cargando...</div>
      </div>
    );

  return (
    <main className="w-full bg-[#0a0f1a] min-h-screen">
      <ReaderHeader
        mangaTitle={data.mangaTitle}
        author={data.author}
        chapter={data.chapterNum}
        volume={data.volume}
        lang={currentLang}
        mangaId={data.mangaId}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onPrevChapter={() => navigateChapter("prev")}
        onNextChapter={() => navigateChapter("next")}
        readingMode={readingMode}
        onToggleReadingMode={toggleReadingMode}
      />

      {/* Renderizado condicional basado en el modo */}
      <ReaderView
        pages={data.pages}
        baseUrl={data.baseUrl}
        hash={data.chapterHash}
        mode={readingMode}
        onNextChapter={() => navigateChapter("next")}
        onPrevChapter={() => navigateChapter("prev")}
      />
      <ChapterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chapters={chaptersList}
        lang={currentLang}
        setLang={setCurrentLang}
        loading={chaptersList.length === 0}
      />
    </main>
  );
}

export default function LectorManga({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a] text-white">
          <div className="animate-pulse">Cargando...</div>
        </div>
      }
    >
      <ReaderContent id={id} />
    </Suspense>
  );
}

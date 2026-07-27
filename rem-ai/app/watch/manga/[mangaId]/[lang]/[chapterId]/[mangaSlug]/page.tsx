"use client";
import { useEffect, useState, use, Suspense } from "react";
import { useRouter } from "next/navigation";
import ReaderHeader from "./components/ReaderHeader";
import ReaderView from "./components/ReaderView";
import ReaderEndModal from "./components/ReaderEndModal";
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

const createSlug = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

interface ReaderContentProps {
  mangaId: string;
  lang: string;
  chapterId: string;
  mangaSlug: string;
}

function ReaderContent({ mangaId, lang, chapterId, mangaSlug }: ReaderContentProps) {
  const router = useRouter();

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

  const [currentLang, setCurrentLang] = useState(lang);
  const [data, setData] = useState<MangaData | null>(null);
  const [chaptersList, setChaptersList] = useState<Chapter[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);

  const toggleReadingMode = () => {
    const newMode = readingMode === "carousel" ? "vertical" : "carousel";
    setReadingMode(newMode);
    localStorage.setItem("reading_mode", newMode);
  };

  useEffect(() => {
    localStorage.setItem("manga_lang", currentLang);
  }, [currentLang]);

  useEffect(() => {
    if (currentLang !== lang) {
      if (data) {
        router.push(`/watch/manga/${mangaId}/${currentLang}/${chapterId}/${mangaSlug}`);
      }
    }
  }, [currentLang, lang, data, mangaId, chapterId, mangaSlug, router]);

  useEffect(() => {
    fetch(`/api/read/${chapterId}?lang=${currentLang}`)
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
  }, [chapterId, currentLang]);

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

    const sortedChapters = [...langChapters].sort((a, b) => {
      const volA = parseFloat(a.volume || "0");
      const volB = parseFloat(b.volume || "0");
      if (volA !== volB) return volA - volB;

      const numA = parseFloat(a.number || "0");
      const numB = parseFloat(b.number || "0");
      return numA - numB;
    });

    const currentIndex = sortedChapters.findIndex((ch) => ch.id === chapterId);
    if (currentIndex === -1) return;

    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;

    if (direction === "next" && newIndex >= sortedChapters.length) {
      setIsEndModalOpen(true);
      return;
    }

    if (newIndex >= 0 && newIndex < sortedChapters.length) {
      const nextChapter = sortedChapters[newIndex];
      const titleSlug = data?.mangaTitle ? createSlug(data.mangaTitle) : mangaSlug;
      router.push(`/watch/manga/${mangaId}/${currentLang}/${nextChapter.id}/${titleSlug}`);
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
        mangaId={data.mangaId}
        mangaTitle={data.mangaTitle}
      />

      <ReaderEndModal
        isOpen={isEndModalOpen}
        mangaTitle={data.mangaTitle}
        mangaId={data.mangaId}
        chapterNum={data.chapterNum}
        volume={data.volume}
        onClose={() => setIsEndModalOpen(false)}
      />
    </main>
  );
}

export default function LectorManga({
  params,
}: {
  params: Promise<{ mangaId: string; lang: string; chapterId: string; mangaSlug: string }>;
}) {
  const resolvedParams = use(params);
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#0a0f1a] text-white">
          <div className="animate-pulse">Cargando...</div>
        </div>
      }
    >
      <ReaderContent
        mangaId={resolvedParams.mangaId}
        lang={resolvedParams.lang}
        chapterId={resolvedParams.chapterId}
        mangaSlug={resolvedParams.mangaSlug}
      />
    </Suspense>
  );
}
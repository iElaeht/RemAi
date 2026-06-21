'use client';
import { useEffect, useState, use, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReaderHeader from './components/ReaderHeader';
import ReaderView from './components/ReaderView';
import ChapterSidebar from '@/components/manga/ChapterSidebar';
import { Chapter } from '@/service/mangaService';

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
  
  const [currentLang, setCurrentLang] = useState(() => {
    const langFromUrl = searchParams.get('lang');
    if (langFromUrl) return langFromUrl;
    if (typeof window !== 'undefined') return localStorage.getItem('manga_lang') || 'es';
    return 'es';
  });

  const [data, setData] = useState<MangaData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('manga_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    fetch(`/api/read/${id}?lang=${currentLang}`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Error cargando capítulo:", err));
  }, [id, currentLang]);
  
  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!data?.chaptersList) return;
    const langChapters = data.chaptersList.filter(ch => ch.language === currentLang);
    const currentIndex = langChapters.findIndex((ch) => ch.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < langChapters.length) {
      router.push(`/leer/${langChapters[newIndex].id}?lang=${currentLang}`);
    }
  };

  if (!data) return <div className="text-white p-10 min-h-screen bg-[#0a0f1a]">Cargando...</div>;

  return (
    <main className="w-full bg-[#0a0f1a] min-h-screen">
      <ReaderHeader
        mangaTitle={data.mangaTitle}
        author={data.author}
        chapter={data.chapterNum}
        volume={data.volume}
        lang={currentLang}
        onOpenSidebar={() => setIsSidebarOpen(true)}
        onPrevChapter={() => navigateChapter('prev')}
        onNextChapter={() => navigateChapter('next')}
      />

      <ReaderView 
        pages={data.pages} 
        baseUrl={data.baseUrl} 
        hash={data.chapterHash} 
        onNextChapter={() => navigateChapter('next')}
      />
      
      <ChapterSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chapters={data.chaptersList}
        lang={currentLang}
        setLang={setCurrentLang}
        loading={false}
        currentChapterId={id}
      />
    </main>
  );
}

export default function LectorManga({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense fallback={<div className="text-white p-10 min-h-screen bg-[#0a0f1a]">Cargando...</div>}>
      <ReaderContent id={id} />
    </Suspense>
  );
}
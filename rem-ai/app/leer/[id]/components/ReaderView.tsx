"use client";

import ReaderCarousel from "./ReaderCarousel";
import ReaderVertical from "./ReaderVertical";

interface ReaderViewProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  mode: "carousel" | "vertical"; // El modo viene de tus props o estado global
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export default function ReaderView({
  pages,
  baseUrl,
  hash,
  mode,
  onNextChapter,
  onPrevChapter,
}: ReaderViewProps) {
  
  // Decidimos qué renderizar basándonos en la prop 'mode'
  const ReaderComponent = mode === "carousel" ? ReaderCarousel : ReaderVertical;

  return (
    <div className="w-full min-h-screen">
      <ReaderComponent
        pages={pages}
        baseUrl={baseUrl}
        hash={hash}
        onNextChapter={onNextChapter}
        onPrevChapter={onPrevChapter}
      />
    </div>
  );
}
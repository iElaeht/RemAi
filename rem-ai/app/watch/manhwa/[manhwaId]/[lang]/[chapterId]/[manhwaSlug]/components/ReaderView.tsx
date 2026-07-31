"use client";

import ReaderCarousel from "./ReaderCarousel";
import ReaderVertical from "./ReaderVertical";
import ReaderWebtoon from "./ReaderWebtoon";

interface ReaderViewProps {
  pages: string[];
  baseUrl: string;
  hash: string;
  mode: "carousel" | "vertical" | "webtoon";
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
  let ReaderComponent = ReaderCarousel;
  if (mode === "vertical") {
    ReaderComponent = ReaderVertical;
  } else if (mode === "webtoon") {
    ReaderComponent = ReaderWebtoon;
  }

  return (
    <div className="w-full h-full overflow-hidden">
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
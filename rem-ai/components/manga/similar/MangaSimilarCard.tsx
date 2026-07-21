// components/manga/similar/MangaSimilarCard.tsx
import Link from "next/link";
import Image from "next/image";
import { MangaResponse } from "@/types/mangadex";

export default function MangaSimilarCard({ manga }: { manga: MangaResponse }) {
  return (
    <Link 
      href={`/manga/${manga.id}`}
      prefetch={false}
      className="group relative flex flex-col gap-3 w-32 md:w-40 flex-shrink-0 transition-transform duration-300 hover:-translate-y-1"
      title={manga.title}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-gray-900 ring-1 ring-white/10 shadow-lg group-hover:ring-pink-500/50 transition-all duration-300">
        <Image
          src={manga.coverUrl}
          alt={manga.title}
          fill
          sizes="(max-width: 768px) 128px, 160px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
          <span className="text-yellow-400 text-[10px]">★</span>
          <span className="text-white text-[10px] font-bold">{manga.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-sm font-medium text-gray-300 truncate group-hover:text-pink-400 transition-colors duration-300">
          {manga.title}
        </h3>
      </div>
    </Link>
  );
}
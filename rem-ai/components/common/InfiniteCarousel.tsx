"use client";
import { motion } from "framer-motion";
import { MangaResponse } from "@/types/mangadex";
import HomeMangaCard from "@/components/manga/HomeMangaCard";

export default function InfiniteCarousel({
  mangas,
}: {
  mangas: MangaResponse[];
}) {
  return (
    <div className="relative flex overflow-hidden mask-fade px-6 md:px-24">
      <motion.div
        className="flex gap-6"
        initial={{ x: 0 }}
        animate={{ x: "-50%" }}
        transition={{ duration: 60, ease: "linear", repeat: Infinity }}
      >
        {[...mangas, ...mangas].map((manga, index) => (
          <div
            key={`${manga.id}-${index}`}
            className="w-[200px] shrink-0"
            onContextMenu={(e) => e.preventDefault()}
          >
            <HomeMangaCard manga={manga} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

// components/manga/MangaDetailsContainer.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DescriptionTab from "./tabs/DescriptionTab";
import CharactersTab from "./tabs/characters";
import ArtTab from "./tabs/ArtTab";
import { MangaResponse } from "@/types/mangadex";

interface MangaDetailsContainerProps {
  manga: MangaResponse;
}

export default function MangaDetailsContainer({
  manga,
}: MangaDetailsContainerProps) {
  const [activeTab, setActiveTab] = useState("description");

  const tabs = [
    { id: "description", label: "Descripción" },
    { id: "characters", label: "Personajes" },
    { id: "art", label: "Artes" },
  ];

  return (
    <div className="w-full mt-6 sm:mt-8">
      {/* Navegador con color sólido, separadores y hover marcado */}
      <div className="relative flex items-center p-1.5 bg-[#121929] rounded-2xl border border-white/10 mb-4 sm:mb-6 shadow-md">
        {tabs.map((tab, index) => (
          <div key={tab.id} className="flex items-center flex-1">
            <button
              onClick={() => setActiveTab(tab.id)}
              className={`cursor-pointer relative z-10 w-full py-2.5 px-2 sm:px-4 text-xs sm:text-sm font-bold transition-all duration-300 text-center truncate rounded-xl ${
                activeTab === tab.id
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {tab.label}
            </button>

            {/* Separador visual sutil entre pestañas */}
            {index < tabs.length - 1 && (
              <div className="h-4 w-[1px] bg-white/10 mx-1 shrink-0" />
            )}
          </div>
        ))}

        {/* Selector animado con degradado y brillo */}
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute inset-y-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          initial={false}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        />
      </div>

      {/* Contenedor con transición de contenido */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "description" && (
            <DescriptionTab
              description={manga.description}
              sourceUrl={manga.descriptionUrl}
            />
          )}
          {activeTab === "characters" && (
            <CharactersTab characters={manga.characters} />
          )}
          {activeTab === "art" && (
            <ArtTab covers={manga.covers} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
// components/manga/tabs/characters.tsx
import Image from "next/image";
import { AniListCharacter } from "@/types/mangadex";

interface CharactersTabProps {
  characters?: AniListCharacter[];
}

export default function CharactersTab({ characters = [] }: CharactersTabProps) {
  if (!characters || characters.length === 0) {
    return (
      <div className="p-8 sm:p-12 text-center text-gray-400 text-xs sm:text-sm bg-[#121929] rounded-2xl border border-white/5">
        No hay información de personajes disponible.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-white font-bold text-sm sm:text-base">Personajes :</h3>
        <span className="text-xs text-gray-400 font-medium">{characters.length} personajes</span>
      </div>

      {/* Cuadrícula estilo AniList */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {characters.map((char) => (
          <div
            key={char.id}
            className="flex items-center bg-[#121929] rounded-xl border border-white/5 p-2.5 gap-3 hover:border-white/15 transition-all duration-300 shadow-md overflow-hidden group"
          >
            {/* Imagen del personaje (Estática sin zoom) */}
            <div className="relative w-14 h-16 sm:w-16 sm:h-20 shrink-0 rounded-lg overflow-hidden bg-gray-800">
              <Image
                src={char.image}
                alt={char.name}
                fill
                sizes="(max-width: 640px) 56px, 64px"
                className="object-cover"
              />
            </div>

            {/* Información del personaje */}
            <div className="flex flex-col justify-center min-w-0 flex-1">
              <h4 
                className="text-white font-bold text-xs sm:text-sm truncate group-hover:text-blue-400 transition-colors"
                title={char.name}
              >
                {char.name}
              </h4>
              <span className="inline-block mt-1 text-[10px] sm:text-xs font-semibold tracking-wider text-gray-400 uppercase">
                {char.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
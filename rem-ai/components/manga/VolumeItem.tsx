'use client';
import { usePathname } from 'next/navigation';
import { ChevronDown, CheckCircle2, Bookmark } from 'lucide-react';
import { VolumeGroup } from '@/utils/mangaUtils';
import { createSlug } from '@/utils/slugUtils';

interface Props {
  group: VolumeGroup;
  isOpen: boolean;
  onToggle: () => void;
  mangaId: string;
  mangaTitle: string;
}

export default function VolumeItem({ group, isOpen, onToggle, mangaId, mangaTitle }: Props) {
  const pathname = usePathname();
  const mangaSlug = createSlug(mangaTitle);

  // Detecta correctamente si la URL pertenece a "manhwa" o a "manga" sin importar si está en /details/ o /watch/
  const mediaType = pathname?.includes('/manhwa') ? 'manhwa' : 'manga';

  return (
    <div className="border-b border-white/5 last:border-none">
      {/* Encabezado del Volumen */}
      <button
        onClick={onToggle}
        className="w-full py-3.5 flex items-center justify-between group transition-all hover:bg-white/[0.02] px-2.5 rounded-xl cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-neutral-400 group-hover:text-neutral-200'}`}>
            <Bookmark size={16} />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-neutral-200 group-hover:text-white transition-colors">
                {group.volume === 'Sin Volumen' ? 'Otros Capítulos' : `Volumen ${group.volume}`}
              </span>
              {group.isComplete && <CheckCircle2 size={14} className="text-emerald-400" />}
            </div>
            <span className="text-[11px] text-neutral-400 font-medium">
              {group.count} {group.count === 1 ? 'capítulo' : 'capítulos'}
            </span>
          </div>
        </div>
        
        <ChevronDown 
          size={16} 
          className={`text-neutral-500 transition-transform duration-300 group-hover:text-neutral-300 ${isOpen ? 'rotate-180 text-red-400' : ''}`} 
        />
      </button>

      {/* Grid de Capítulos */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 pb-2' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-4 gap-2 pt-1 px-2">
            {group.chapters.map((ch) => (
              <a
                key={ch.id}
                // Ahora generará correctamente /watch/manhwa/... o /watch/manga/... según corresponda
                href={`/watch/${mediaType}/${mangaId}/${ch.language || 'es'}/${ch.id}/${mangaSlug}`}
                className="flex flex-col items-center justify-center py-2.5 px-1 bg-[#090d16] border border-white/5 rounded-xl 
                           hover:border-red-500/40 hover:bg-[#121929] transition-all duration-200 group/chapter cursor-pointer"
              >
                <div className="flex items-center gap-0.5 text-neutral-500 group-hover/chapter:text-red-400 transition-colors mb-0.5">
                  <span className="text-[9px] uppercase tracking-wider font-semibold">Cap</span>
                </div>
                <span className="text-xs font-bold text-neutral-300 group-hover/chapter:text-white transition-colors">
                  {ch.number || '0'}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
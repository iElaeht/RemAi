// components/manga/VolumeItem.tsx
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { VolumeGroup } from '@/utils/mangaUtils';

interface Props {
  group: VolumeGroup;
  isOpen: boolean;
  onToggle: () => void;
}

export default function VolumeItem({ group, isOpen, onToggle }: Props) {
  return (
    <div className="border-b border-white/5 last:border-none">
      {/* Encabezado del Volumen */}
      <button
        onClick={onToggle}
        className="w-full py-4 flex items-center justify-between group transition-all hover:bg-white/[0.02] px-2 rounded-lg"
      >
        <div className="flex flex-col items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-200 group-hover:text-pink-500 transition-colors">
              {group.volume === 'Sin Volumen' ? 'Otros Capítulos' : `Volumen ${group.volume}`}
            </span>
            {group.isComplete && <CheckCircle2 size={14} className="text-emerald-500/80" />}
          </div>
          <span className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">
            {group.count} capítulos
          </span>
        </div>
        
        <ChevronDown 
          size={18} 
          className={`text-gray-500 transition-transform duration-300 group-hover:text-pink-500 ${isOpen ? 'rotate-180 text-pink-500' : ''}`} 
        />
      </button>

      {/* Grid de Capítulos */}
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-4 gap-2 pb-4 pt-1 px-2">
            {group.chapters.map((ch) => (
              <a
                key={ch.id}
                href={`/leer/${ch.id}`}
                className="flex flex-col items-center justify-center p-2 bg-[#0f1420] border border-white/5 rounded-md 
                           hover:border-pink-500/50 hover:bg-[#151b29] transition-all duration-200 group/chapter"
              >
                <span className="text-[9px] text-gray-600 uppercase tracking-wider group-hover/chapter:text-pink-400/70">Cap</span>
                <span className="text-xs font-medium text-gray-300 group-hover/chapter:text-white">{ch.number || '0'}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
// rem-ai/components/features/SystemFilters.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, ListFilter, Check } from 'lucide-react';
import { SortOption, StatusOption } from '@/types/mangadex';

// Definimos una interfaz genérica T para que acepte cualquier tipo de valor (SortOption o StatusOption)
interface DropdownOption<T> {
  value: T;
  label: string;
}

interface CustomDropdownProps<T> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
}

// Usamos <T> en el componente para mantener la seguridad de tipos
const CustomDropdown = <T extends string>({ value, options, onChange }: CustomDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-[#0f1523] text-[11px] text-gray-200 p-3 rounded-xl border border-white/10 hover:border-pink-500/50 transition-all active:scale-[0.98]"
      >
        {selectedOption?.label || 'Seleccionar'}
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-pink-500' : 'text-gray-500'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-[#151b2e] border border-white/20 rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-3 py-2.5 text-[11px] flex items-center justify-between transition-colors 
                ${value === opt.value ? 'text-pink-400 bg-pink-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
            >
              {opt.label}
              {value === opt.value && <Check size={12} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface SystemFiltersProps {
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  status: StatusOption;
  setStatus: (val: StatusOption) => void;
}

export default function SystemFilters({ sortBy, setSortBy, status, setStatus }: SystemFiltersProps) {
  return (
    <div className="px-4 pb-6 mt-4 animate-in slide-in-from-top-2 border-b border-white/5">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <ListFilter size={12} className="text-pink-500" /> Filtros Generales
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        {/* Ahora los tipos son estrictos y no hay 'any' */}
        <CustomDropdown<SortOption> 
          value={sortBy} 
          onChange={setSortBy} 
          options={[
            { value: "latestUploadedChapter", label: "Más Recientes" },
            { value: "rating", label: "Mejor Valorados" },
            { value: "followedCount", label: "Más Populares" }
          ]} 
        />
        <CustomDropdown<StatusOption> 
          value={status} 
          onChange={setStatus} 
          options={[
            { value: "all", label: "Todos los estados" },
            { value: "ongoing", label: "En Emisión" },
            { value: "completed", label: "Finalizado" },
            { value: "hiatus", label: "En Pausa" }
          ]} 
        />
      </div>
    </div>
  );
}
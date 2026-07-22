'use client';
import { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronDown, ListFilter, Check } from 'lucide-react';
import { SortOption, StatusOption } from '@/types/mangadex';

// --- Interfaces ---
interface DropdownOption<T> {
  value: T;
  label: string;
}

interface CustomDropdownProps<T> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  onSelect?: () => void;
  theme: {
    boxBg: string;
    borderDefault: string;
    borderHover: string;
    textActive: string;
    bgActive: string;
    dropdownBg: string;
    borderDropdown: string;
  };
}

// --- Componente Dropdown Reutilizable con Estilos Dinámicos ---
const CustomDropdown = <T extends string>({ value, options, onChange, onSelect, theme }: CustomDropdownProps<T>) => {
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
        className={`w-full flex items-center justify-between ${theme.boxBg} text-[11px] text-gray-200 p-3 rounded-xl border ${theme.borderDefault} ${theme.borderHover} transition-all active:scale-[0.98] cursor-pointer`}
      >
        <span>{selectedOption?.label || 'Seleccionar'}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? `rotate-180 ${theme.textActive}` : 'text-gray-500'}`} />
      </button>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-2 w-full ${theme.dropdownBg} border ${theme.borderDropdown} rounded-xl shadow-2xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-200`}>
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { 
                onChange(opt.value); 
                setIsOpen(false); 
                onSelect?.(); 
              }}
              className={`w-full text-left px-3 py-2.5 text-[11px] flex items-center justify-between transition-colors cursor-pointer 
                ${value === opt.value ? `${theme.textActive} ${theme.bgActive}` : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}
            >
              <span>{opt.label}</span>
              {value === opt.value && <Check size={12} className={theme.textActive} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// --- Componente Principal SystemFilters ---
interface SystemFiltersProps {
  sortBy: SortOption;
  setSortBy: (val: SortOption) => void;
  status: StatusOption;
  setStatus: (val: StatusOption) => void;
  onFilterChange?: () => void;
}

export default function SystemFilters({ sortBy, setSortBy, status, setStatus, onFilterChange }: SystemFiltersProps) {
  const pathname = usePathname();
  const isManhwa = pathname.startsWith("/manhwas");

  // Configuración de temas visuales dinámicos adaptados al entorno
  const theme = isManhwa
    ? {
        iconColor: "text-red-500",
        boxBg: "bg-[#1f0c11]",
        borderDefault: "border-red-500/20",
        borderHover: "hover:border-red-500/50",
        textActive: "text-red-400",
        bgActive: "bg-red-500/10",
        dropdownBg: "bg-[#170a0d]",
        borderDropdown: "border-red-500/30",
      }
    : {
        iconColor: "text-pink-500",
        boxBg: "bg-[#131b2e]",
        borderDefault: "border-white/10",
        borderHover: "hover:border-pink-500/50",
        textActive: "text-pink-400",
        bgActive: "bg-pink-500/10",
        dropdownBg: "bg-[#0e1422]",
        borderDropdown: "border-white/20",
      };

  return (
    <div className="px-4 pb-6 mt-4 animate-in slide-in-from-top-2 border-b border-white/5">
      <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <ListFilter size={12} className={theme.iconColor} /> Filtros Generales
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <CustomDropdown<SortOption> 
          value={sortBy || "rating"} 
          onChange={setSortBy} 
          onSelect={onFilterChange} 
          theme={theme}
          options={[
            { value: "rating", label: "Mejor Valorados" },
            { value: "latestUploadedChapter", label: "Más Recientes" },
            { value: "followedCount", label: "Más Populares" }
          ]} 
        />
        <CustomDropdown<StatusOption> 
          value={status || "all"} 
          onChange={setStatus} 
          onSelect={onFilterChange} 
          theme={theme}
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
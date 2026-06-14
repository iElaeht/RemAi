'use client';
import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { TAG_CATEGORIES } from '@/types/tags';

interface SearchFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedTags: string[];
  toggleTag: (cat: string, tag: string) => void;
  onSearch: () => void;
  onClear: () => void;
}

export default function SearchFilter({ 
  searchQuery, setSearchQuery, selectedTags, toggleTag, onSearch, onClear 
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTagNameById = (id: string) => {
    const allCategories = TAG_CATEGORIES as Record<string, Record<string, string>>;
    for (const category in allCategories) {
      const tags = allCategories[category];
      for (const tagName in tags) {
        if (tags[tagName] === id) return tagName;
      }
    }
    return id;
  };

  const hasFilters = selectedTags.length > 0 || searchQuery.length > 0;

  return (
    <div ref={containerRef} className="max-w-2xl mx-auto mt-8 mb-12">
      <div className={`bg-[#111827] rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-300 ${isFilterOpen ? 'ring-1 ring-pink-500/50' : ''}`}>
        
        {/* BARRA DE BÚSQUEDA */}
        <div className="flex items-center p-2">
          <div className="pl-3 text-neutral-400"><Search size={20} /></div>
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e: KeyboardEvent) => e.key === 'Enter' && onSearch()}
            placeholder="Buscar manga..."
            className="w-full bg-transparent p-4 outline-none text-base placeholder:text-neutral-600 text-white"
          />
          
          {/* AHORA LA X ES SIEMPRE VISIBLE */}
          <button 
            onClick={() => setSearchQuery('')} 
            className={`p-2 transition-colors ${searchQuery ? 'text-neutral-300 hover:text-white' : 'text-neutral-700 cursor-default'}`}
          >
            <X size={18} />
          </button>

          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)} 
            className={`p-3 rounded-xl transition-all ${isFilterOpen ? 'bg-pink-500/20 text-pink-500' : 'text-neutral-400 hover:text-pink-500'}`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* ÁREA DE FILTROS ACTIVOS */}
        <div className="px-4 pb-4 border-t border-white/5 pt-3">
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs items-center min-h-[44px] flex-1">
              <span className="font-bold text-neutral-500 uppercase tracking-wider self-center">Filtros:</span>
              {!hasFilters ? (
                <span className="text-neutral-600 italic">No hay filtros seleccionados</span>
              ) : (
                <>
                  {searchQuery && <span className="text-pink-400 font-medium">{searchQuery}</span>}
                  {selectedTags.map(tagId => (
                    <span key={tagId} className="text-neutral-300 font-medium">• {getTagNameById(tagId)}</span>
                  ))}
                </>
              )}
            </div>

            {/* BOTONES ALINEADOS A LA DERECHA */}
            {hasFilters && (
              <div className="flex gap-4 items-center h-[44px]">
                <button onClick={onClear} className="text-xs text-neutral-500 hover:text-pink-500 underline transition-colors whitespace-nowrap">Limpiar filtros</button>
                <button onClick={onSearch} className="px-4 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-lg hover:bg-pink-600 transition-all whitespace-nowrap">Filtrar</button>
              </div>
            )}
          </div>
        </div>

        {/* PANEL DE SELECCIÓN */}
        {isFilterOpen && (
          <div className="border-t border-white/5 bg-[#0d1321] animate-in fade-in slide-in-from-top-2">
            {Object.entries(TAG_CATEGORIES as Record<string, Record<string, string>>).map(([category, tags]) => (
              <div key={category} className="border-b border-white/5">
                <button onClick={() => setActiveGroup(activeGroup === category ? null : category)} className="w-full p-4 flex justify-between items-center hover:bg-white/5">
                  <span className="text-pink-500 text-[10px] uppercase font-bold tracking-widest">{category}</span>
                  {activeGroup === category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {activeGroup === category && (
                  <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-2 bg-[#111827]/50">
                    {Object.entries(tags).map(([tagName, tagId]) => (
                      <button 
                        key={tagId} 
                        onClick={() => toggleTag(category, tagName)} 
                        className={`text-xs p-2 rounded-lg transition-all ${selectedTags.includes(tagId) ? 'bg-pink-500 text-white' : 'text-neutral-400 hover:bg-white/5'}`}
                      >
                        {tagName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
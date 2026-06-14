'use client';
import { useState, useEffect, KeyboardEvent } from 'react';
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
  const [placeholder, setPlaceholder] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const phrases = ["Buscar manga...", "Búsqueda rápida...", "Explorar géneros..."];

  useEffect(() => {
    if (searchQuery) return;
    const timeout = setTimeout(() => {
      setPlaceholder(phrases[index].substring(0, subIndex));
      if (!isDeleting && subIndex === phrases[index].length) setTimeout(() => setIsDeleting(true), 2000);
      else if (isDeleting && subIndex === 0) { setIsDeleting(false); setIndex((prev) => (prev + 1) % phrases.length); }
      else setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, index, searchQuery]);

  const getTagNameById = (id: string) => {
    const allCategories = TAG_CATEGORIES as Record<string, Record<string, string>>;
    for (const cat in allCategories) {
      if (allCategories[cat][id]) return id; // Simplificado
    }
    return id;
  };

  const handleClearClick = () => { onClear(); setIsFilterOpen(false); };
  const handleFilterClick = () => { onSearch(); setIsFilterOpen(false); };

  return (
    <div className="max-w-xl mx-auto mt-6 mb-8">
      <div className="bg-[#111827] rounded-xl border border-white/10 shadow-lg overflow-hidden">
        {/* Barra de búsqueda compacta */}
        <div className="flex items-center px-3">
          <Search size={18} className="text-neutral-500" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFilterClick()}
            placeholder={placeholder}
            className="w-full bg-transparent p-3 outline-none text-sm placeholder:text-neutral-600"
          />
          {searchQuery && (
            <button onClick={handleClearClick} className="text-neutral-500 hover:text-white mr-2"><X size={16} /></button>
          )}
          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className={`transition-colors ${isFilterOpen ? 'text-pink-500' : 'text-neutral-400'}`}>
            <Filter size={18} />
          </button>
        </div>

        {/* Panel de filtros */}
        {isFilterOpen && (
          <div className="border-t border-white/5 bg-[#0d1321]">
            {Object.entries(TAG_CATEGORIES as Record<string, Record<string, string>>).map(([category, tags]) => (
              <div key={category} className="border-b border-white/5 last:border-0">
                <button onClick={() => setActiveGroup(activeGroup === category ? null : category)} className="w-full px-4 py-3 flex justify-between items-center hover:bg-white/5">
                  <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-500">{category}</span>
                  {activeGroup === category ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {activeGroup === category && (
                  <div className="p-3 grid grid-cols-3 gap-2">
                    {Object.entries(tags).map(([tagName, tagId]) => (
                      <button key={tagName} onClick={() => toggleTag(category, tagName)} className={`text-[11px] py-1.5 px-2 rounded-md transition-all ${selectedTags.includes(tagId) ? 'bg-pink-500 text-white' : 'text-neutral-400 hover:bg-white/5'}`}>
                        {tagName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="p-3 flex justify-between items-center border-t border-white/5">
              <button onClick={handleClearClick} className="text-[11px] text-neutral-500 hover:text-white underline">Limpiar</button>
              <button onClick={handleFilterClick} className="px-4 py-1.5 bg-pink-500 text-white text-[11px] font-bold rounded-md hover:bg-pink-600">Aplicar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
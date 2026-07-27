"use client";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Home, Search, X, ArrowRight } from "lucide-react";

export default function QuickSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const baseCatalogRoute = "/manhwas";

  // Cerrar el buscador al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Enfocar el input automáticamente al abrirse
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleExecuteSearch = () => {
    if (!searchQuery.trim()) return;
    
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    setIsOpen(false);
    setSearchQuery("");
    
    router.push(`${baseCatalogRoute}?search=${encodedQuery}&page=1&sort=rating&status=all`);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleExecuteSearch();
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center gap-2">
      {/* Botón de la Casita con transición de salida fluida */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden flex items-center ${
          isOpen ? "w-0 opacity-0 -translate-x-2 pointer-events-none" : "w-9 opacity-100 translate-x-0"
        }`}
      >
        <button
          onClick={() => router.push(baseCatalogRoute)}
          title="Ir al catálogo"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/5 shrink-0 cursor-pointer"
        >
          <Home size={16} />
        </button>
      </div>

      {/* Contenedor del buscador con animación de expansión tipo slide suave */}
      <div
        className={`flex items-center bg-[#151c2f] border rounded-xl transition-all duration-300 ease-in-out shadow-lg overflow-hidden ${
          isOpen 
            ? "w-60 sm:w-68 px-2.5 py-1.5 border-red-500/50 opacity-100" 
            : "w-9 h-9 justify-center bg-white/5 border-white/5 hover:bg-white/10 opacity-90"
        }`}
      >
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            title="Buscar en el catálogo"
            className="w-full h-full flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <Search size={16} />
          </button>
        ) : (
          <div className="flex items-center w-full relative gap-1.5 animate-fadeIn">
            <Search size={14} className="text-gray-400 shrink-0 ml-1" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Buscar manhwa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
            />
            
            <button
              onClick={handleExecuteSearch}
              disabled={!searchQuery.trim()}
              className={`p-1 transition-colors ${searchQuery.trim() ? "text-red-400 hover:text-red-300 cursor-pointer" : "text-gray-600 cursor-default"}`}
              title="Ir a resultados"
            >
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                setSearchQuery("");
              }}
              className="text-gray-400 hover:text-white p-1 shrink-0 cursor-pointer"
              title="Cerrar"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
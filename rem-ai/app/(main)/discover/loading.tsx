export default function DiscoverLoading() {
  return (
    <main className="bg-neutral-950 text-white min-h-screen pb-20 select-none">
      
      {/* Esqueleto del Carrusel Principal / Banner */}
      <div className="w-full h-[350px] md:h-[450px] bg-white/5 animate-pulse relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-6 md:left-12 space-y-3">
          <div className="h-6 bg-white/10 rounded-md w-32" />
          <div className="h-10 bg-white/10 rounded-lg w-72 md:w-96" />
          <div className="h-4 bg-white/5 rounded-md w-48" />
        </div>
      </div>

      <div className="space-y-12 max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* Esqueletos de las Secciones (Tendencias, Seguir viendo, Categorías) */}
        {[...Array(4)].map((_, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4">
            {/* Título de la sección fantasma */}
            <div className="h-6 bg-white/10 rounded-md w-44 animate-pulse" />

            {/* Fila de tarjetas horizontales (Carrusel / Grid de sección) */}
            <div className="flex gap-4 overflow-hidden">
              {[...Array(6)].map((_, cardIndex) => (
                <div 
                  key={cardIndex} 
                  className="shrink-0 w-36 sm:w-44 aspect-[3/4] bg-white/5 rounded-2xl animate-pulse border border-white/5 flex flex-col justify-end p-3"
                >
                  <div className="h-3 bg-white/10 rounded w-4/5 mb-1" />
                  <div className="h-2.5 bg-white/5 rounded w-1/2" />
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </main>
  );
}
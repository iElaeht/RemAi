export default function ManhwaLoading() {
  return (
    <main className="bg-[#12080a] min-h-screen text-white p-4 md:p-6 lg:p-8">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-12 animate-pulse">
        
        {/* Esqueleto de la sección principal del manhwa */}
        <div className="flex flex-col md:flex-row gap-8 bg-[#1d0c10]/50 border border-red-500/10 p-6 rounded-3xl">
          {/* Portada fantasma */}
          <div className="w-full md:w-72 aspect-[3/4] bg-white/5 rounded-2xl shrink-0 mx-auto" />

          {/* Información fantasma */}
          <div className="flex flex-col flex-1 gap-4 justify-center">
            <div className="h-8 bg-white/10 rounded-lg w-3/4" />
            <div className="h-4 bg-white/5 rounded-md w-1/2" />
            <div className="flex gap-2 my-2">
              <div className="h-6 bg-white/5 rounded-full w-20" />
              <div className="h-6 bg-white/5 rounded-full w-20" />
              <div className="h-6 bg-white/5 rounded-full w-16" />
            </div>
            <div className="space-y-2 mt-2">
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-2/3" />
            </div>
            <div className="flex gap-4 mt-4">
              <div className="h-12 bg-red-600/20 rounded-xl w-36" />
              <div className="h-12 bg-white/5 rounded-xl w-36" />
            </div>
          </div>
        </div>

        {/* Esqueleto de Manhwas Similares */}
        <div className="space-y-4">
          <div className="h-6 bg-white/10 rounded-md w-48" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#1d0c10] rounded-xl border border-white/5" />
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
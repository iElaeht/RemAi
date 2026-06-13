import Link from "next/link"; // IMPORTANTE: Cambiamos Clerk por el Link nativo de Next.js

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 text-center bg-slate-950 relative min-h-screen">
      
      {/* Header Minimalista Superior */}
      <header className="absolute top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 h-20">
        {/* Lado izquierdo superior: Nombre del proyecto */}
        <div className="text-xl font-black tracking-wider text-white select-none">
          Rem<span className="text-blue-500">Ai</span>
        </div>

        {/* Lado derecho superior: Botones de autenticación con redirección limpia */}
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer py-2 px-3">
            Iniciar Sesión
          </Link>
          
          <Link href="/sign-up" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-md shadow-blue-600/10 transition-all transform hover:-translate-y-0.5 cursor-pointer">
            Registrarse
          </Link>
        </div>
      </header>

      {/* Contenido Central */}
      <div className="space-y-6 max-w-3xl animate-fade-in pt-12">
        {/* Etiqueta de estado del proyecto */}
        <div>
          <span className="inline-flex items-center px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase">
            Fase 1: Módulo de Autenticación
          </span>
        </div>
        
        {/* Título Principal */}
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white leading-tight">
          La nueva experiencia para <br />
          los amantes del <span className="text-blue-500">Manga</span>
        </h1>
        
        {/* Descripción corta */}
        <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto font-normal">
          Una plataforma limpia, inteligente, minimalista y diseñada por y para la comunidad. Sin interrupciones.
        </p>
      </div>

    </div>
  );
}
'use client';
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // Si estamos en el lector, forzamos la salida al detalle del manga
    if (pathname.includes("/leer/")) {
      // Intentamos extraer el ID del manga si es posible, o simplemente forzamos home/library
      router.push("/library"); 
      return;
    }

    // Si hay historial previo de navegación real, retrocedemos
    if (window.history.length > 2) {
      router.back();
    } else {
      // Fallback a rutas seguras
      const defaultRoute = pathname.includes("/manga/") ? "/library" : "/library";
      router.push(defaultRoute);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 bg-[#0b1120]/60 border border-white/5 hover:border-white/10 rounded-xl text-gray-400 hover:text-white transition-all active:scale-95 self-start"
    >
      <ArrowLeft size={16} />
      <span className="text-xs font-bold uppercase tracking-wider">Volver</span>
    </button>
  );
}
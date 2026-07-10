'use client';
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // 1. Si estamos en el lector, salida directa y única.
    // Usamos replace para que no haya historia que recorrer.
    if (pathname.includes("/leer/")) {
      router.replace("/library");
      return;
    }

    // 2. Si estamos en cualquier otra parte, intentamos volver atrás de forma segura.
    // Si no hay historia, simplemente vamos a la librería.
    // Esto evita el bucle porque no forzamos una redirección si ya estamos yendo atrás.
    router.back();
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
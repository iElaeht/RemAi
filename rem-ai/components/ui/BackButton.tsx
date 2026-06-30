"use client";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    // 1. Lógica de navegación basada en el contexto actual
    if (pathname.includes("/leer/")) {
      // Si estamos en un capítulo, extraemos el ID para volver al manga
      // (Asumiendo que el ID del manga está en el estado o es navegable)
      router.back(); // El navegador suele tener el manga en el historial anterior
    } else if (pathname.includes("/manga/")) {
      router.push("/library");
    } else if (pathname.includes("/library")) {
      router.push("/discover");
    } else {
      router.back();
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
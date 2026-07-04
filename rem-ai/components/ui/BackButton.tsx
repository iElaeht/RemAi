"use client";
import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      const defaultRoute = pathname.includes("/manga/") ? "/library" : "/discover";
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
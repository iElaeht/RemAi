// components/manga/FavoriteButton.tsx
"use client";

import { useState, useTransition } from "react";
import { Heart, Loader2 } from "lucide-react";

interface FavoriteButtonProps {
  userId: string | null;
  mangaId: string;
  title: string;
  coverImage: string;
  type: "manga" | "manhwa";
  initialIsFavorite: boolean;
}

export default function FavoriteButton({
  userId,
  mangaId,
  title,
  coverImage,
  type,
  initialIsFavorite,
}: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();
  const [showToast, setShowToast] = useState(false);
  const [pendingAction, setPendingAction] = useState<"adding" | "removing" | null>(null);

  const handleToggle = () => {
    if (!userId) {
      setShowToast((prev) => !prev);
      setTimeout(() => setShowToast(false), 3500);
      return;
    }

    const nextState = !isFav;
    setPendingAction(nextState ? "adding" : "removing");

    startTransition(async () => {
      setIsFav(nextState);
      try {
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mangaId, title, coverImage, type }),
        });

        const res = await response.json();

        if (!response.ok) {
          throw new Error(res.error || "Error al actualizar favoritos");
        }

        if (res.status === "added") setIsFav(true);
        if (res.status === "removed") setIsFav(false);
      } catch (error) {
        setIsFav(!nextState);
        console.error(error);
      } finally {
        setPendingAction(null);
      }
    });
  };

  const isLogged = !!userId;

  const isAdding = pendingAction === "adding";
  const isRemoving = pendingAction === "removing";

  // Mantiene el estilo visual correcto mientras se procesa la acción
  const buttonStyles = !isLogged
    ? "bg-white/5 border-white/5 text-neutral-500 opacity-60 cursor-not-allowed select-none"
    : isRemoving || (isFav && !isAdding)
    ? "bg-pink-600 border-pink-500 text-white hover:bg-pink-500 cursor-pointer"
    : "bg-white/5 border-white/10 text-neutral-300 hover:bg-white/10 hover:text-white cursor-pointer";

  const getButtonText = () => {
    if (isAdding) return "Añadiendo...";
    if (isRemoving) return "Quitando...";
    return isFav ? "Favorito" : "Añadir a favoritos";
  };

  return (
    <div className="relative inline-block w-full sm:w-auto group">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs md:text-sm transition-all border w-full sm:w-auto ${buttonStyles}`}
      >
        {isPending ? (
          <Loader2 size={18} className="animate-spin text-white" />
        ) : (
          <Heart
            size={18}
            className={!isLogged ? "text-neutral-600" : isFav ? "fill-white text-white" : "text-neutral-400"}
          />
        )}
        <span>{getButtonText()}</span>
      </button>

      {(showToast || !isLogged) && (
        <div 
          className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs text-center rounded-xl shadow-2xl z-50 transition-all duration-200 pointer-events-none ${
            showToast ? "block opacity-100 scale-100" : "hidden group-hover:block opacity-0 group-hover:opacity-100"
          }`}
        >
          Necesitas estar registrado o logueado para guardar en tus favoritos.
        </div>
      )}
    </div>
  );
}
// utils/mangaUtils.ts
import { Chapter } from "@/service/mangaService";

export interface VolumeGroup {
  volume: string;
  chapters: Chapter[];
  range: string;
  isComplete: boolean;
  count: number;
}

// Jerarquía de respaldo de idiomas por defecto
const FALLBACK_LANGUAGES = ["es-la", "es", "en", "pt-br", "pt", "fr", "it", "uk", "ja"];

export function groupChaptersByVolume(
  chapters: Chapter[],
  lang: string,
): VolumeGroup[] {
  if (!Array.isArray(chapters) || chapters.length === 0) return [];

  const langNormalized = (lang || "es").toLowerCase().trim();

  // 1. Intentamos filtrar primero con el idioma solicitado por el usuario
  let filtered = chapters.filter(
    (ch) => ch?.language?.toLowerCase().trim() === langNormalized,
  );

  // 2. Si no hay capítulos en ese idioma, aplicamos la jerarquía de respaldo automáticamente
  if (filtered.length === 0) {
    // Buscamos qué idiomas sí están disponibles en la lista de capítulos
    const availableLangs = Array.from(new Set(chapters.map((ch) => ch?.language?.toLowerCase().trim())));

    // Encontramos el primer idioma disponible según nuestra lista de prioridad
    let selectedFallback = FALLBACK_LANGUAGES.find((l) => availableLangs.includes(l));

    // Si ninguno de los preferidos está, agarramos el primero que exista en el array
    if (!selectedFallback && availableLangs.length > 0) {
      selectedFallback = availableLangs[0];
    }

    if (selectedFallback) {
      filtered = chapters.filter(
        (ch) => ch?.language?.toLowerCase().trim() === selectedFallback,
      );
    }
  }

  const grouped = filtered.reduce(
    (acc: Record<string, Chapter[]>, ch: Chapter) => {
      const volumeValue = ch.volume ?? ch.attributes?.volume;

      const vol =
        volumeValue != null && volumeValue !== ""
          ? String(volumeValue)
          : "Sin Volumen";

      if (!acc[vol]) acc[vol] = [];
      acc[vol].push(ch);
      return acc;
    },
    {},
  );

  // 3. Transformamos y ordenamos
  return Object.keys(grouped)
    .sort((a, b) => {
      if (a === "Sin Volumen") return 1;
      if (b === "Sin Volumen") return -1;
      return parseFloat(a) - parseFloat(b);
    })
    .map((vol) => {
      const vols = grouped[vol].sort(
        (a, b) => parseFloat(a.number || "0") - parseFloat(b.number || "0"),
      );

      const first = vols[0]?.number ?? "?";
      const last = vols[vols.length - 1]?.number ?? "?";

      return {
        volume: vol,
        chapters: vols,
        range:
          first === last ? `Capítulo ${first}` : `Capítulos ${first} - ${last}`,
        isComplete: vols.length >= 8,
        count: vols.length,
      };
    });
}
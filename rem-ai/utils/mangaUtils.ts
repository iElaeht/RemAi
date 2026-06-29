// utils/mangaUtils.ts
import { Chapter } from "@/service/mangaService";

export interface VolumeGroup {
  volume: string;
  chapters: Chapter[];
  range: string;
  isComplete: boolean;
  count: number;
}

/**
 * Blindado y tipado estrictamente.
 * Nota: Asumimos que Chapter puede tener 'volume' en el root o dentro de 'attributes'.
 */
export function groupChaptersByVolume(
  chapters: Chapter[],
  lang: string,
): VolumeGroup[] {
  if (!Array.isArray(chapters)) return [];

  const langNormalized = (lang || "es").toLowerCase().trim();
  const filtered = chapters.filter(
    (ch) => ch?.language?.toLowerCase().trim() === langNormalized,
  );
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

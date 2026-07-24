// lib/mangadex.ts
import { TAG_DICTIONARY } from "@/data/tagDictionary";
import { cache } from 'react';
import { MangaResponse, MangaCover, MangaDexCoverItem, MangaDexCoverResponse } from "@/types/mangadex";
import { fetchAniListMedia } from './anilist';

const MANGADEX_API_URL = "https://api.mangadex.org";
const MANGADEX_COVERS_URL = "https://uploads.mangadex.org";

interface MangaDexManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    altTitles: Array<Record<string, string>>;
    status: string;
    tags: Array<{ attributes: { name: { en: string } } }>;
  };
  relationships: Array<{
    type: string;
    attributes?: { name?: string; fileName?: string };
  }>;
}

async function fetchMangaRating(mangaId: string): Promise<number> {
  try {
    const res = await fetch(
      `https://api.mangadex.org/statistics/manga/${mangaId}`,
    );
    if (!res.ok) return 0;

    const json = await res.json();
    const rating = json.statistics?.[mangaId]?.rating?.average;

    return typeof rating === "number" ? rating : 0;
  } catch (e) {
    console.error("Error al obtener rating:", e);
    return 0;
  }
}

export async function fetchMangaCovers(mangaId: string): Promise<MangaCover[]> {
  try {
    const res = await fetch(
      `${MANGADEX_API_URL}/cover?manga[]=${mangaId}&limit=100&order[volume]=asc`
    );
    if (!res.ok) return [];

    const data: MangaDexCoverResponse = await res.json();
    if (!data.result || !data.data) return [];

    return data.data.map((cover: MangaDexCoverItem) => {
      const fileName = cover.attributes.fileName;
      const volume = cover.attributes.volume;
      const locale = cover.attributes.locale;
      const imageUrl = `${MANGADEX_COVERS_URL}/covers/${mangaId}/${fileName}.512.jpg`;

      return {
        id: cover.id,
        volume: volume || "Extra",
        fileName,
        imageUrl,
        locale,
      };
    });
  } catch (error) {
    console.error("Error al obtener portadas de MangaDex:", error);
    return [];
  }
}

export const getMangaById = cache(async (id: string): Promise<MangaResponse | null> => {
  try {
    const res = await fetch(`${MANGADEX_API_URL}/manga/${id}?includes[]=cover_art&includes[]=author`);
    if (!res.ok) return null;
    const json = await res.json();
    const attrs = json.data.attributes;

    const title = 
      attrs.title.es || 
      attrs.title["es-la"] || 
      attrs.title.en || 
      Object.values(attrs.title)[0] as string;
    
    const aniData = await fetchAniListMedia(title);
    const finalDesc = aniData ? aniData.description : "No hay descripción disponible.";
    const finalUrl = aniData ? aniData.url : undefined;
    const finalCharacters = aniData ? aniData.characters : [];
    const covers = await fetchMangaCovers(id);
    const mangaData = mapMangaData(json.data, await fetchMangaRating(id), finalDesc);
    
    return { 
      ...mangaData, 
      descriptionUrl: finalUrl,
      characters: finalCharacters,
      covers: covers 
    };
  } catch (e) {
    console.error("Error en getMangaById:", e);
    return null;
  }
});

function cleanDescription(desc: string): string {
  if (!desc) return "Sin descripción disponible.";
  return desc
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\n/g, " ")
    .trim();
}

function mapMangaData(
  manga: MangaDexManga,
  rating: number,
  customDesc?: string,
): MangaResponse {
  const attrs = manga.attributes;
  const statusMap: Record<string, string> = {
    ongoing: "En emisión",
    completed: "Finalizado",
    hiatus: "En pausa",
    cancelled: "Cancelado",
  };
  const title =
    attrs.title.es ||
    attrs.title["es-la"] ||
    attrs.title.en ||
    Object.values(attrs.title)[0] ||
    "Sin título";
  const rawDesc =
    attrs.description.es ||
    attrs.description["es-la"] ||
    attrs.description.en ||
    "";

  const coverFile = manga.relationships.find((r) => r.type === "cover_art")
    ?.attributes?.fileName;
  const authorName = manga.relationships.find((r) => r.type === "author")
    ?.attributes?.name;

  return {
    id: manga.id,
    title: title,
    author: authorName || "Autor desconocido",
    altTitles: attrs.altTitles || [],
    description: customDesc || cleanDescription(rawDesc),
    coverUrl: coverFile
      ? `${MANGADEX_COVERS_URL}/covers/${manga.id}/${coverFile}.512.jpg`
      : "/placeholder.jpg",
    status: statusMap[attrs.status] || "En curso",
    tags: attrs.tags.map((t) => t.attributes.name.en),
    rating: rating,
  };
}

async function fetchMangas(query: URLSearchParams): Promise<MangaResponse[]> {
  query.append("contentRating[]", "safe");
  ["cover_art", "author"].forEach((val) => query.append("includes[]", val));

  try {
    const res = await fetch(`${MANGADEX_API_URL}/manga?${query.toString()}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const json = await res.json();
    const data = (json.data || []) as MangaDexManga[];

    const ids = data.map((m) => m.id);
    const statsRes = await fetch(
      `${MANGADEX_API_URL}/statistics/manga?${ids.map((id) => `manga[]=${id}`).join("&")}`,
    );
    const statsJson = await statsRes.json();
    const statistics = statsJson.statistics || {};

    return data.map((manga) => {
      const rating = statistics[manga.id]?.rating?.average || 0;
      return mapMangaData(manga, rating);
    });
  } catch (e) {
    console.error("Error fetching mangas:", e);
    return [];
  }
}

export async function getMainManga(): Promise<MangaResponse[]> {
  const query = new URLSearchParams();
  query.append("limit", "15");
  query.append("order[rating]", "desc");
  query.append("availableTranslatedLanguage[]", "es");
  return fetchMangas(query);
}

export async function getFilterManga(
  genreTag: string,
  originalLanguages: string[] = ["ja"] // Por defecto japonés (manga), pero configurable
): Promise<MangaResponse[]> {
  const query = new URLSearchParams();
  query.append("limit", "10");
  query.append("includedTags[]", genreTag);
  query.append("availableTranslatedLanguage[]", "es");
  query.append("order[rating]", "desc");

  // Aplicar de forma limpia los idiomas de origen permitidos
  originalLanguages.forEach((lang) => {
    query.append("originalLanguage[]", lang);
  });

  return fetchMangas(query);
}
export async function getSimilarMangas(
  mangaId: string,
  tags: string[],
  contentType: "manga" | "manhwa" | "manhua" = "manga" // Recibimos el contexto actual
): Promise<MangaResponse[]> {
  const searchTags = tags
    .map((t) => TAG_DICTIONARY[t])
    .filter((id) => id !== undefined)
    .slice(0, 2);

  // Definimos los idiomas permitidos según el tipo de contenido en el que estamos navegando
  let allowedLanguages = ["ja"]; // Manga por defecto
  if (contentType === "manhwa") {
    allowedLanguages = ["ko", "zh"]; // Coreano y Chino para manhwa/manhua
  } else if (contentType === "manhua") {
    allowedLanguages = ["zh", "ko"];
  }

  const results = await Promise.all(
    searchTags.map((tagId) => getFilterManga(tagId, allowedLanguages)),
  );

  const flatResults = results.flat();
  const uniqueResults = Array.from(
    new Map(flatResults.map((m) => [m.id, m])).values(),
  )
    .filter((m) => m.id !== mangaId)
    .slice(0, 10);

  return uniqueResults;
}
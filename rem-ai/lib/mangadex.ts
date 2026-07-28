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
    originalLanguage: string;
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
      `${MANGADEX_API_URL}/statistics/manga/${mangaId}`,
      { next: { revalidate: 3600 } }
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

export const fetchMangaCovers = cache(async (mangaId: string): Promise<MangaCover[]> => {
  try {
    const res = await fetch(
      `${MANGADEX_API_URL}/cover?manga[]=${mangaId}&limit=100&order[volume]=asc`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];

    const data: MangaDexCoverResponse = await res.json();
    if (!data.result || !data.data) return [];

    return data.data.map((cover: MangaDexCoverItem) => {
      const fileName = cover.attributes.fileName;
      const volume = cover.attributes.volume;
      const locale = cover.attributes.locale;
      const rawImageUrl = `${MANGADEX_COVERS_URL}/covers/${mangaId}/${fileName}.512.jpg`;
      const imageUrl = `/api/proxy/pages?url=${encodeURIComponent(rawImageUrl)}`;

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
});

export const getMangaById = cache(async (id: string): Promise<MangaResponse | null> => {
  try {
    const res = await fetch(`${MANGADEX_API_URL}/manga/${id}?includes[]=cover_art&includes[]=author`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const attrs = json.data.attributes;

    const titlesToTry: string[] = [];
    const origLang = attrs.originalLanguage;

    // Priorización inteligente basada en el idioma original de la obra
    if (origLang === 'ko') {
      if (attrs.title.ko) titlesToTry.push(attrs.title.ko);
      if (attrs.title["ko-ro"]) titlesToTry.push(attrs.title["ko-ro"]);
      if (attrs.title.en) titlesToTry.push(attrs.title.en);
    } else if (origLang === 'zh') {
      if (attrs.title.zh) titlesToTry.push(attrs.title.zh);
      if (attrs.title["zh-ro"]) titlesToTry.push(attrs.title["zh-ro"]);
      if (attrs.title.en) titlesToTry.push(attrs.title.en);
    } else {
      if (attrs.title.ja) titlesToTry.push(attrs.title.ja);
      if (attrs.title.en) titlesToTry.push(attrs.title.en);
    }

    if (attrs.title["es-la"]) titlesToTry.push(attrs.title["es-la"]);
    if (attrs.title.es) titlesToTry.push(attrs.title.es);

    Object.values(attrs.title).forEach((t) => {
      if (t && typeof t === 'string') titlesToTry.push(t);
    });

    if (attrs.altTitles && Array.isArray(attrs.altTitles)) {
      attrs.altTitles.forEach((altObj: Record<string, string>) => {
        Object.values(altObj).forEach((altTitle) => {
          if (altTitle && typeof altTitle === 'string') {
            titlesToTry.push(altTitle);
          }
        });
      });
    }

    const uniqueTitlesToTry = Array.from(new Set(titlesToTry.filter(Boolean)));
    
    // AQUÍ ESTÁ EL CAMBIO CLAVE: Le pasamos 'id' (el UUID de MangaDex) para que la caché use `anilist-<uuid>`
    const [aniData, covers, rating] = await Promise.all([
      fetchAniListMedia(uniqueTitlesToTry, id),
      fetchMangaCovers(id),
      fetchMangaRating(id)
    ]);

    const finalDesc = aniData ? aniData.description : "No hay descripción disponible.";
    const finalUrl = aniData ? aniData.url : undefined;
    const finalCharacters = aniData ? aniData.characters : [];
    
    const mangaData = mapMangaData(json.data, rating, finalDesc);
    
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

  const rawCoverUrl = coverFile
    ? `${MANGADEX_COVERS_URL}/covers/${manga.id}/${coverFile}.256.jpg`
    : "";
  const coverUrl = rawCoverUrl 
    ? `/api/proxy/pages?url=${encodeURIComponent(rawCoverUrl)}` 
    : "/placeholder.jpg";

  return {
    id: manga.id,
    title: title,
    author: authorName || "Autor desconocido",
    altTitles: attrs.altTitles || [],
    description: customDesc || cleanDescription(rawDesc),
    coverUrl: coverUrl,
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

    if (data.length === 0) return [];

    const ids = data.map((m) => m.id);
    const statsRes = await fetch(
      `${MANGADEX_API_URL}/statistics/manga?${ids.map((id) => `manga[]=${id}`).join("&")}`,
      { next: { revalidate: 3600 } }
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

export const getMainManga = cache(async (): Promise<MangaResponse[]> => {
  const query = new URLSearchParams();
  query.append("limit", "15");
  query.append("order[rating]", "desc");
  query.append("availableTranslatedLanguage[]", "es");
  return fetchMangas(query);
});

export const getFilterManga = cache(async (
  genreTag: string,
  originalLanguages: string[] = ["ja"]
): Promise<MangaResponse[]> => {
  const query = new URLSearchParams();
  query.append("limit", "10");
  query.append("includedTags[]", genreTag);
  query.append("availableTranslatedLanguage[]", "es");
  query.append("order[rating]", "desc");

  originalLanguages.forEach((lang) => {
    query.append("originalLanguage[]", lang);
  });

  return fetchMangas(query);
});

export const getSimilarMangas = cache(async (
  mangaId: string,
  tags: string[],
  contentType: "manga" | "manhwa" | "manhua" = "manga"
): Promise<MangaResponse[]> => {
  const searchTags = tags
    .map((t) => TAG_DICTIONARY[t])
    .filter((id) => id !== undefined)
    .slice(0, 2);

  let allowedLanguages = ["ja"];
  if (contentType === "manhwa") {
    allowedLanguages = ["ko", "zh"];
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
});
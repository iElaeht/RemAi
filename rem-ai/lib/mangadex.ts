// lib/mangadex.ts
import { TAG_DICTIONARY } from "@/data/tagDictionary";
import { cache } from 'react';
import { MangaResponse } from "@/types/mangadex";
import { getTranslatedDescription } from './translator';

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
interface AniListResult {
  desc: string;
  url: string;
}
// Función auxiliar para obtener el rating real de MangaDex

async function fetchMangaRating(mangaId: string): Promise<number> {
  try {
    // Usamos el endpoint correcto según tu captura
    const res = await fetch(
      `https://api.mangadex.org/statistics/manga/${mangaId}`,
    );
    if (!res.ok) return 0;

    const json = await res.json();

    // Acceso corregido: eliminamos el ".md" que no existe
    const rating = json.statistics?.[mangaId]?.rating?.average;
    return typeof rating === "number" ? rating : 0;
  } catch (e) {
    console.error("Error al obtener rating:", e);
    return 0;
  }
}

export const getMangaById = cache(async (id: string): Promise<MangaResponse | null> => {
  try {
    const res = await fetch(`${MANGADEX_API_URL}/manga/${id}?includes[]=cover_art&includes[]=author`);
    if (!res.ok) return null;
    const json = await res.json();
    const attrs = json.data.attributes;

    const title = attrs.title.en || Object.values(attrs.title)[0] as string;
    
    // 1. Obtenemos el objeto de AniList (desc + url)
    const aniData = await fetchAniListDescription(title);
    
    let finalDesc = "No hay descripción disponible.";
    let finalUrl = undefined;

    if (aniData) {
      const cacheId = `anilist-${title.toLowerCase().replace(/\s+/g, '-')}`; 
      
      console.log("Consultando caché o traduciendo...");
      finalDesc = await getTranslatedDescription(cacheId, aniData.desc);
      finalUrl = aniData.url; 
    }

    // 2. Mapeamos los datos base
    const mangaData = mapMangaData(json.data, await fetchMangaRating(id), finalDesc);
    
    // 3. RETORNO CON BLINDAJE: 
    return { 
      ...mangaData, 
      descriptionUrl: finalUrl 
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

// Función base privada
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

    // --- OPTIMIZACIÓN AQUÍ ---
    // Recolectamos todos los IDs y hacemos UNA sola petición masiva
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
): Promise<MangaResponse[]> {
  const query = new URLSearchParams();
  query.append("limit", "10");
  query.append("includedTags[]", genreTag);
  query.append("availableTranslatedLanguage[]", "es");
  query.append("order[rating]", "desc");
  return fetchMangas(query);
}
export async function getSimilarMangas(
  mangaId: string,
  tags: string[],
): Promise<MangaResponse[]> {
  const searchTags = tags
    .map((t) => TAG_DICTIONARY[t])
    .filter((id) => id !== undefined)
    .slice(0, 2);

  const results = await Promise.all(
    searchTags.map((tagId) => getFilterManga(tagId)),
  );

  const flatResults = results.flat();

  const uniqueResults = Array.from(
    new Map(flatResults.map((m) => [m.id, m])).values(),
  )
    .filter((m) => m.id !== mangaId)
    .slice(0, 10);

  return uniqueResults;
}
async function fetchAniListDescription(title: string): Promise<AniListResult | null> {
  try {
    const query = `
      query ($search: String) { 
        Media(search: $search, type: MANGA) { 
          description(asHtml: false)
          siteUrl
        } 
      }`;
    
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { search: title } }),
    });
    
    const json = await res.json();
    const media = json?.data?.Media;
    
    if (!media || !media.description) return null;

    // Blindaje: Limpieza de texto y retorno del objeto completo
    return {
      desc: media.description
        .replace(/<[^>]+>/g, "")
        .replace(/\n/g, " ")
        .trim(),
      url: media.siteUrl || "https://anilist.co"
    };
  } catch (e) {
    console.error("Error al obtener datos de AniList:", e);
    return null;
  }
}
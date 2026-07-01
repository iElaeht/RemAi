// lib/mangadex.ts
import { MangaResponse } from '@/types/mangadex';

const MANGADEX_API_URL = 'https://api.mangadex.org';
const MANGADEX_COVERS_URL = 'https://uploads.mangadex.org';

interface MangaDexManga {
  id: string;
  attributes: {
    title: Record<string, string>;
    description: Record<string, string>;
    status: string;
    tags: Array<{ attributes: { name: { en: string } } }>;
  };
  relationships: Array<{
    type: string;
    attributes?: { name?: string; fileName?: string };
  }>;
}

// Función auxiliar para obtener el rating real de MangaDex

async function fetchMangaRating(mangaId: string): Promise<number> {
  try {
    // Usamos el endpoint correcto según tu captura
    const res = await fetch(`https://api.mangadex.org/statistics/manga/${mangaId}`);
    if (!res.ok) return 0;
    
    const json = await res.json();
    
    // Acceso corregido: eliminamos el ".md" que no existe
    const rating = json.statistics?.[mangaId]?.rating?.average;
    return typeof rating === 'number' ? rating : 0;
  } catch (e) {
    console.error("Error al obtener rating:", e);
    return 0;
  }
}

export async function getMangaById(id: string): Promise<MangaResponse | null> {
  try {
    const res = await fetch(`https://api.mangadex.org/manga/${id}?includes[]=cover_art&includes[]=author`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    
    const json = await res.json();
    const rating = await fetchMangaRating(id); // Ahora este valor sí llegará bien
    
    // Asumimos que mapMangaData ya está definido en tu archivo
    return mapMangaData(json.data, rating);
  } catch (e) {
    return null;
  }
}

function cleanDescription(desc: string): string {
  if (!desc) return 'Sin descripción disponible.';
  return desc
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/\n/g, ' ')
    .trim();
}

function mapMangaData(manga: MangaDexManga, rating: number): MangaResponse {
  const attrs = manga.attributes;
  const statusMap: Record<string, string> = {
    'ongoing': 'En emisión', 'completed': 'Finalizado', 'hiatus': 'En pausa', 'cancelled': 'Cancelado'
  };

  const title = attrs.title.es || attrs.title['es-la'] || attrs.title.en || Object.values(attrs.title)[0] || 'Sin título';
  const rawDesc = attrs.description.es || attrs.description['es-la'] || attrs.description.en || '';
  
  const coverFile = manga.relationships.find(r => r.type === 'cover_art')?.attributes?.fileName;
  const authorName = manga.relationships.find(r => r.type === 'author')?.attributes?.name;

  return {
    id: manga.id,
    title: title,
    author: authorName || 'Autor desconocido',
    description: cleanDescription(rawDesc),
    coverUrl: coverFile 
      ? `${MANGADEX_COVERS_URL}/covers/${manga.id}/${coverFile}.512.jpg` 
      : '/placeholder.jpg',
    status: statusMap[attrs.status] || 'En curso',
    tags: attrs.tags.map(t => t.attributes.name.en),
    rating: rating,
  };
}

// Función base privada
async function fetchMangas(query: URLSearchParams): Promise<MangaResponse[]> {
  query.append('contentRating[]', 'safe');
  ['cover_art', 'author'].forEach(val => query.append('includes[]', val));

  try {
    const res = await fetch(`${MANGADEX_API_URL}/manga?${query.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    
    const json = await res.json();
    const data = (json.data || []) as MangaDexManga[];
    const results: MangaResponse[] = [];
    for (const manga of data) {
      const rating = await fetchMangaRating(manga.id);
      results.push(mapMangaData(manga, rating));
    }
    
    return results;
  } catch (e) {
    console.error("Error fetching mangas:", e);
    return []; 
  }
}

export async function getMainManga(): Promise<MangaResponse[]> {
  const query = new URLSearchParams();
  query.append('limit', '15');
  query.append('order[rating]', 'desc');
  query.append('availableTranslatedLanguage[]', 'es'); 
  return fetchMangas(query);
}

export async function getFilterManga(genreTag: string): Promise<MangaResponse[]> {
  const query = new URLSearchParams();
  query.append('limit', '10');
  query.append('includedTags[]', genreTag);
  query.append('availableTranslatedLanguage[]', 'es');
  query.append('order[rating]', 'desc');
  return fetchMangas(query);
}
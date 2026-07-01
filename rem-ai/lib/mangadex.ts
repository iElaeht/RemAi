// lib/mangadex.ts
import { MangaResponse } from '@/types/mangadex';

// --- CONSTANTES ---
const MANGADEX_API_URL = 'https://api.mangadex.org';
const MANGADEX_COVERS_URL = 'https://uploads.mangadex.org';

// --- INTERFACES ---
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

interface MangaProxyResult {
  id: string;
  title: string;
  cover: string;
  tags: string[];
  author: string;
  rating: string | number;
  status: string;
}

interface MangaProxyResponse {
  results: MangaProxyResult[];
}

// --- FUNCIONES AUXILIARES DE PROCESAMIENTO ---

async function fetchMangaRating(mangaId: string): Promise<number> {
  try {
    const res = await fetch(`https://api.mangadex.org/statistics/manga/${mangaId}`);
    if (!res.ok) return 0;
    const json = await res.json();
    const rating = json.statistics?.[mangaId]?.rating?.average;
    return typeof rating === 'number' ? rating : 0;
  } catch (e) {
    return 0;
  }
}

function cleanDescription(desc: string): string {
  if (!desc) return 'Sin descripción disponible.';
  return desc.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1').replace(/\n/g, ' ').trim();
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
    coverUrl: coverFile ? `${MANGADEX_COVERS_URL}/covers/${manga.id}/${coverFile}.512.jpg` : '/placeholder.jpg',
    status: statusMap[attrs.status] || 'En curso',
    tags: attrs.tags.map(t => t.attributes.name.en),
    rating: rating,
  };
}

// --- EXPORTACIONES (API PROXY Y API DIRECTA) ---

export async function getMainManga(): Promise<MangaResponse[]> {
  try {
    const res = await fetch('/api/mangas?sort=rating&limit=15');
    if (!res.ok) return [];
    const data: MangaProxyResponse = await res.json();
    return data.results.map(m => ({
      id: m.id,
      title: m.title,
      author: m.author,
      description: "",
      coverUrl: m.cover,
      status: m.status,
      tags: m.tags,
      rating: typeof m.rating === 'string' ? parseFloat(m.rating) : m.rating,
    }));
  } catch (e) {
    return [];
  }
}

export async function getFilterManga(genreTag: string): Promise<MangaResponse[]> {
  try {
    const res = await fetch(`/api/mangas?tags=${encodeURIComponent(genreTag)}&sort=rating&limit=10`);
    if (!res.ok) return [];
    const data: MangaProxyResponse = await res.json();
    return data.results.map(m => ({
      id: m.id,
      title: m.title,
      author: m.author,
      description: "",
      coverUrl: m.cover,
      status: m.status,
      tags: m.tags,
      rating: typeof m.rating === 'string' ? parseFloat(m.rating) : m.rating,
    }));
  } catch (e) {
    return [];
  }
}

export async function getMangaById(id: string): Promise<MangaResponse | null> {
  try {
    const res = await fetch(`${MANGADEX_API_URL}/manga/${id}?includes[]=cover_art&includes[]=author`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();
    const rating = await fetchMangaRating(id);
    return mapMangaData(json.data, rating);
  } catch (e) {
    return null;
  }
}